
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle, 
  ArrowUpRight, 
  Calendar, 
  CreditCard, 
  FileText, 
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

// For demo purposes, we'll use mock data
const recentActivities = [
  { id: 1, type: "order", description: "New order #ORD-2023-005", time: "10 minutes ago" },
  { id: 2, type: "user", description: "New user registration: Emma Watson", time: "30 minutes ago" },
  { id: 3, type: "appointment", description: "Appointment rescheduled: Sarah Johnson", time: "1 hour ago" },
  { id: 4, type: "product", description: "Low stock alert: Alma Serenity Face Cream", time: "2 hours ago" },
];

const topSellingProducts = [
  { id: 1, name: "Alma Rejuvenating Serum", sales: 124, revenue: 3720 },
  { id: 2, name: "Natural Clay Mask", sales: 98, revenue: 1960 },
  { id: 3, name: "Hydrating Body Lotion", sales: 87, revenue: 1740 },
];

export const DashboardSummary = () => {
  return (
    <div className="space-y-6">
      {/* Quick Actions Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button variant="purple" className="h-12" asChild>
          <Link to="/admin/appointments">
            <Calendar className="mr-2" />
            Manage Appointments
          </Link>
        </Button>
        <Button variant="gold" className="h-12" asChild>
          <Link to="/admin/products">
            <ShoppingBag className="mr-2" />
            Manage Products
          </Link>
        </Button>
        <Button variant="outline" className="h-12" asChild>
          <Link to="/admin/orders">
            <FileText className="mr-2" />
            View Recent Orders
          </Link>
        </Button>
      </div>

      {/* Alerts Row */}
      <div className="grid grid-cols-1 gap-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Inventory Alert</AlertTitle>
          <AlertDescription>
            5 products are low in stock and need attention. 
            <Button variant="link" className="p-0 h-auto" asChild>
              <Link to="/admin/products">View now</Link>
            </Button>
          </AlertDescription>
        </Alert>
      </div>

      {/* Activity and Top Selling Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex justify-between items-start border-b pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{activity.description}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                  <Badge variant={
                    activity.type === "order" ? "default" : 
                    activity.type === "user" ? "secondary" : 
                    activity.type === "appointment" ? "outline" : "destructive"
                  }>
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Sales</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topSellingProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-right">{product.sales}</TableCell>
                    <TableCell className="text-right">${product.revenue}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex justify-end">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/products" className="flex items-center">
                  View all products
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Sales Growth</p>
                <h3 className="text-2xl font-bold mt-1">+12.5%</h3>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">New Customers</p>
                <h3 className="text-2xl font-bold mt-1">+48</h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Avg Order Value</p>
                <h3 className="text-2xl font-bold mt-1">$127</h3>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <ShoppingBag className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Payment Success</p>
                <h3 className="text-2xl font-bold mt-1">98.3%</h3>
              </div>
              <div className="p-3 bg-amber-100 rounded-full">
                <CreditCard className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
