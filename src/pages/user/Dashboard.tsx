
import { useState, useEffect } from "react";
import { UserLayout } from "@/components/UserLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, Package, Clock, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const [upcomingAppointments, setUpcomingAppointments] = useState([
    {
      id: 1,
      service: "Aromatherapy Massage",
      date: "2023-07-15",
      time: "10:00 AM",
      status: "confirmed",
    },
    {
      id: 2,
      service: "Hair Styling",
      date: "2023-07-20",
      time: "2:30 PM",
      status: "pending",
    },
  ]);

  const [recentOrders, setRecentOrders] = useState([
    {
      id: "ORD-2023-001",
      date: "2023-07-01",
      total: 78.50,
      status: "delivered",
      items: 3,
    },
    {
      id: "ORD-2023-002",
      date: "2023-07-10",
      total: 125.00,
      status: "shipped",
      items: 2,
    },
  ]);

  return (
    <UserLayout title="Dashboard">
      <div className="grid gap-6">
        {/* Welcome Section */}
        <Card className="border-none shadow-sm bg-gradient-to-r from-alma-gold/20 to-white">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Welcome back, {user?.name}!</h2>
                <p className="text-gray-600 mb-4">
                  Here's what's happening with your appointments and orders.
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <Button asChild className="bg-alma-gold hover:bg-alma-gold/90">
                  <Link to="/booking">Book New Appointment</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl">Upcoming Appointments</CardTitle>
              <CardDescription>Your scheduled beauty services</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-alma-gold" asChild>
              <Link to="/user/appointments" className="flex items-center">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-6">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium">No upcoming appointments</h3>
                <p className="mt-1 text-gray-500">Book a new appointment to get started.</p>
                <Button className="mt-4 bg-alma-gold hover:bg-alma-gold/90" asChild>
                  <Link to="/booking">Book Now</Link>
                </Button>
              </div>
            ) : (
              <div className="divide-y">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="py-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{appointment.service}</h4>
                      <div className="flex items-center mt-1 text-gray-500 text-sm">
                        <Calendar className="mr-1 h-4 w-4" />
                        <span>{appointment.date} at {appointment.time}</span>
                      </div>
                    </div>
                    <div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        appointment.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appointment.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl">Recent Orders</CardTitle>
              <CardDescription>Your recent product purchases</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-alma-gold" asChild>
              <Link to="/user/orders" className="flex items-center">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <div className="text-center py-6">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium">No orders yet</h3>
                <p className="mt-1 text-gray-500">Browse our shop to find amazing products.</p>
                <Button className="mt-4 bg-alma-gold hover:bg-alma-gold/90" asChild>
                  <Link to="/shop">Shop Now</Link>
                </Button>
              </div>
            ) : (
              <div className="divide-y">
                {recentOrders.map((order) => (
                  <div key={order.id} className="py-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{order.id}</h4>
                      <div className="flex items-center mt-1 text-gray-500 text-sm">
                        <Clock className="mr-1 h-4 w-4" />
                        <span>{order.date} • {order.items} items</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'delivered' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status === 'delivered' ? 'Delivered' : 'Shipped'}
                      </span>
                      <span className="font-medium">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </UserLayout>
  );
};

export default Dashboard;
