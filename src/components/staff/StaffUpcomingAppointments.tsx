
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronRight, Clock } from "lucide-react";

// Mock data for upcoming appointments
const upcomingAppointments = [
  {
    id: 1,
    client: {
      name: "Sarah Davis",
      avatar: "",
      initials: "SD"
    },
    service: "Full Highlights & Haircut",
    time: "10:00 AM - 11:30 AM",
    duration: "90 minutes",
    status: "confirmed"
  },
  {
    id: 2,
    client: {
      name: "Michael Brown",
      avatar: "",
      initials: "MB"
    },
    service: "Men's Haircut & Styling",
    time: "12:00 PM - 12:45 PM",
    duration: "45 minutes",
    status: "confirmed"
  },
  {
    id: 3,
    client: {
      name: "Jennifer Wilson",
      avatar: "",
      initials: "JW"
    },
    service: "Facial & Skin Treatment",
    time: "2:00 PM - 3:30 PM",
    duration: "90 minutes",
    status: "new-client"
  },
  {
    id: 4,
    client: {
      name: "Robert Johnson",
      avatar: "",
      initials: "RJ"
    },
    service: "Beard Trim & Shave",
    time: "4:00 PM - 4:30 PM",
    duration: "30 minutes",
    status: "confirmed"
  },
  {
    id: 5,
    client: {
      name: "Amanda Lee",
      avatar: "",
      initials: "AL"
    },
    service: "Balayage & Blowout",
    time: "5:00 PM - 7:00 PM",
    duration: "120 minutes",
    status: "confirmed"
  }
];

export const StaffUpcomingAppointments = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">Today's Appointments</CardTitle>
        <Button variant="outline" size="sm">
          <Clock className="mr-2 h-4 w-4" />
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingAppointments.map((appointment) => (
            <div key={appointment.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={appointment.client.avatar} />
                  <AvatarFallback className="bg-alma-gold/10 text-alma-gold">
                    {appointment.client.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{appointment.client.name}</p>
                  <p className="text-xs text-muted-foreground">{appointment.service}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{appointment.time}</span>
                    {appointment.status === "new-client" && (
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                        New Client
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <Button variant="ghost" size="sm" className="gap-1">
                Details <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
