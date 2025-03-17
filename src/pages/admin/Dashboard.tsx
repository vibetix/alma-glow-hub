
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardSummary } from "@/components/admin/DashboardSummary";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import {
  Users,
  Calendar,
  ShoppingBag,
  DollarSign
} from "lucide-react";

// Mock data for the dashboard
const revenueData = [
  { name: "Jan", revenue: 3200 },
  { name: "Feb", revenue: 4500 },
  { name: "Mar", revenue: 5200 },
  { name: "Apr", revenue: 4800 },
  { name: "May", revenue: 6100 },
  { name: "Jun", revenue: 7500 },
];

const appointmentsData = [
  { name: "Mon", appointments: 6 },
  { name: "Tue", appointments: 8 },
  { name: "Wed", appointments: 12 },
  { name: "Thu", appointments: 9 },
  { name: "Fri", appointments: 15 },
  { name: "Sat", appointments: 20 },
  { name: "Sun", appointments: 10 },
];

const categoryData = [
  { name: "Spa", value: 35 },
  { name: "Skincare", value: 25 },
  { name: "Hair", value: 20 },
  { name: "Products", value: 20 },
];

const COLORS = ["#D4AF37", "#8CC6BA", "#E0C2C1", "#506D64"];

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalAppointments: 0,
    totalProducts: 0,
    totalRevenue: 0,
  });

  // Simulate loading stats
  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      setStats({
        totalCustomers: 1248,
        totalAppointments: 385,
        totalProducts: 64,
        totalRevenue: 48750,
      });
    }, 1000);
  }, []);

  return (
    <AdminLayout title="Admin Dashboard">
      <div className="mb-8">
        <h2 className="text-xl font-medium text-gray-700">
          Welcome back, {user?.name}
        </h2>
        <p className="text-gray-500">
          Here's what's happening with your business today.
        </p>
      </div>

      {/* New summary component */}
      <DashboardSummary />

      <div className="my-8 border-t pt-8">
        <h3 className="text-lg font-semibold mb-4">Business Overview</h3>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Customers
                </p>
                <h3 className="text-2xl font-bold mt-1">
                  {stats.totalCustomers.toLocaleString()}
                </h3>
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
                <p className="text-sm font-medium text-gray-500">
                  Appointments
                </p>
                <h3 className="text-2xl font-bold mt-1">
                  {stats.totalAppointments.toLocaleString()}
                </h3>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Calendar className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Products
                </p>
                <h3 className="text-2xl font-bold mt-1">
                  {stats.totalProducts.toLocaleString()}
                </h3>
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
                <p className="text-sm font-medium text-gray-500">
                  Revenue
                </p>
                <h3 className="text-2xl font-bold mt-1">
                  ${stats.totalRevenue.toLocaleString()}
                </h3>
              </div>
              <div className="p-3 bg-amber-100 rounded-full">
                <DollarSign className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={revenueData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`$${value}`, 'Revenue']}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#D4AF37"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appointments" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Appointments</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={appointmentsData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="appointments"
                      fill="#8CC6BA"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="services" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Categories</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Percentage']}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default Dashboard;
