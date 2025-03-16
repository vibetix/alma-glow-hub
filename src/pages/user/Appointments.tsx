
import { useState } from "react";
import { UserLayout } from "@/components/UserLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, X } from "lucide-react";

// Mock appointment data
const mockAppointments = [
  {
    id: 1,
    service: "Aromatherapy Massage",
    date: "2023-07-15",
    time: "10:00 AM",
    duration: "60 min",
    location: "Main Spa",
    price: 85.00,
    status: "confirmed",
    pastAppointment: false,
  },
  {
    id: 2,
    service: "Hair Styling",
    date: "2023-07-20",
    time: "2:30 PM",
    duration: "45 min",
    location: "Hair Salon",
    price: 65.00,
    status: "pending",
    pastAppointment: false,
  },
  {
    id: 3,
    service: "Facial Treatment",
    date: "2023-06-05",
    time: "11:00 AM",
    duration: "50 min",
    location: "Skin Care Center",
    price: 95.00,
    status: "completed",
    pastAppointment: true,
  },
  {
    id: 4,
    service: "Manicure & Pedicure",
    date: "2023-06-18",
    time: "3:00 PM",
    duration: "90 min",
    location: "Nail Station",
    price: 75.00,
    status: "cancelled",
    pastAppointment: true,
  },
];

const AppointmentCard = ({ appointment }: { appointment: any }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg">{appointment.service}</h3>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <div className="flex items-center text-gray-600 text-sm">
                <Calendar className="mr-1 h-4 w-4" />
                <span>{appointment.date}</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <Clock className="mr-1 h-4 w-4" />
                <span>{appointment.time} ({appointment.duration})</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <MapPin className="mr-1 h-4 w-4" />
                <span>{appointment.location}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(appointment.status)}`}>
              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="font-medium">${appointment.price.toFixed(2)}</div>
          <div className="flex gap-2">
            {!appointment.pastAppointment && appointment.status !== "cancelled" && (
              <>
                <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                  <X className="mr-1 h-4 w-4" /> Cancel
                </Button>
                <Button size="sm" className="bg-alma-gold hover:bg-alma-gold/90">
                  Reschedule
                </Button>
              </>
            )}
            {appointment.status === "completed" && (
              <Button variant="outline" size="sm">
                Leave Review
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Appointments = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  
  const upcomingAppointments = mockAppointments.filter(a => !a.pastAppointment);
  const pastAppointments = mockAppointments.filter(a => a.pastAppointment);

  return (
    <UserLayout title="My Appointments">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-600">View and manage your appointments</p>
        </div>
        <Button className="bg-alma-gold hover:bg-alma-gold/90" asChild>
          <Link to="/booking">Book New Appointment</Link>
        </Button>
      </div>

      <Tabs defaultValue="upcoming" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="mt-0">
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">No upcoming appointments</h3>
              <p className="mt-1 text-gray-500">You don't have any appointments scheduled.</p>
              <Button className="mt-6 bg-alma-gold hover:bg-alma-gold/90" asChild>
                <Link to="/booking">Book an Appointment</Link>
              </Button>
            </div>
          ) : (
            upcomingAppointments.map(appointment => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="past" className="mt-0">
          {pastAppointments.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Clock className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">No past appointments</h3>
              <p className="mt-1 text-gray-500">You haven't had any appointments yet.</p>
            </div>
          ) : (
            pastAppointments.map(appointment => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </UserLayout>
  );
};

export default Appointments;
