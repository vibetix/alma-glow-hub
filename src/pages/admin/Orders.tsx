import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { 
  Search, 
  Filter, 
  PackageCheck, 
  PackageX, 
  CreditCard, 
  Truck, 
  ShoppingBag,
  Package,
  Loader2
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatCedis } from "@/lib/formatters";
import { Order, OrderItem, Product } from "@/types/database";

interface ExtendedOrder extends Order {
  items: (OrderItem & {product?: Product})[];
  customer: {
    name: string;
    email: string;
  };
}

const Orders = () => {
  const [orders, setOrders] = useState<ExtendedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<ExtendedOrder | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  
  useEffect(() => {
    fetchOrders();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('orders-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' }, 
        (payload) => {
          console.log('Orders change received:', payload);
          fetchOrders();
        }
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'order_items' }, 
        (payload) => {
          console.log('Order items change received:', payload);
          fetchOrders();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (ordersError) throw ordersError;
      
      const extendedOrders: ExtendedOrder[] = [];
      
      // For each order, get customer details and order items
      for (const order of (ordersData || [])) {
        // Get order items
        const { data: orderItems, error: itemsError } = await supabase
          .from('order_items')
          .select(`*, product:product_id (*)`)
          .eq('order_id', order.id);
          
        if (itemsError) {
          console.error("Error fetching order items:", itemsError);
        }
        
        // Get customer details
        let customerName = "Guest";
        let customerEmail = "guest@example.com";
        
        if (order.user_id) {
          // Get profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', order.user_id)
            .maybeSingle();
            
          if (profileError && profileError.code !== 'PGRST116') {
            console.error("Error fetching profile:", profileError);
          }
          
          // Get user email
          const { data: userData, error: userError } = await supabase.auth.admin.getUserById(
            order.user_id
          );
          
          if (userError) {
            console.error("Error fetching user data:", userError);
          }
          
          if (profile) {
            customerName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
          }
          
          if (userData) {
            customerEmail = userData.user.email || customerEmail;
          }
        }
        
        extendedOrders.push({
          ...order,
          items: orderItems || [],
          customer: {
            name: customerName,
            email: customerEmail
          }
        });
      }
      
      setOrders(extendedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Failed to load orders",
        description: "There was an error loading the orders data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter orders based on search and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    const matchesTab = 
      activeTab === "all" || 
      order.status === activeTab;
    
    return matchesSearch && matchesStatus && matchesTab;
  });

  const openDetailsModal = (order: ExtendedOrder) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);
        
      if (error) throw error;
      
      // Also update the selected order if it's currently being viewed
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus as any });
      }
      
      toast({
        title: "Order updated",
        description: `Order status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Failed to update order",
        description: "There was an error updating the order status.",
        variant: "destructive",
      });
    }
  };

  // Get status icon based on order status
  const getStatusIcon = (status: string) => {
    switch(status) {
      case "delivered":
        return <PackageCheck className="h-4 w-4 text-green-500" />;
      case "shipped":
        return <Truck className="h-4 w-4 text-blue-500" />;
      case "pending":
        return <Package className="h-4 w-4 text-yellow-500" />;
      case "cancelled":
        return <PackageX className="h-4 w-4 text-red-500" />;
      default:
        return <ShoppingBag className="h-4 w-4" />;
    }
  };

  return (
    <AdminLayout title="Order Management">
      <div className="space-y-6">
        <Tabs
          defaultValue="all"
          className="w-full"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <div className="flex justify-between items-center mb-6 overflow-x-auto">
            <TabsList>
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="shipped">Shipped</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>Orders</CardTitle>
                    <CardDescription>
                      Manage customer orders and shipments
                    </CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search orders..."
                        className="pl-8 w-full md:w-[300px]"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Filter status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-10">
                            <div className="flex justify-center">
                              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                            <div className="mt-2 text-sm text-muted-foreground">
                              Loading orders...
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : filteredOrders.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="text-center py-6 text-muted-foreground"
                          >
                            No orders found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-mono text-xs">{order.id.substring(0, 8)}...</TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">
                                  {order.customer.name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {order.customer.email}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {format(new Date(order.created_at), "MMM d, yyyy")}
                            </TableCell>
                            <TableCell>
                              {formatCedis(order.total)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                {getStatusIcon(order.status)}
                                <span className="ml-2 capitalize">
                                  {order.status}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                order.status === "delivered" || order.status === "shipped" 
                                  ? "bg-green-100 text-green-800" 
                                  : order.status === "pending" || order.status === "processing"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}>
                                <CreditCard className="mr-1 h-3 w-3" />
                                {order.status === "cancelled" ? "failed" : 
                                 (order.status === "delivered" || order.status === "shipped") ? "completed" : "pending"}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openDetailsModal(order)}
                              >
                                Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Other tab contents use the same table but filtered by status */}
          {["pending", "processing", "shipped", "delivered", "cancelled"].map(status => (
            <TabsContent key={status} value={status} className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{status.charAt(0).toUpperCase() + status.slice(1)} Orders</CardTitle>
                  <CardDescription>Orders with {status} status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Payment</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-10">
                              <div className="flex justify-center">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                              </div>
                              <div className="mt-2 text-sm text-muted-foreground">
                                Loading orders...
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : filteredOrders.filter(order => order.status === status).length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={7}
                              className="text-center py-6 text-muted-foreground"
                            >
                              No orders found.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredOrders.filter(order => order.status === status).map((order) => (
                            <TableRow key={order.id}>
                              <TableCell className="font-mono text-xs">{order.id.substring(0, 8)}...</TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium">
                                    {order.customer.name}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {order.customer.email}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                {format(new Date(order.created_at), "MMM d, yyyy")}
                              </TableCell>
                              <TableCell>
                                {formatCedis(order.total)}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  {getStatusIcon(order.status)}
                                  <span className="ml-2 capitalize">
                                    {order.status}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                  order.status === "delivered" || order.status === "shipped" 
                                    ? "bg-green-100 text-green-800" 
                                    : order.status === "pending" || order.status === "processing"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}>
                                  <CreditCard className="mr-1 h-3 w-3" />
                                  {order.status === "cancelled" ? "failed" : 
                                  (order.status === "delivered" || order.status === "shipped") ? "completed" : "pending"}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openDetailsModal(order)}
                                >
                                  Details
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Order Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              {selectedOrder && `Order ID: ${selectedOrder.id}`}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6 max-w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Customer</h3>
                  <p className="font-medium">{selectedOrder.customer.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.customer.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
                  <p className="font-medium">{format(new Date(selectedOrder.created_at), "PPP")}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <Select
                    defaultValue={selectedOrder.status}
                    onValueChange={(value) => updateOrderStatus(selectedOrder.id, value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Payment</h3>
                  <p className={`font-medium capitalize ${
                    selectedOrder.status === "delivered" || selectedOrder.status === "shipped" 
                      ? "text-green-600" 
                      : selectedOrder.status === "pending" || selectedOrder.status === "processing"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}>
                    {selectedOrder.status === "cancelled" ? "failed" : 
                     (selectedOrder.status === "delivered" || selectedOrder.status === "shipped") ? "completed" : "pending"}
                  </p>
                </div>
              </div>
              
              {selectedOrder.payment_intent_id && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Payment Details</h3>
                  <p className="font-medium font-mono text-xs">{selectedOrder.payment_intent_id}</p>
                </div>
              )}
              
              {selectedOrder.shipping_address && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Shipping Address</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    {typeof selectedOrder.shipping_address === 'object' && selectedOrder.shipping_address !== null && (
                      <>
                        <p className="font-medium">{(selectedOrder.shipping_address as any).name || selectedOrder.customer.name}</p>
                        <p className="break-words">{(selectedOrder.shipping_address as any).address || 'Address not provided'}</p>
                        <p>
                          {(selectedOrder.shipping_address as any).city || ''}, {(selectedOrder.shipping_address as any).state || ''} {(selectedOrder.shipping_address as any).postalCode || ''}
                        </p>
                        <p>{(selectedOrder.shipping_address as any).country || ''}</p>
                      </>
                    )}
                  </div>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Order Items</h3>
                <div className="rounded-md border overflow-hidden overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="max-w-[150px] truncate">{item.product_name}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">{formatCedis(item.price)}</TableCell>
                          <TableCell className="text-right">{formatCedis(item.price * item.quantity)}</TableCell>
                        </TableRow>
                      ))}
                      {selectedOrder.shipping_fee > 0 && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-right">Shipping</TableCell>
                          <TableCell className="text-right">{formatCedis(selectedOrder.shipping_fee)}</TableCell>
                        </TableRow>
                      )}
                      {selectedOrder.tax > 0 && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-right">Tax</TableCell>
                          <TableCell className="text-right">{formatCedis(selectedOrder.tax)}</TableCell>
                        </TableRow>
                      )}
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-medium">Total</TableCell>
                        <TableCell className="text-right font-bold">{formatCedis(selectedOrder.total)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2 mt-6">
            {selectedOrder && selectedOrder.status === "pending" && (
              <>
                <Button 
                  variant="default" 
                  className="w-full sm:w-auto"
                  onClick={() => updateOrderStatus(selectedOrder.id, "processing")}
                >
                  Mark as Processing
                </Button>
                <Button 
                  variant="default" 
                  className="w-full sm:w-auto"
                  onClick={() => updateOrderStatus(selectedOrder.id, "shipped")}
                >
                  Mark as Shipped
                </Button>
              </>
            )}
            {selectedOrder && selectedOrder.status === "processing" && (
              <Button 
                variant="default" 
                className="w-full sm:w-auto"
                onClick={() => updateOrderStatus(selectedOrder.id, "shipped")}
              >
                Mark as Shipped
              </Button>
            )}
            {selectedOrder && selectedOrder.status === "shipped" && (
              <Button 
                variant="default" 
                className="w-full sm:w-auto"
                onClick={() => updateOrderStatus(selectedOrder.id, "delivered")}
              >
                Mark as Delivered
              </Button>
            )}
            {selectedOrder && selectedOrder.status !== "cancelled" && (
              <Button 
                variant="destructive" 
                className="w-full sm:w-auto"
                onClick={() => updateOrderStatus(selectedOrder.id, "cancelled")}
              >
                Cancel Order
              </Button>
            )}
            <Button 
              variant="outline" 
              className="w-full sm:w-auto"
              onClick={() => setIsDetailsModalOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Orders;
