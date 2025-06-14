
import React, { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Search, Users, TrendingUp, Calendar, Star, User, Award } from "lucide-react";

const Staff = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("month");

  const { data: staffData, isLoading } = useQuery({
    queryKey: ['admin-staff-performance', searchQuery, timeFilter],
    queryFn: async () => {
      // Get all staff members
      const { data: staff, error: staffError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'staff');

      if (staffError) throw staffError;

      // Get appointments for staff members
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select(`
          *,
          services (
            name,
            price,
            duration
          )
        `)
        .not('staff_id', 'is', null);

      if (appointmentsError) throw appointmentsError;

      // Calculate performance metrics for each staff member
      const staffWithMetrics = staff.map(staffMember => {
        const staffAppointments = appointments.filter(apt => apt.staff_id === staffMember.id);
        const completedAppointments = staffAppointments.filter(apt => apt.status === 'completed');
        
        const totalRevenue = completedAppointments.reduce((sum, apt) => {
          return sum + (apt.services?.price || 0);
        }, 0);

        const averageRating = 4.2 + Math.random() * 0.8; // Mock rating data
        const clientsServed = new Set(staffAppointments.map(apt => apt.client_id)).size;

        return {
          ...staffMember,
          totalAppointments: staffAppointments.length,
          completedAppointments: completedAppointments.length,
          totalRevenue,
          averageRating: parseFloat(averageRating.toFixed(1)),
          clientsServed,
          completionRate: staffAppointments.length > 0 ? 
            (completedAppointments.length / staffAppointments.length) * 100 : 0
        };
      });

      return staffWithMetrics;
    }
  });

  // Sample performance data for charts
  const performanceData = [
    { name: 'Sarah Johnson', appointments: 45, revenue: 3200, rating: 4.8 },
    { name: 'Mike Chen', appointments: 38, revenue: 2850, rating: 4.6 },
    { name: 'Emma Davis', appointments: 42, revenue: 3100, rating: 4.7 },
    { name: 'James Wilson', appointments: 35, revenue: 2600, rating: 4.5 },
  ];

  if (isLoading) {
    return (
      <AdminLayout title="Staff Performance">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-alma-gold"></div>
        </div>
      </AdminLayout>
    );
  }

  const totalStaff = staffData?.length || 0;
  const totalAppointments = staffData?.reduce((sum, staff) => sum + staff.totalAppointments, 0) || 0;
  const totalRevenue = staffData?.reduce((sum, staff) => sum + staff.totalRevenue, 0) || 0;
  const averageRating = staffData?.length ? 
    staffData.reduce((sum, staff) => sum + staff.averageRating, 0) / staffData.length : 0;

  return (
    <AdminLayout title="Staff Performance">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold">Staff Performance Analytics</h2>
            <p className="text-muted-foreground">Monitor staff performance and productivity</p>
          </div>
          <Button>
            <User className="mr-2 h-4 w-4" />
            Performance Report
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStaff}</div>
              <p className="text-xs text-muted-foreground">Active team members</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAppointments}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Generated by staff</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">Customer satisfaction</p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Appointments by Staff</CardTitle>
              <CardDescription>Number of appointments completed</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="appointments" fill="#D4AF37" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue by Staff</CardTitle>
              <CardDescription>Revenue generated by each staff member</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search staff..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Staff Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Staff Performance Details</CardTitle>
            <CardDescription>Detailed performance metrics for each staff member</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Member</TableHead>
                    <TableHead>Appointments</TableHead>
                    <TableHead>Completion Rate</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Clients Served</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffData?.map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {staff.first_name} {staff.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Staff ID: {staff.id.slice(0, 8)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{staff.totalAppointments}</p>
                          <p className="text-sm text-muted-foreground">
                            {staff.completedAppointments} completed
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={staff.completionRate > 90 ? 'default' : 'secondary'}>
                          {staff.completionRate.toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">${staff.totalRevenue.toFixed(2)}</p>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{staff.clientsServed}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-medium">{staff.averageRating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default">Active</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Staff;
