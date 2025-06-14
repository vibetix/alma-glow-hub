
import React from "react";
import { UserLayout } from "@/components/UserLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin } from "lucide-react";

const UserAppointments = () => {
  const appointments = [
    {
      id: 1,
      service: "Hair Cut & Style",
      date: "2024-01-15",
      time: "2:00 PM",
      status: "confirmed",
      staff: "Sarah Johnson"
    },
    {
      id: 2,
      service: "Facial Treatment",
      date: "2024-01-20",
      time: "10:30 AM",
      status: "pending",
      staff: "Emma Wilson"
    }
  ];

  return (
    <UserLayout title="My Appointments">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">My Appointments</h2>
          <Button>
            <Calendar className="mr-2 h-4 w-4" />
            Book New Appointment
          </Button>
        </div>

        <div className="grid gap-6">
          {appointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{appointment.service}</h3>
                    <div className="flex items-center text-muted-foreground space-x-4">
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4" />
                        {appointment.date}
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        {appointment.time}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="mr-1 h-4 w-4" />
                        {appointment.staff}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}>
                      {appointment.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      Reschedule
                    </Button>
                    <Button variant="destructive" size="sm">
                      Cancel
                    </Button>
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

export default UserAppointments;
