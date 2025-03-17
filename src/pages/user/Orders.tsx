
import { useState } from "react";
import { UserLayout } from "@/components/UserLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Package, Truck, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

// Mock order data
const mockOrders = [
  {
    id: "ORD-2023-001",
    date: "July 1, 2023",
    total: 78.50,
    status: "delivered",
    tracking: "USP123456789",
    items: [
      { id: 1, name: "Hydrating Face Serum", quantity: 1, price: 45.00, image: "/placeholder.svg" },
      { id: 2, name: "Almond Hair Oil", quantity: 1, price: 33.50, image: "/placeholder.svg" },
    ]
  },
  {
    id: "ORD-2023-002",
    date: "July 10, 2023",
    total: 125.00,
    status: "shipped",
    tracking: "USP987654321",
    items: [
      { id: 3, name: "Lavender Body Wash", quantity: 2, price: 28.00, image: "/placeholder.svg" },
      { id: 4, name: "Relaxing Bath Bombs Set", quantity: 1, price: 35.00, image: "/placeholder.svg" },
      { id: 5, name: "Natural Clay Mask", quantity: 1, price: 34.00, image: "/placeholder.svg" },
    ]
  },
  {
    id: "ORD-2023-003",
    date: "July 18, 2023",
    total: 95.25,
    status: "processing",
    items: [
      { id: 6, name: "Vitamin C Skin Brightener", quantity: 1, price: 52.50, image: "/placeholder.svg" },
      { id: 7, name: "Eco-friendly Hair Brush", quantity: 1, price: 42.75, image: "/placeholder.svg" },
    ]
  },
  {
    id: "ORD-2023-004",
    date: "June 25, 2023",
    total: 38.50,
    status: "cancelled",
    items: [
      { id: 8, name: "Overnight Repair Cream", quantity: 1, price: 38.50, image: "/placeholder.svg" },
    ]
  }
];

const OrderStatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case "delivered":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "shipped":
      return <Truck className="h-5 w-5 text-blue-500" />;
    case "processing":
      return <Clock className="h-5 w-5 text-yellow-500" />;
    case "cancelled":
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    default:
      return <Package className="h-5 w-5 text-gray-500" />;
  }
};

const OrderCard = ({ order, onViewDetails }: { order: any; onViewDetails: (orderId: string) => void }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Order {order.id}</CardTitle>
          <div className="flex items-center space-x-2">
            <OrderStatusIcon status={order.status} />
            <span className="text-sm font-medium capitalize">
              {order.status}
            </span>
          </div>
        </div>
        <div className="text-sm text-gray-500">Placed on {order.date}</div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className={`space-y-4 ${!isExpanded && order.items.length > 2 ? 'max-h-48 overflow-hidden' : ''}`}>
          {order.items.map((item: any) => (
            <div key={item.id} className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{item.name}</h4>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <span>Qty: {item.quantity}</span>
                  <span className="mx-2">•</span>
                  <span>${item.price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {order.items.length > 2 && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-2" 
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Show less" : "Show all items"}
          </Button>
        )}
        
        {(order.status === "shipped" || order.status === "delivered") && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center text-sm">
              <Truck className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-gray-700 font-medium">Tracking Number:</span>
              <span className="ml-2">{order.tracking}</span>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="font-medium">Total: ${order.total.toFixed(2)}</div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onViewDetails(order.id)}
          >
            Order Details
          </Button>
          {order.status === "delivered" && (
            <Button size="sm" className="bg-alma-gold hover:bg-alma-gold/90">
              Write Review
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  
  const activeOrders = mockOrders.filter(order => 
    ["processing", "shipped"].includes(order.status)
  );
  
  const completedOrders = mockOrders.filter(order => 
    order.status === "delivered"
  );
  
  const cancelledOrders = mockOrders.filter(order => 
    order.status === "cancelled"
  );

  const handleViewDetails = (orderId: string) => {
    const order = mockOrders.find(o => o.id === orderId);
    setSelectedOrder(order);
    setIsDetailsDialogOpen(true);
  };

  return (
    <UserLayout title="My Orders">
      <div className="mb-6">
        <p className="text-gray-600">Track and manage your product orders</p>
      </div>

      <Tabs defaultValue="active">
        <TabsList className="mb-6">
          <TabsTrigger value="active">Active ({activeOrders.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedOrders.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({cancelledOrders.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="mt-0">
          {activeOrders.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">No active orders</h3>
              <p className="mt-1 text-gray-500">You don't have any active orders at the moment.</p>
              <Button className="mt-6 bg-alma-gold hover:bg-alma-gold/90" asChild>
                <a href="/shop">Continue Shopping</a>
              </Button>
            </div>
          ) : (
            activeOrders.map(order => (
              <OrderCard 
                key={order.id} 
                order={order}
                onViewDetails={handleViewDetails}
              />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="mt-0">
          {completedOrders.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">No completed orders</h3>
              <p className="mt-1 text-gray-500">You don't have any completed orders yet.</p>
            </div>
          ) : (
            completedOrders.map(order => (
              <OrderCard 
                key={order.id} 
                order={order}
                onViewDetails={handleViewDetails}
              />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="cancelled" className="mt-0">
          {cancelledOrders.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">No cancelled orders</h3>
              <p className="mt-1 text-gray-500">You don't have any cancelled orders.</p>
            </div>
          ) : (
            cancelledOrders.map(order => (
              <OrderCard 
                key={order.id} 
                order={order}
                onViewDetails={handleViewDetails}
              />
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Order Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
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
                  <h3 className="text-sm font-medium text-muted-foreground">Order Date</h3>
                  <p className="font-medium">{selectedOrder.date}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <div className="flex items-center">
                    <OrderStatusIcon status={selectedOrder.status} />
                    <span className="ml-2 capitalize font-medium">{selectedOrder.status}</span>
                  </div>
                </div>
              </div>
              
              {selectedOrder.tracking && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Tracking Number</h3>
                  <div className="flex items-center mt-1">
                    <Truck className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="font-medium">{selectedOrder.tracking}</span>
                  </div>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Order Items</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.items.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-medium">Total</TableCell>
                      <TableCell className="text-right font-bold">${selectedOrder.total.toFixed(2)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Shipping Information</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p><strong>Address:</strong> 123 Main St, Apt 4B</p>
                  <p><strong>City:</strong> Los Angeles</p>
                  <p><strong>State/Province:</strong> California</p>
                  <p><strong>ZIP/Postal Code:</strong> 90210</p>
                  <p><strong>Country:</strong> United States</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>Close</Button>
            {selectedOrder && selectedOrder.status === "delivered" && (
              <Button className="bg-alma-gold hover:bg-alma-gold/90">
                Write Review
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </UserLayout>
  );
};

export default Orders;
