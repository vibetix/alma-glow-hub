
import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Search, Plus, Edit, UserX, UserCog } from "lucide-react";

// Mock data for staff
const STAFF = [
  {
    id: 1,
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@example.com",
    phone: "+1234567890",
    role: "therapist",
    joinDate: new Date(2022, 3, 15),
    active: true,
    specialties: ["Swedish Massage", "Deep Tissue Massage", "Hot Stone Therapy"],
  },
  {
    id: 2,
    firstName: "David",
    lastName: "Williams",
    email: "david.williams@example.com",
    phone: "+1987654321",
    role: "hair_stylist",
    joinDate: new Date(2022, 5, 20),
    active: true,
    specialties: ["Haircuts", "Coloring", "Styling"],
  },
  {
    id: 3,
    firstName: "Maria",
    lastName: "Garcia",
    email: "maria.garcia@example.com",
    phone: "+1122334455",
    role: "therapist",
    joinDate: new Date(2022, 8, 10),
    active: true,
    specialties: ["Facial Treatments", "Body Scrubs", "Aromatherapy"],
  },
  {
    id: 4,
    firstName: "James",
    lastName: "Smith",
    email: "james.smith@example.com",
    phone: "+1567890123",
    role: "hair_stylist",
    joinDate: new Date(2022, 10, 5),
    active: false,
    specialties: ["Men's Cuts", "Beard Trimming", "Hair Styling"],
  },
  {
    id: 5,
    firstName: "Lisa",
    lastName: "Brown",
    email: "lisa.brown@example.com",
    phone: "+1654321987",
    role: "admin",
    joinDate: new Date(2021, 1, 15),
    active: true,
    specialties: ["Management", "Customer Service", "Scheduling"],
  },
];

// Get role name
const getRoleName = (role: string) => {
  switch (role) {
    case "therapist":
      return "Therapist";
    case "hair_stylist":
      return "Hair Stylist";
    case "admin":
      return "Administrator";
    default:
      return role;
  }
};

const Staff = () => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [staffList, setStaffList] = useState(STAFF);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [newStaff, setNewStaff] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "therapist",
    specialties: "",
  });
  
  // Filter staff based on search and role
  const filteredStaff = staffList.filter((staff) => {
    const fullName = `${staff.firstName} ${staff.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(search.toLowerCase()) ||
      staff.email.toLowerCase().includes(search.toLowerCase()) ||
      staff.phone.includes(search);
    
    const matchesRole =
      roleFilter === "all" || staff.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewStaff((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddStaff = () => {
    // In a real app, we would save to the database
    console.log("Adding staff:", newStaff);
    setIsAddModalOpen(false);
    // Reset form
    setNewStaff({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "therapist",
      specialties: "",
    });
  };

  const openEditModal = (staff: any) => {
    setSelectedStaff(staff);
    setIsEditModalOpen(true);
  };

  const handleEditStaff = () => {
    // In a real app, we would update the database
    console.log("Editing staff:", selectedStaff);
    setIsEditModalOpen(false);
  };

  const toggleStaffStatus = (id: number) => {
    // In a real app, we would update the database
    setStaffList(
      staffList.map((staff) =>
        staff.id === id ? { ...staff, active: !staff.active } : staff
      )
    );
  };

  return (
    <AdminLayout title="Staff Management">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Staff</CardTitle>
                <CardDescription>
                  Manage salon staff and assign roles
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search staff..."
                    className="pl-8 w-full md:w-[300px]"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Select
                  value={roleFilter}
                  onValueChange={setRoleFilter}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="therapist">Therapists</SelectItem>
                    <SelectItem value="hair_stylist">Hair Stylists</SelectItem>
                    <SelectItem value="admin">Administrators</SelectItem>
                  </SelectContent>
                </Select>
                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex gap-1">
                      <Plus size={18} />
                      <span className="hidden md:inline">Add Staff</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] max-w-[95vw]">
                    <DialogHeader>
                      <DialogTitle>Add New Staff</DialogTitle>
                      <DialogDescription>
                        Add a new staff member to your salon
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={newStaff.firstName}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={newStaff.lastName}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={newStaff.email}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={newStaff.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="role">Role</Label>
                        <Select
                          value={newStaff.role}
                          onValueChange={(value) =>
                            setNewStaff((prev) => ({
                              ...prev,
                              role: value,
                            }))
                          }
                        >
                          <SelectTrigger id="role">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="therapist">Therapist</SelectItem>
                            <SelectItem value="hair_stylist">Hair Stylist</SelectItem>
                            <SelectItem value="admin">Administrator</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="specialties">Specialties</Label>
                        <Input
                          id="specialties"
                          name="specialties"
                          placeholder="e.g. Swedish Massage, Hair Coloring (comma separated)"
                          value={newStaff.specialties}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <DialogFooter className="sm:justify-end">
                      <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddStaff}>Add Staff</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-6 text-muted-foreground"
                      >
                        No staff members found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStaff.map((staff) => (
                      <TableRow key={staff.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {staff.firstName} {staff.lastName}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <UserCog className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{getRoleName(staff.role)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{staff.email}</div>
                            <div className="text-muted-foreground">{staff.phone}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {format(staff.joinDate, "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            staff.active 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }`}>
                            {staff.active ? "Active" : "Inactive"}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditModal(staff)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant={staff.active ? "ghost" : "outline"}
                              className={staff.active ? "hover:bg-red-100 hover:text-red-600" : "hover:bg-green-100 hover:text-green-600"}
                              onClick={() => toggleStaffStatus(staff.id)}
                            >
                              <UserX className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Staff Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px] max-w-[95vw]">
          <DialogHeader>
            <DialogTitle>Edit Staff</DialogTitle>
            <DialogDescription>
              Update staff member information
            </DialogDescription>
          </DialogHeader>
          {selectedStaff && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-firstName">First Name</Label>
                  <Input
                    id="edit-firstName"
                    name="firstName"
                    defaultValue={selectedStaff.firstName}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-lastName">Last Name</Label>
                  <Input
                    id="edit-lastName"
                    name="lastName"
                    defaultValue={selectedStaff.lastName}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  defaultValue={selectedStaff.email}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  name="phone"
                  defaultValue={selectedStaff.phone}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select defaultValue={selectedStaff.role}>
                  <SelectTrigger id="edit-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="therapist">Therapist</SelectItem>
                    <SelectItem value="hair_stylist">Hair Stylist</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-specialties">Specialties</Label>
                <Input
                  id="edit-specialties"
                  name="specialties"
                  defaultValue={selectedStaff.specialties ? selectedStaff.specialties.join(", ") : ""}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select defaultValue={selectedStaff.active ? "active" : "inactive"}>
                  <SelectTrigger id="edit-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter className="sm:justify-end">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditStaff}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Staff;
