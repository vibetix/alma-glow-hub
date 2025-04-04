
import React, { useEffect, useState } from "react";
import { UserLayout } from "@/components/UserLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, AlertCircle, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

type Order = {
  id: string;
  created_at: string;
  total: number;
  status: string;
  items: OrderItem[];
};

type OrderItem = {
  id: string;
  product_name: string;
  price: number;
  quantity: number;
  product_id: string | null;
};

const UserOrders = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('id, created_at, total, status')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (ordersError) throw ordersError;
        
        // Fetch order items for each order
        const ordersWithItems = await Promise.all((ordersData || []).map(async (order) => {
          const { data: itemsData, error: itemsError } = await supabase
            .from('order_items')
            .select('id, product_name, price, quantity, product_id')
            .eq('order_id', order.id);
          
          if (itemsError) throw itemsError;
          
          return {
            ...order,
            items: itemsData || []
          };
        }));
        
        setOrders(ordersWithItems);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast({
          title: "Error Loading Orders",
          description: "Failed to load your orders. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user?.id) {
      fetchOrders();
    }
  }, [user?.id]);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge className="bg-green-500">Delivered</Badge>;
      case 'shipped':
        return <Badge className="bg-blue-500">Shipped</Badge>;
      case 'processing':
        return <Badge className="bg-yellow-500">Processing</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Cancelled</Badge>;
      case 'pending':
        return <Badge className="bg-gray-500">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Filter orders by status
  const processingOrders = orders.filter(
    order => order.status === 'processing' || order.status === 'pending' || order.status === 'shipped'
  );
  
  const completedOrders = orders.filter(
    order => order.status === 'delivered'
  );
  
  const cancelledOrders = orders.filter(
    order => order.status === 'cancelled'
  );
  
  return (
    <UserLayout title="My Orders">
      <Tabs defaultValue="processing" className="space-y-4">
        <TabsList>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          <TabsTrigger value="all">All Orders</TabsTrigger>
        </TabsList>
        
        <div className="flex justify-end">
          <Button className="bg-alma-gold hover:bg-alma-gold/90" asChild>
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </div>
        
        <TabsContent value="processing" className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          ) : processingOrders.length > 0 ? (
            processingOrders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))
          ) : (
            <EmptyState message="You don't have any processing orders." />
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          ) : completedOrders.length > 0 ? (
            completedOrders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))
          ) : (
            <EmptyState message="You don't have any completed orders." />
          )}
        </TabsContent>
        
        <TabsContent value="cancelled" className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          ) : cancelledOrders.length > 0 ? (
            cancelledOrders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))
          ) : (
            <EmptyState message="You don't have any cancelled orders." />
          )}
        </TabsContent>
        
        <TabsContent value="all" className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          ) : orders.length > 0 ? (
            orders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))
          ) : (
            <EmptyState message="You don't have any orders yet." />
          )}
        </TabsContent>
      </Tabs>
    </UserLayout>
  );
};

const OrderCard = ({ order }: { order: Order }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-medium">
            Order #{order.id.substring(0, 8)}
          </CardTitle>
          <p className="text-sm text-gray-500">
            {format(new Date(order.created_at), "MMMM d, yyyy")}
          </p>
        </div>
        {getStatusBadge(order.status)}
      </CardHeader>
      
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">
              Items: {order.items.length}
            </p>
            <p className="font-medium text-lg">
              Total: ${order.total.toFixed(2)}
            </p>
          </div>
          
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 mr-2" />
                ) : (
                  <ChevronDown className="h-4 w-4 mr-2" />
                )}
                {isOpen ? "Hide Details" : "View Details"}
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="mt-4 space-y-4">
              <div className="border rounded-md overflow-hidden">
                <div className="grid grid-cols-3 bg-gray-50 p-2 text-xs font-medium text-gray-700">
                  <div>Product</div>
                  <div className="text-center">Quantity</div>
                  <div className="text-right">Price</div>
                </div>
                
                {order.items.map(item => (
                  <div key={item.id} className="grid grid-cols-3 p-3 border-t">
                    <div>
                      <Link 
                        to={item.product_id ? `/product/${item.product_id}` : "#"} 
                        className="text-alma-gold hover:underline"
                      >
                        {item.product_name}
                      </Link>
                    </div>
                    <div className="text-center">{item.quantity}</div>
                    <div className="text-right">${item.price.toFixed(2)}</div>
                  </div>
                ))}
                
                <div className="grid grid-cols-3 p-3 border-t bg-gray-50">
                  <div className="col-span-2 font-medium text-right">Total:</div>
                  <div className="text-right font-medium">${order.total.toFixed(2)}</div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end space-x-2">
        {order.status === 'delivered' && (
          <Button variant="outline" size="sm">Buy Again</Button>
        )}
        
        {(order.status === 'processing' || order.status === 'pending') && (
          <Button variant="destructive" size="sm">Cancel Order</Button>
        )}
        
        <Button variant="outline" size="sm">
          <ExternalLink className="h-4 w-4 mr-2" />
          Track Order
        </Button>
      </CardFooter>
    </Card>
  );
};

const EmptyState = ({ message }: { message: string }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Package className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900">{message}</h3>
      <p className="mt-2 text-sm text-gray-500">
        Browse our shop to discover amazing beauty products.
      </p>
      <Button className="mt-6 bg-alma-gold hover:bg-alma-gold/90" asChild>
        <Link to="/shop">Shop Now</Link>
      </Button>
    </div>
  );
};

export default UserOrders;
