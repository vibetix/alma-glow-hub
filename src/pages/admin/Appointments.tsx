
import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { CalendarIcon, Plus, Search } from "lucide-react";

// Mock data for appointments
const APPOINTMENTS = [
  {
    id: 1,
    customer: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1234567890",
    service: "Swedish Massage",
    category: "spa",
    date: new Date(2023, 6, 15, 14, 0), // July 15, 2023, 2:00 PM
    status: "confirmed",
  },
  {
    id: 2,
    customer: "John Doe",
    email: "john.doe@example.com",
    phone: "+1987654321",
    service: "Facial Treatment",
    category: "skin care",
    date: new Date(2023, 6, 16, 10, 30), // July 16, 2023, 10:30 AM
    status: "pending",
  },
  {
    id: 3,
    customer: "Emma Wilson",
    email: "emma.wilson@example.com",
    phone: "+1122334455",
    service: "Haircut and Styling",
    category: "hair",
    date: new Date(2023, 6, 17, 13, 0), // July 17, 2023, 1:00 PM
    status: "completed",
  },
  {
    id: 4,
    customer: "Michael Brown",
    email: "michael.brown@example.com",
    phone: "+1567890123",
    service: "Deep Tissue Massage",
    category: "spa",
    date: new Date(2023, 6, 18, 15, 30), // July 18, 2023, 3:30 PM
    status: "cancelled",
  },
  {
    id: 5,
    customer: "Sophia Garcia",
    email: "sophia.garcia@example.com",
    phone: "+1654321987",
    service: "Manicure and Pedicure",
    category: "spa",
    date: new Date(2023, 6, 19, 11, 0), // July 19, 2023, 11:00 AM
    status: "confirmed",
  },
];

// Mock data for services
const SERVICES = [
  { id: 1, name: "Swedish Massage", category: "spa", duration: 60, price: 85.00 },
  { id: 2, name: "Deep Tissue Massage", category: "spa", duration: 60, price: 95.00 },
  { id: 3, name: "Hot Stone Massage", category: "spa", duration: 90, price: 120.00 },
  { id: 4, name: "Facial Treatment", category: "skin care", duration: 60, price: 75.00 },
  { id: 5, name: "Haircut and Styling", category: "hair", duration: 45, price: 65.00 },
  { id: 6, name: "Manicure and Pedicure", category: "spa", duration: 75, price: 55.00 },
];

const Appointments = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [newAppointment, setNewAppointment] = useState({
    customer: "",
    email: "",
    phone: "",
    service: "",
    date: new Date(),
    time: "10:00",
  });

  // Filter appointments based on search, status, and category
  const filteredAppointments = APPOINTMENTS.filter((appointment) => {
    const matchesSearch =
      appointment.customer.toLowerCase().includes(search.toLowerCase()) ||
      appointment.email.toLowerCase().includes(search.toLowerCase()) ||
      appointment.service.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus =
      statusFilter === "all" || appointment.status === statusFilter;
    
    const matchesCategory =
      categoryFilter === "all" || appointment.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAppointment((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAppointment = () => {
    // In a real app, we would save the appointment to the database
    console.log("Adding appointment:", newAppointment);
    setIsAddModalOpen(false);
    // Reset form
    setNewAppointment({
      customer: "",
      email: "",
      phone: "",
      service: "",
      date: new Date(),
      time: "10:00",
    });
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    // In a real app, we would update the database
    console.log(`Changing appointment ${id} status to ${newStatus}`);
  };
  
  const openDetailsModal = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsDetailsModalOpen(true);
  };

  return (
    <AdminLayout title="Appointment Management">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Appointments</CardTitle>
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex gap-1">
                      <Plus size={18} />
                      <span className="hidden md:inline">New Appointment</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] max-w-[95vw] w-full max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Appointment</DialogTitle>
                      <DialogDescription>
                        Create a new appointment for a customer.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="customer">Customer Name</Label>
                        <Input
                          id="customer"
                          name="customer"
                          value={newAppointment.customer}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={newAppointment.email}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={newAppointment.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="service">Service</Label>
                        <Select
                          value={newAppointment.service}
                          onValueChange={(value) =>
                            setNewAppointment((prev) => ({
                              ...prev,
                              service: value,
                            }))
                          }
                        >
                          <SelectTrigger id="service">
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                          <SelectContent>
                            {SERVICES.map((service) => (
                              <SelectItem
                                key={service.id}
                                value={service.name}
                              >
                                {service.name} (${service.price})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Date</Label>
                        <div className="flex items-center">
                          <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                          <span>
                            {newAppointment.date
                              ? format(newAppointment.date, "PPP")
                              : "Select a date"}
                          </span>
                        </div>
                        <Calendar
                          mode="single"
                          selected={newAppointment.date}
                          onSelect={(date) =>
                            setNewAppointment((prev) => ({
                              ...prev,
                              date: date || new Date(),
                            }))
                          }
                          className="pointer-events-auto mx-auto"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="time">Time</Label>
                        <Select
                          value={newAppointment.time}
                          onValueChange={(value) =>
                            setNewAppointment((prev) => ({
                              ...prev,
                              time: value,
                            }))
                          }
                        >
                          <SelectTrigger id="time">
                            <SelectValue placeholder="Select a time" />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
                              "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
                              "15:00", "15:30", "16:00", "16:30", "17:00"
                            ].map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter className="sm:justify-end">
                      <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddAppointment}>Add Appointment</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <CardDescription>
                Manage and schedule customer appointments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search appointments..."
                    className="pl-8"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Select
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="spa">Spa</SelectItem>
                      <SelectItem value="skin care">Skin Care</SelectItem>
                      <SelectItem value="hair">Hair</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead className="hidden md:table-cell">Service</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAppointments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                          No appointments found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAppointments.map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{appointment.customer}</div>
                              <div className="text-sm text-muted-foreground hidden md:block">
                                {appointment.email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {appointment.service}
                            <div className="text-xs text-muted-foreground capitalize">
                              {appointment.category}
                            </div>
                          </TableCell>
                          <TableCell>
                            {format(appointment.date, "MMM d, yyyy")}
                            <div className="text-xs text-muted-foreground">
                              {format(appointment.date, "h:mm a")}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Select
                              defaultValue={appointment.status}
                              onValueChange={(value) =>
                                handleStatusChange(appointment.id, value)
                              }
                            >
                              <SelectTrigger className="h-8 w-[130px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => openDetailsModal(appointment)}
                            >
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
              <CardDescription>View scheduled appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="pointer-events-auto mx-auto"
              />
              <div className="mt-6 space-y-4">
                <h3 className="font-medium text-sm">
                  {date ? format(date, "MMMM d, yyyy") : "No date selected"}
                </h3>
                <div className="space-y-2">
                  {APPOINTMENTS.filter(
                    (apt) =>
                      date &&
                      apt.date.getDate() === date.getDate() &&
                      apt.date.getMonth() === date.getMonth() &&
                      apt.date.getFullYear() === date.getFullYear()
                  ).map((apt) => (
                    <div
                      key={apt.id}
                      className="rounded-md border p-3 text-sm"
                    >
                      <div className="font-medium">{apt.service}</div>
                      <div className="text-muted-foreground">
                        {format(apt.date, "h:mm a")} - {apt.customer}
                      </div>
                    </div>
                  ))}
                  {date &&
                    APPOINTMENTS.filter(
                      (apt) =>
                        apt.date.getDate() === date.getDate() &&
                        apt.date.getMonth() === date.getMonth() &&
                        apt.date.getFullYear() === date.getFullYear()
                    ).length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No appointments for this day.
                      </p>
                    )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Appointment Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-[500px] max-w-[95vw]">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Customer</h3>
                  <p className="font-medium">{selectedAppointment.customer}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Date & Time</h3>
                  <p className="font-medium">{format(selectedAppointment.date, "PPP")}</p>
                  <p className="text-sm text-muted-foreground">{format(selectedAppointment.date, "h:mm a")}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Service</h3>
                  <p className="font-medium">{selectedAppointment.service}</p>
                  <p className="text-sm text-muted-foreground capitalize">{selectedAppointment.category}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <p className="font-medium capitalize">{selectedAppointment.status}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Contact Information</h3>
                <p className="text-sm">Email: {selectedAppointment.email}</p>
                <p className="text-sm">Phone: {selectedAppointment.phone}</p>
              </div>
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium">Notes</h3>
                <p className="text-sm text-muted-foreground">No additional notes for this appointment.</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Appointments;
