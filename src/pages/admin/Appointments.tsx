
import React, { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { format, isSameDay } from "date-fns";
import { CalendarIcon, Plus, Search, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Appointment, Service } from "@/types/database";

interface AppointmentWithServiceAndClient extends Appointment {
  service?: Service;
  client?: {
    first_name: string | null;
    last_name: string | null;
    email: string;
    phone: string | null;
  };
}

const Appointments = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentWithServiceAndClient | null>(null);
  const [appointments, setAppointments] = useState<AppointmentWithServiceAndClient[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [staffMembers, setStaffMembers] = useState<any[]>([]);

  const [newAppointment, setNewAppointment] = useState({
    client_id: "",
    staff_id: "",
    service_id: "",
    date: new Date(),
    time: "10:00",
    notes: "",
    status: "pending",
  });

  useEffect(() => {
    fetchAppointments();
    fetchServices();
    fetchStaffMembers();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('appointment-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'appointments' }, 
        (payload) => {
          console.log('Appointment change received:', payload);
          fetchAppointments();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      
      // Get all appointments with services
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select(`
          *,
          service:service_id (*)
        `)
        .order('date', { ascending: true });
        
      if (appointmentsError) throw appointmentsError;
      
      // Get client details for each appointment
      const appointmentsWithClients: AppointmentWithServiceAndClient[] = [];
      for (const appointment of (appointmentsData || [])) {
        // Get client details
        const { data: clientData, error: clientError } = await supabase
          .from('profiles')
          .select('first_name, last_name, phone')
          .eq('id', appointment.client_id)
          .single();
          
        if (clientError && clientError.code !== 'PGRST116') {
          console.error("Error fetching client data:", clientError);
        }
        
        // Get client email from auth
        const { data: userData, error: userError } = await supabase.auth.admin.getUserById(
          appointment.client_id
        );
        
        if (userError) {
          console.error("Error fetching client auth data:", userError);
        }
        
        appointmentsWithClients.push({
          ...appointment,
          client: {
            first_name: clientData?.first_name || null,
            last_name: clientData?.last_name || null,
            email: userData?.user.email || 'Unknown',
            phone: clientData?.phone || null
          }
        });
      }
      
      setAppointments(appointmentsWithClients);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast({
        title: "Error loading appointments",
        description: "Failed to load appointments from the database.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('name');
        
      if (error) throw error;
      
      setServices(data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast({
        title: "Error loading services",
        description: "Failed to load services from the database.",
        variant: "destructive",
      });
    }
  };

  const fetchStaffMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'staff');
        
      if (error) throw error;
      
      setStaffMembers(data || []);
    } catch (error) {
      console.error("Error fetching staff:", error);
      toast({
        title: "Error loading staff",
        description: "Failed to load staff members from the database.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewAppointment((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAppointment = async () => {
    try {
      if (!newAppointment.client_id || !newAppointment.service_id || !newAppointment.date) {
        toast({
          title: "Missing required fields",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }
      
      const appointmentDate = new Date(newAppointment.date);
      const formattedDate = format(appointmentDate, "yyyy-MM-dd");
      
      const { data, error } = await supabase
        .from('appointments')
        .insert([{
          client_id: newAppointment.client_id,
          staff_id: newAppointment.staff_id || null,
          service_id: newAppointment.service_id,
          date: formattedDate,
          time: newAppointment.time,
          notes: newAppointment.notes,
          status: newAppointment.status,
        }])
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Appointment created",
        description: "The appointment has been successfully created.",
      });
      
      setIsAddModalOpen(false);
      // Reset the form
      setNewAppointment({
        client_id: "",
        staff_id: "",
        service_id: "",
        date: new Date(),
        time: "10:00",
        notes: "",
        status: "pending",
      });
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast({
        title: "Failed to create appointment",
        description: "There was an error creating the appointment.",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Status updated",
        description: `Appointment status changed to ${newStatus}.`,
      });
    } catch (error) {
      console.error("Error updating appointment status:", error);
      toast({
        title: "Failed to update status",
        description: "There was an error updating the appointment status.",
        variant: "destructive",
      });
    }
  };
  
  const openDetailsModal = (appointment: AppointmentWithServiceAndClient) => {
    setSelectedAppointment(appointment);
    setIsDetailsModalOpen(true);
  };

  // Filter appointments based on search, status, and category
  const filteredAppointments = appointments.filter((appointment) => {
    const clientName = `${appointment.client?.first_name || ''} ${appointment.client?.last_name || ''}`.trim().toLowerCase();
    const serviceName = appointment.service?.name?.toLowerCase() || '';
    
    const matchesSearch =
      clientName.includes(search.toLowerCase()) ||
      serviceName.includes(search.toLowerCase()) ||
      (appointment.client?.email || '').toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus =
      statusFilter === "all" || appointment.status === statusFilter;
    
    const matchesCategory =
      categoryFilter === "all" || appointment.service?.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

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
                        <Label htmlFor="client_id">Client ID</Label>
                        <Input
                          id="client_id"
                          name="client_id"
                          value={newAppointment.client_id}
                          onChange={handleInputChange}
                          placeholder="Enter client UUID"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="service_id">Service</Label>
                        <Select
                          value={newAppointment.service_id}
                          onValueChange={(value) =>
                            setNewAppointment((prev) => ({
                              ...prev,
                              service_id: value,
                            }))
                          }
                        >
                          <SelectTrigger id="service_id">
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                          <SelectContent>
                            {services.map((service) => (
                              <SelectItem
                                key={service.id}
                                value={service.id}
                              >
                                {service.name} (₵{service.price})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="staff_id">Staff (Optional)</Label>
                        <Select
                          value={newAppointment.staff_id}
                          onValueChange={(value) =>
                            setNewAppointment((prev) => ({
                              ...prev,
                              staff_id: value,
                            }))
                          }
                        >
                          <SelectTrigger id="staff_id">
                            <SelectValue placeholder="Select staff member" />
                          </SelectTrigger>
                          <SelectContent>
                            {staffMembers.map((staff) => (
                              <SelectItem
                                key={staff.id}
                                value={staff.id}
                              >
                                {staff.first_name} {staff.last_name}
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
                      <div className="grid gap-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Textarea
                          id="notes"
                          name="notes"
                          value={newAppointment.notes}
                          onChange={handleInputChange}
                          placeholder="Any special requests or information"
                          rows={3}
                        />
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
                      <SelectItem value="skin_care">Skin Care</SelectItem>
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
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-10">
                          <div className="flex justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                          </div>
                          <div className="mt-2 text-sm text-muted-foreground">
                            Loading appointments...
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredAppointments.length === 0 ? (
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
                              <div className="font-medium">
                                {appointment.client?.first_name} {appointment.client?.last_name || 'Unknown'}
                              </div>
                              <div className="text-sm text-muted-foreground hidden md:block">
                                {appointment.client?.email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {appointment.service?.name || 'Unknown Service'}
                            <div className="text-xs text-muted-foreground capitalize">
                              {appointment.service?.category || 'Unknown Category'}
                            </div>
                          </TableCell>
                          <TableCell>
                            {appointment.date && format(new Date(appointment.date), "MMM d, yyyy")}
                            <div className="text-xs text-muted-foreground">
                              {appointment.time}
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
                  {loading ? (
                    <div className="text-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                      <p className="text-sm text-muted-foreground mt-2">Loading...</p>
                    </div>
                  ) : date && appointments.filter(apt => 
                      apt.date && isSameDay(new Date(apt.date), date)
                    ).length > 0 ? (
                    appointments
                      .filter(apt => apt.date && isSameDay(new Date(apt.date), date))
                      .map(apt => (
                        <div
                          key={apt.id}
                          className="rounded-md border p-3 text-sm"
                        >
                          <div className="font-medium">{apt.service?.name || 'Unknown Service'}</div>
                          <div className="text-muted-foreground">
                            {apt.time} - {apt.client?.first_name} {apt.client?.last_name || 'Unknown'}
                          </div>
                        </div>
                      ))
                  ) : (
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
                  <p className="font-medium">
                    {selectedAppointment.client?.first_name} {selectedAppointment.client?.last_name || 'Unknown'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Date & Time</h3>
                  <p className="font-medium">
                    {selectedAppointment.date && format(new Date(selectedAppointment.date), "PPP")}
                  </p>
                  <p className="text-sm text-muted-foreground">{selectedAppointment.time}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Service</h3>
                  <p className="font-medium">{selectedAppointment.service?.name || 'Unknown Service'}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {selectedAppointment.service?.category || 'Unknown Category'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <p className="font-medium capitalize">{selectedAppointment.status}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Contact Information</h3>
                <p className="text-sm">Email: {selectedAppointment.client?.email || 'Unknown'}</p>
                <p className="text-sm">Phone: {selectedAppointment.client?.phone || 'Not provided'}</p>
              </div>
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium">Notes</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedAppointment.notes || 'No additional notes for this appointment.'}
                </p>
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
