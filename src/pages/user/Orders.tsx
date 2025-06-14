
import { UserLayout } from '@/components/UserLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Eye, RotateCcw, Star } from 'lucide-react';

const Orders = () => {
  // Mock order data - replace with actual data from Supabase
  const orders = [
    {
      id: 'ORD-2024-001',
      date: '2024-12-10',
      status: 'delivered',
      total: 89.99,
      items: [
        { name: 'Hydrating Face Serum', quantity: 1, price: 49.99 },
        { name: 'Organic Body Lotion', quantity: 2, price: 20.00 }
      ]
    },
    {
      id: 'ORD-2024-002',
      date: '2024-12-08',
      status: 'shipped',
      total: 156.50,
      items: [
        { name: 'Premium Face Mask Set', quantity: 1, price: 79.99 },
        { name: 'Anti-Aging Night Cream', quantity: 1, price: 76.51 }
      ]
    },
    {
      id: 'ORD-2024-003',
      date: '2024-12-05',
      status: 'processing',
      total: 234.99,
      items: [
        { name: 'Complete Skincare Bundle', quantity: 1, price: 234.99 }
      ]
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      delivered: { variant: 'default' as const, color: 'bg-green-100 text-green-800' },
      shipped: { variant: 'secondary' as const, color: 'bg-blue-100 text-blue-800' },
      processing: { variant: 'outline' as const, color: 'bg-yellow-100 text-yellow-800' },
      cancelled: { variant: 'destructive' as const, color: 'bg-red-100 text-red-800' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.processing;
    
    return (
      <Badge className={config.color}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <UserLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-serif text-alma-darkGreen mb-2">Order History</h1>
          <p className="text-gray-600">Track and manage your orders.</p>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg text-alma-darkGreen">
                      Order {order.id}
                    </CardTitle>
                    <CardDescription>
                      Placed on {new Date(order.date).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(order.status)}
                    <p className="text-lg font-semibold text-alma-darkGreen mt-1">
                      ${order.total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                        <div className="flex items-center space-x-3">
                          <Package className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-semibold">${item.price.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 pt-4">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                    
                    {order.status === 'delivered' && (
                      <>
                        <Button variant="outline" size="sm">
                          <Star className="mr-2 h-4 w-4" />
                          Write Review
                        </Button>
                        <Button variant="outline" size="sm">
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Reorder
                        </Button>
                      </>
                    )}
                    
                    {order.status === 'shipped' && (
                      <Button variant="outline" size="sm">
                        Track Package
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {orders.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
              <Button className="bg-alma-gold hover:bg-alma-gold/90">
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </UserLayout>
  );
};

export default Orders;
