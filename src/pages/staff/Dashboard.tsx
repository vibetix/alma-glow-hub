
import React from "react";
import { StaffLayout } from "@/components/StaffLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, Star, AlertCircle } from "lucide-react";
import { StaffUpcomingAppointments } from "@/components/staff/StaffUpcomingAppointments";
import { StaffPerformanceMetrics } from "@/components/staff/StaffPerformanceMetrics";
import { StaffAlerts } from "@/components/staff/StaffAlerts";

const Dashboard = () => {
  const todaysDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <StaffLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Hello, Emma!</h1>
            <p className="text-muted-foreground">{todaysDate}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Clock className="mr-2 h-4 w-4" />
              Clock In/Out
            </Button>
            <Button className="bg-alma-gold hover:bg-alma-gold/90 text-white" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              View Schedule
            </Button>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground mt-1">2 more than yesterday</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">154</div>
              <p className="text-xs text-muted-foreground mt-1">32 regular clients</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.9</div>
              <p className="text-xs text-muted-foreground mt-1">From 87 reviews</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Alerts</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="col-span-2">
            <StaffUpcomingAppointments />
          </div>
          <div className="md:col-span-1">
            <StaffAlerts />
          </div>
        </div>
        
        <StaffPerformanceMetrics />
      </div>
    </StaffLayout>
  );
};

export default Dashboard;
