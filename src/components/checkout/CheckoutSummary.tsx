
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from '@/integrations/supabase/client';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CheckoutSummaryProps {
  cartItems: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  orderId?: string;
}

export const CheckoutSummary = ({
  cartItems,
  subtotal,
  tax,
  shipping,
  total,
  orderId
}: CheckoutSummaryProps) => {
  const [orderItems, setOrderItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If we have an orderId, fetch the order items from Supabase
    const fetchOrderItems = async () => {
      if (!orderId) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('order_items')
          .select(`
            id,
            product_name as name,
            price,
            quantity,
            products (
              image_url
            )
          `)
          .eq('order_id', orderId);
          
        if (error) {
          throw error;
        }
        
        const formattedItems = data.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.products?.image_url || '/placeholder.svg',
        }));
        
        setOrderItems(formattedItems);
      } catch (err) {
        console.error('Error fetching order items:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderItems();
  }, [orderId]);

  // Use cartItems by default, but if we have orderItems from the database, use those instead
  const displayItems = orderItems.length > 0 ? orderItems : cartItems;

  return (
    <Card className="p-6 sticky top-32">
      <h2 className="text-xl font-medium mb-4">Order Summary</h2>
      
      {loading ? (
        <div className="space-y-4 mb-4">
          <div className="flex py-3">
            <Skeleton className="w-16 h-16 rounded" />
            <div className="ml-4 flex-grow">
              <Skeleton className="h-4 w-32 mb-2" />
              <div className="flex justify-between mt-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
          <div className="flex py-3">
            <Skeleton className="w-16 h-16 rounded" />
            <div className="ml-4 flex-grow">
              <Skeleton className="h-4 w-32 mb-2" />
              <div className="flex justify-between mt-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-h-64 overflow-y-auto mb-4">
          {displayItems.map((item) => (
            <div key={item.id} className="flex py-3 border-b last:border-0">
              <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="ml-4 flex-grow">
                <h4 className="font-medium">{item.name}</h4>
                <div className="flex justify-between mt-1">
                  <span className="text-gray-500">Qty: {item.quantity}</span>
                  <span>₵{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="space-y-3 pt-3 border-t">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₵{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>₵{tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : `₵${shipping.toFixed(2)}`}</span>
        </div>
        
        <div className="pt-3 border-t flex justify-between font-medium text-lg">
          <span>Total</span>
          <span>₵{total.toFixed(2)}</span>
        </div>
      </div>
    </Card>
  );
};
