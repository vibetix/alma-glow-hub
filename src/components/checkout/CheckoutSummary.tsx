
import React from "react";
import { Card } from "@/components/ui/card";

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
}

export const CheckoutSummary = ({
  cartItems,
  subtotal,
  tax,
  shipping,
  total
}: CheckoutSummaryProps) => {
  return (
    <Card className="p-6 sticky top-32">
      <h2 className="text-xl font-medium mb-4">Order Summary</h2>
      
      <div className="max-h-64 overflow-y-auto mb-4">
        {cartItems.map((item) => (
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
