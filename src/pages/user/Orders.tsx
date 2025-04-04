
import React, { useEffect, useState } from "react";
import { UserLayout } from "@/components/UserLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Package, DollarSign, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { formatDistance } from "date-fns";
import { Order } from "@/types/database";

const UserOrders = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('orders')
          .select(`
            id,
            total,
            status,
            created_at,
            shipping_fee,
            tax,
            shipping_address
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setOrders(data || []);
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
  
  // Helper function to get appropriate status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'processing':
        return <Badge className="bg-blue-500">Processing</Badge>;
      case 'shipping':
        return <Badge className="bg-purple-500">Shipping</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Cancelled</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Helper function to get relative time
  const getRelativeTime = (dateString: string) => {
    try {
      const orderDate = new Date(dateString);
      return formatDistance(orderDate, new Date(), { addSuffix: true });
    } catch (e) {
      return "Invalid date";
    }
  };
  
  // Filter orders by status
  const activeOrders = orders.filter(
    order => ['pending', 'processing', 'shipping'].includes(order.status || '')
  );
  
  const completedOrders = orders.filter(
    order => order.status === 'completed'
  );
  
  const cancelledOrders = orders.filter(
    order => order.status === 'cancelled'
  );
  
  return (
    <UserLayout title="My Orders">
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
        
        <div className="flex justify-end">
          <Button className="bg-alma-gold hover:bg-alma-gold/90">
            Continue Shopping
          </Button>
        </div>
        
        <TabsContent value="active" className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          ) : activeOrders.length > 0 ? (
            activeOrders.map(order => (
              <OrderCard 
                key={order.id} 
                order={order} 
                getStatusBadge={getStatusBadge}
                getRelativeTime={getRelativeTime}
              />
            ))
          ) : (
            <EmptyState message="You don't have any active orders." />
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
              <OrderCard 
                key={order.id} 
                order={order} 
                getStatusBadge={getStatusBadge}
                getRelativeTime={getRelativeTime}
              />
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
              <OrderCard 
                key={order.id} 
                order={order} 
                getStatusBadge={getStatusBadge}
                getRelativeTime={getRelativeTime}
              />
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
              <OrderCard 
                key={order.id} 
                order={order} 
                getStatusBadge={getStatusBadge}
                getRelativeTime={getRelativeTime}
              />
            ))
          ) : (
            <EmptyState message="You don't have any orders." />
          )}
        </TabsContent>
      </Tabs>
    </UserLayout>
  );
};

interface OrderCardProps {
  order: Order;
  getStatusBadge: (status: string) => React.ReactNode;
  getRelativeTime: (dateString: string) => string;
}

const OrderCard = ({ 
  order, 
  getStatusBadge, 
  getRelativeTime 
}: OrderCardProps) => {
  return (
    <Card key={order.id}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">
          Order #{order.id.slice(-6)}
        </CardTitle>
        {getStatusBadge(order.status || 'pending')}
      </CardHeader>
      
      <CardContent className="space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center text-gray-700">
            <Calendar className="mr-2 h-4 w-4" />
            <span>{new Date(order.created_at).toLocaleDateString()}</span>
            <span className="text-xs text-gray-500 ml-2">
              ({getRelativeTime(order.created_at)})
            </span>
          </div>
          
          <div className="flex items-center text-gray-700">
            <DollarSign className="mr-2 h-4 w-4" />
            <span>Total: ${order.total.toFixed(2)}</span>
          </div>
          
          {order.shipping_address && (
            <div className="flex items-center text-gray-700 col-span-2">
              <Package className="mr-2 h-4 w-4 flex-shrink-0" />
              <span className="truncate">
                Shipping to: {formatAddress(order.shipping_address)}
              </span>
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t flex justify-end space-x-2">
          <Button variant="outline" size="sm">View Details</Button>
          {order.status === 'pending' && (
            <Button variant="destructive" size="sm">Cancel Order</Button>
          )}
          {order.status === 'completed' && (
            <Button variant="outline" size="sm">Buy Again</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const formatAddress = (address: any) => {
  if (!address) return 'No address provided';
  
  try {
    const addr = typeof address === 'string' ? JSON.parse(address) : address;
    return `${addr.street || ''}, ${addr.city || ''}, ${addr.state || ''} ${addr.zip || ''}`;
  } catch (e) {
    return 'Invalid address format';
  }
};

const EmptyState = ({ message }: { message: string }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900">{message}</h3>
      <p className="mt-2 text-sm text-gray-500">
        Check out our shop to place your first order.
      </p>
      <Button className="mt-6 bg-alma-gold hover:bg-alma-gold/90" 
        onClick={() => window.location.href = '/shop'}>
        Visit Shop
      </Button>
    </div>
  );
};

export default UserOrders;
