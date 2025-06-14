
import React from "react";
import { UserLayout } from "@/components/UserLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Calendar } from "lucide-react";

const UserOrders = () => {
  const orders = [
    {
      id: "ORD-001",
      date: "2024-01-10",
      total: 89.99,
      status: "delivered",
      items: ["Hair Serum", "Face Mask"]
    },
    {
      id: "ORD-002", 
      date: "2024-01-05",
      total: 45.50,
      status: "shipped",
      items: ["Shampoo", "Conditioner"]
    }
  ];

  return (
    <UserLayout title="My Orders">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Order History</h2>
        
        <div className="grid gap-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-4">
                      <Package className="h-5 w-5 text-muted-foreground" />
                      <span className="font-semibold">{order.id}</span>
                      <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                        {order.status}
                      </Badge>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="mr-1 h-4 w-4" />
                      {order.date}
                    </div>
                    <p className="text-sm">{order.items.join(", ")}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">${order.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </UserLayout>
  );
};

export default UserOrders;
