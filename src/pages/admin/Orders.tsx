import { useState } from "react";
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
  DialogTrigger,
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
  Package
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for orders
const ORDERS = [
  {
    id: "ORD-001",
    customer: {
      name: "Jane Smith",
      email: "jane.smith@example.com",
    },
    date: new Date(2023, 6, 15),
    items: [
      { id: 1, name: "Organic Facial Serum", quantity: 1, price: 49.99 },
      { id: 2, name: "Hair Repair Mask", quantity: 2, price: 34.99 },
    ],
    shippingAddress: {
      name: "Jane Smith",
      address: "123 Main St, Apt 4B",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "United States",
    },
    total: 119.97,
    status: "delivered",
    payment: "completed",
    trackingNumber: "TRK293847563",
  },
  {
    id: "ORD-002",
    customer: {
      name: "John Doe",
      email: "john.doe@example.com",
    },
    date: new Date(2023, 6, 18),
    items: [
      { id: 3, name: "Deep Conditioning Treatment", quantity: 1, price: 29.99 },
    ],
    shippingAddress: {
      name: "John Doe",
      address: "456 Oak Avenue",
      city: "Los Angeles",
      state: "CA",
      postalCode: "90001",
      country: "United States",
    },
    total: 29.99,
    status: "shipped",
    payment: "completed",
    trackingNumber: "TRK576839201",
  },
  {
    id: "ORD-003",
    customer: {
      name: "Emma Wilson",
      email: "emma.wilson@example.com",
    },
    date: new Date(2023, 6, 20),
    items: [
      { id: 4, name: "Natural Face Cleanser", quantity: 1, price: 24.99 },
      { id: 5, name: "Moisturizing Body Lotion", quantity: 1, price: 19.99 },
      { id: 6, name: "Volumizing Shampoo", quantity: 1, price: 18.99 },
    ],
    shippingAddress: {
      name: "Emma Wilson",
      address: "789 Pine Street",
      city: "Chicago",
      state: "IL",
      postalCode: "60007",
      country: "United States",
    },
    total: 63.97,
    status: "pending",
    payment: "pending",
    trackingNumber: null,
  },
  {
    id: "ORD-004",
    customer: {
      name: "Michael Brown",
      email: "michael.brown@example.com",
    },
    date: new Date(2023, 6, 22),
    items: [
      { id: 7, name: "Anti-Aging Eye Cream", quantity: 2, price: 39.99 },
    ],
    shippingAddress: {
      name: "Michael Brown",
      address: "101 Cedar Road",
      city: "Boston",
      state: "MA",
      postalCode: "02108",
      country: "United States",
    },
    total: 79.98,
    status: "cancelled",
    payment: "failed",
    trackingNumber: null,
  },
  {
    id: "ORD-005",
    customer: {
      name: "Sophia Garcia",
      email: "sophia.garcia@example.com",
    },
    date: new Date(2023, 6, 25),
    items: [
      { id: 8, name: "Natural Hair Oil", quantity: 1, price: 27.99 },
      { id: 9, name: "Exfoliating Face Scrub", quantity: 1, price: 22.99 },
    ],
    shippingAddress: {
      name: "Sophia Garcia",
      address: "222 Maple Drive",
      city: "Miami",
      state: "FL",
      postalCode: "33101",
      country: "United States",
    },
    total: 50.98,
    status: "shipped",
    payment: "completed",
    trackingNumber: "TRK102938475",
  }
];

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

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const Orders = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  
  // Filter orders based on search and status
  const filteredOrders = ORDERS.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    const matchesTab = 
      activeTab === "all" || 
      (activeTab === "pending" && order.status === "pending") ||
      (activeTab === "shipped" && order.status === "shipped") ||
      (activeTab === "delivered" && order.status === "delivered") ||
      (activeTab === "cancelled" && order.status === "cancelled");
    
    return matchesSearch && matchesStatus && matchesTab;
  });

  const openDetailsModal = (order: any) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    // In a real app, this would update the database
    console.log(`Updating order ${orderId} status to ${newStatus}`);
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
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
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
                      {filteredOrders.length === 0 ? (
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
                            <TableCell>{order.id}</TableCell>
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
                              {format(order.date, "MMM d, yyyy")}
                            </TableCell>
                            <TableCell>
                              {formatCurrency(order.total)}
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
                                order.payment === "completed" 
                                  ? "bg-green-100 text-green-800" 
                                  : order.payment === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}>
                                <CreditCard className="mr-1 h-3 w-3" />
                                {order.payment}
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
          
          {/* Other tab contents use the same table but filtered */}
          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Orders</CardTitle>
                <CardDescription>Orders waiting to be processed</CardDescription>
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
                      {filteredOrders.filter(order => order.status === "pending").length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="text-center py-6 text-muted-foreground"
                          >
                            No orders found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredOrders.filter(order => order.status === "pending").map((order) => (
                          <TableRow key={order.id}>
                            <TableCell>{order.id}</TableCell>
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
                              {format(order.date, "MMM d, yyyy")}
                            </TableCell>
                            <TableCell>
                              {formatCurrency(order.total)}
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
                                order.payment === "completed" 
                                  ? "bg-green-100 text-green-800" 
                                  : order.payment === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}>
                                <CreditCard className="mr-1 h-3 w-3" />
                                {order.payment}
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
          
          <TabsContent value="shipped" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Shipped Orders</CardTitle>
                <CardDescription>Orders that have been shipped</CardDescription>
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
                      {filteredOrders.filter(order => order.status === "shipped").length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="text-center py-6 text-muted-foreground"
                          >
                            No orders found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredOrders.filter(order => order.status === "shipped").map((order) => (
                          <TableRow key={order.id}>
                            <TableCell>{order.id}</TableCell>
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
                              {format(order.date, "MMM d, yyyy")}
                            </TableCell>
                            <TableCell>
                              {formatCurrency(order.total)}
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
                                order.payment === "completed" 
                                  ? "bg-green-100 text-green-800" 
                                  : order.payment === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}>
                                <CreditCard className="mr-1 h-3 w-3" />
                                {order.payment}
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
          
          <TabsContent value="delivered" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Delivered Orders</CardTitle>
                <CardDescription>Orders that have been delivered</CardDescription>
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
                      {filteredOrders.filter(order => order.status === "delivered").length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="text-center py-6 text-muted-foreground"
                          >
                            No orders found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredOrders.filter(order => order.status === "delivered").map((order) => (
                          <TableRow key={order.id}>
                            <TableCell>{order.id}</TableCell>
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
                              {format(order.date, "MMM d, yyyy")}
                            </TableCell>
                            <TableCell>
                              {formatCurrency(order.total)}
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
                                order.payment === "completed" 
                                  ? "bg-green-100 text-green-800" 
                                  : order.payment === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}>
                                <CreditCard className="mr-1 h-3 w-3" />
                                {order.payment}
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
          
          <TabsContent value="cancelled" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cancelled Orders</CardTitle>
                <CardDescription>Orders that have been cancelled</CardDescription>
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
                      {filteredOrders.filter(order => order.status === "cancelled").length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="text-center py-6 text-muted-foreground"
                          >
                            No orders found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredOrders.filter(order => order.status === "cancelled").map((order) => (
                          <TableRow key={order.id}>
                            <TableCell>{order.id}</TableCell>
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
                              {format(order.date, "MMM d, yyyy")}
                            </TableCell>
                            <TableCell>
                              {formatCurrency(order.total)}
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
                                order.payment === "completed" 
                                  ? "bg-green-100 text-green-800" 
                                  : order.payment === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}>
                                <CreditCard className="mr-1 h-3 w-3" />
                                {order.payment}
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
        </Tabs>
      </div>

      {/* Order Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-w-[95vw]">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              {selectedOrder && `Order ID: ${selectedOrder.id}`}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Customer</h3>
                  <p className="font-medium">{selectedOrder.customer.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.customer.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
                  <p className="font-medium">{format(selectedOrder.date, "PPP")}</p>
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
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Payment</h3>
                  <p className={`font-medium capitalize ${
                    selectedOrder.payment === "completed" 
                      ? "text-green-600" 
                      : selectedOrder.payment === "pending"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}>
                    {selectedOrder.payment}
                  </p>
                </div>
              </div>
              
              {selectedOrder.trackingNumber && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Tracking Number</h3>
                  <p className="font-medium">{selectedOrder.trackingNumber}</p>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Shipping Address</h3>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="font-medium">{selectedOrder.shippingAddress.name}</p>
                  <p>{selectedOrder.shippingAddress.address}</p>
                  <p>
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}
                  </p>
                  <p>{selectedOrder.shippingAddress.country}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Order Items</h3>
                <div className="rounded-md border overflow-hidden">
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
                      {selectedOrder.items.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.price * item.quantity)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-medium">Total</TableCell>
                        <TableCell className="text-right font-bold">{formatCurrency(selectedOrder.total)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Orders;
