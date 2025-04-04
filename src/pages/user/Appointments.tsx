
import React, { useEffect, useState } from "react";
import { UserLayout } from "@/components/UserLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Scissors, MapPin, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistance } from "date-fns";
import { Appointment } from "@/types/database";

const UserAppointments = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        
        // Modified query to properly specify the staff relationship
        const { data, error } = await supabase
          .from('appointments')
          .select(`
            id,
            date,
            time,
            status,
            notes,
            service:service_id (
              id,
              name,
              duration
            ),
            staff:staff_id (
              first_name,
              last_name
            )
          `)
          .eq('client_id', user.id)
          .order('date', { ascending: true });
        
        if (error) throw error;
        
        // Cast the result to match our Appointment type
        setAppointments(data as unknown as Appointment[]);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        toast({
          title: "Error Loading Appointments",
          description: "Failed to load your appointments. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user?.id) {
      fetchAppointments();
    }
  }, [user?.id]);
  
  // Helper function to get appropriate status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Cancelled</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Helper function to get relative time
  const getRelativeTime = (dateString: string) => {
    try {
      const appointmentDate = new Date(dateString);
      return formatDistance(appointmentDate, new Date(), { addSuffix: true });
    } catch (e) {
      return "Invalid date";
    }
  };
  
  // Filter appointments by status
  const upcomingAppointments = appointments.filter(
    app => app.status === 'confirmed' || app.status === 'pending'
  );
  
  const pastAppointments = appointments.filter(
    app => app.status === 'completed' || app.status === 'cancelled'
  );
  
  return (
    <UserLayout title="My Appointments">
      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
        
        <div className="flex justify-end">
          <Button className="bg-alma-gold hover:bg-alma-gold/90">
            Book New Appointment
          </Button>
        </div>
        
        <TabsContent value="upcoming" className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          ) : upcomingAppointments.length > 0 ? (
            upcomingAppointments.map(appointment => (
              <AppointmentCard 
                key={appointment.id} 
                appointment={appointment} 
                getStatusBadge={getStatusBadge}
                getRelativeTime={getRelativeTime}
              />
            ))
          ) : (
            <EmptyState message="You don't have any upcoming appointments." />
          )}
        </TabsContent>
        
        <TabsContent value="past" className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          ) : pastAppointments.length > 0 ? (
            pastAppointments.map(appointment => (
              <AppointmentCard 
                key={appointment.id} 
                appointment={appointment} 
                getStatusBadge={getStatusBadge}
                getRelativeTime={getRelativeTime}
              />
            ))
          ) : (
            <EmptyState message="You don't have any past appointments." />
          )}
        </TabsContent>
        
        <TabsContent value="all" className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          ) : appointments.length > 0 ? (
            appointments.map(appointment => (
              <AppointmentCard 
                key={appointment.id} 
                appointment={appointment} 
                getStatusBadge={getStatusBadge}
                getRelativeTime={getRelativeTime}
              />
            ))
          ) : (
            <EmptyState message="You don't have any appointments." />
          )}
        </TabsContent>
      </Tabs>
    </UserLayout>
  );
};

// Modified to accept helper functions as props
interface AppointmentCardProps {
  appointment: Appointment;
  getStatusBadge: (status: string) => React.ReactNode;
  getRelativeTime: (dateString: string) => string;
}

const AppointmentCard = ({ 
  appointment, 
  getStatusBadge, 
  getRelativeTime 
}: AppointmentCardProps) => {
  return (
    <Card key={appointment.id}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">
          {appointment.service?.name || "Service Unavailable"}
        </CardTitle>
        {getStatusBadge(appointment.status)}
      </CardHeader>
      
      <CardContent className="space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center text-gray-700">
            <Calendar className="mr-2 h-4 w-4" />
            <span>{new Date(appointment.date).toLocaleDateString()}</span>
            <span className="text-xs text-gray-500 ml-2">
              ({getRelativeTime(appointment.date)})
            </span>
          </div>
          
          <div className="flex items-center text-gray-700">
            <Clock className="mr-2 h-4 w-4" />
            <span>{appointment.time}</span>
          </div>
          
          <div className="flex items-center text-gray-700">
            <Scissors className="mr-2 h-4 w-4" />
            <span>Duration: {appointment.service?.duration || "N/A"}</span>
          </div>
          
          <div className="flex items-center text-gray-700">
            <MapPin className="mr-2 h-4 w-4" />
            <span>Alma Beauty Salon</span>
          </div>
        </div>
        
        {appointment.staff && (
          <div className="mt-4 text-gray-700">
            <span className="font-medium">Stylist: </span>
            {appointment.staff.first_name} {appointment.staff.last_name}
          </div>
        )}
        
        {appointment.notes && (
          <div className="mt-2 text-gray-700">
            <span className="font-medium">Notes: </span>
            {appointment.notes}
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t flex justify-end space-x-2">
          {appointment.status === 'pending' || appointment.status === 'confirmed' ? (
            <>
              <Button variant="outline" size="sm">Reschedule</Button>
              <Button variant="destructive" size="sm">Cancel</Button>
            </>
          ) : appointment.status === 'completed' ? (
            <Button variant="outline" size="sm">Book Again</Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};

const EmptyState = ({ message }: { message: string }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900">{message}</h3>
      <p className="mt-2 text-sm text-gray-500">
        Book an appointment to get started with our services.
      </p>
      <Button className="mt-6 bg-alma-gold hover:bg-alma-gold/90">
        Book Appointment
      </Button>
    </div>
  );
};

export default UserAppointments;
