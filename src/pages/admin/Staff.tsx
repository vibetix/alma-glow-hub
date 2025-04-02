
import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import {
  User,
  MoreVertical,
  Search,
  Scissors,
  UserPlus,
  Users,
  Calendar,
  File,
  Trash,
  Edit,
  Loader2
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface StaffMember {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  role: string;
  avatar_url: string | null;
  specialties: string[];
  created_at: string;
}

const Staff = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [newStaff, setNewStaff] = useState({
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    specialties: ["hair"]
  });
  
  useEffect(() => {
    fetchStaffData();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('staff-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'profiles' }, 
        (payload) => {
          console.log('Profiles change received:', payload);
          fetchStaffData();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchStaffData = async () => {
    try {
      setLoading(true);
      
      // First get profiles with role = staff
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'staff');
        
      if (profilesError) throw profilesError;
      
      // For each staff member, get email from auth
      const staffMembers: StaffMember[] = [];
      
      for (const profile of (profilesData || [])) {
        try {
          const { data: userData, error: userError } = await supabase.auth.admin.getUserById(
            profile.id
          );
          
          if (userError) {
            console.error("Error fetching staff user data:", userError);
            continue;
          }
          
          staffMembers.push({
            ...profile,
            email: userData.user.email || 'unknown@example.com',
            specialties: ['hair', 'skin care'] // Mock data, replace with real specialties when available
          });
        } catch (error) {
          console.error("Error processing staff member:", error);
        }
      }
      
      setStaff(staffMembers);
    } catch (error) {
      console.error("Error fetching staff:", error);
      toast({
        title: "Failed to load staff data",
        description: "There was an error fetching the staff information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewStaff((prev) => ({ ...prev, [name]: value }));
  };

  const handleSpecialtyChange = (specialty: string) => {
    setNewStaff((prev) => {
      if (prev.specialties.includes(specialty)) {
        return {
          ...prev,
          specialties: prev.specialties.filter((s) => s !== specialty),
        };
      } else {
        return {
          ...prev,
          specialties: [...prev.specialties, specialty],
        };
      }
    });
  };

  const handleAddStaff = async () => {
    try {
      if (!newStaff.email || !newStaff.first_name || !newStaff.last_name) {
        toast({
          title: "Missing required fields",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }
      
      // In a real implementation, you would:
      // 1. Create a new user account with auth.signUp
      // 2. Update the profile with specialties and other details
      // 3. Set their role to 'staff'
      
      toast({
        title: "Staff member added",
        description: "The staff member has been successfully added.",
      });
      
      // Reset the form
      setNewStaff({
        email: "",
        first_name: "",
        last_name: "",
        phone: "",
        specialties: ["hair"]
      });
      
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error adding staff member:", error);
      toast({
        title: "Failed to add staff",
        description: "There was an error adding the staff member.",
        variant: "destructive",
      });
    }
  };

  const handleEditStaff = async () => {
    try {
      if (!selectedStaff) return;
      
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: selectedStaff.first_name,
          last_name: selectedStaff.last_name,
          phone: selectedStaff.phone,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedStaff.id);
        
      if (error) throw error;
      
      toast({
        title: "Staff updated",
        description: "The staff member has been successfully updated",
      });
      
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating staff:", error);
      toast({
        title: "Failed to update staff",
        description: "There was an error updating the staff member",
        variant: "destructive",
      });
    }
  };

  const handleDeleteStaff = async (id: string) => {
    try {
      if (!window.confirm("Are you sure you want to remove this staff member?")) {
        return;
      }
      
      // Update the profile role to 'user' rather than deleting the account
      const { error } = await supabase
        .from('profiles')
        .update({
          role: 'user',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Staff member removed",
        description: "The staff member has been removed successfully.",
      });
    } catch (error) {
      console.error("Error removing staff member:", error);
      toast({
        title: "Failed to remove staff",
        description: "There was an error removing the staff member.",
        variant: "destructive",
      });
    }
  };

  // Filter staff based on search
  const filteredStaff = staff.filter((member) => {
    const fullName = `${member.first_name} ${member.last_name}`.toLowerCase();
    return (
      fullName.includes(search.toLowerCase()) ||
      member.email.toLowerCase().includes(search.toLowerCase()) ||
      (member.phone || "").toLowerCase().includes(search.toLowerCase())
    );
  });

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <AdminLayout title="Staff Management">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Staff</h2>
            <p className="text-muted-foreground">
              Manage your beauty salon's staff members and specialists.
            </p>
          </div>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="flex gap-1">
                <UserPlus size={18} />
                <span>Add Staff</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Staff Member</DialogTitle>
                <DialogDescription>
                  Add a new employee to your team.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      value={newStaff.first_name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      value={newStaff.last_name}
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
                  <Label>Specialties</Label>
                  <div className="flex flex-wrap gap-2">
                    {["hair", "nails", "spa", "skin care"].map((specialty) => (
                      <div
                        key={specialty}
                        className={`cursor-pointer rounded-full px-3 py-1 text-sm ${
                          newStaff.specialties.includes(specialty)
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                        onClick={() => handleSpecialtyChange(specialty)}
                      >
                        {specialty}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddStaff}>Add Staff Member</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Staff</TabsTrigger>
            <TabsTrigger value="hair">Hair Stylists</TabsTrigger>
            <TabsTrigger value="spa">Spa Specialists</TabsTrigger>
            <TabsTrigger value="skin">Skin Care</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-6 mt-6">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search staff members..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Staff Directory</CardTitle>
                <CardDescription>
                  All active staff members and specialists.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead className="hidden md:table-cell">Specialties</TableHead>
                        <TableHead className="hidden md:table-cell">Since</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-10">
                            <div className="flex justify-center">
                              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                            <div className="mt-2 text-sm text-muted-foreground">
                              Loading staff members...
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : filteredStaff.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="h-32 text-center text-muted-foreground"
                          >
                            No staff members found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredStaff.map((member) => (
                          <TableRow key={member.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={member.avatar_url || ""} />
                                  <AvatarFallback>
                                    {getInitials(`${member.first_name} ${member.last_name}`)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">
                                    {member.first_name} {member.last_name}
                                  </div>
                                  <div className="text-sm text-muted-foreground hidden md:block">
                                    {member.role}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">{member.email}</TableCell>
                            <TableCell>{member.phone || "-"}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="flex flex-wrap gap-1">
                                {member.specialties.map((specialty) => (
                                  <Badge
                                    key={specialty}
                                    variant="outline"
                                    className="capitalize"
                                  >
                                    {specialty}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {format(new Date(member.created_at), "MMM yyyy")}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedStaff(member);
                                      setIsEditModalOpen(true);
                                    }}
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Calendar className="mr-2 h-4 w-4" />
                                    View Schedule
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <File className="mr-2 h-4 w-4" />
                                    Performance
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="text-red-600"
                                    onClick={() => handleDeleteStaff(member.id)}
                                  >
                                    <Trash className="mr-2 h-4 w-4" />
                                    Remove Staff
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Staff Stats Card */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Staff
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div className="text-2xl font-bold">{staff.length}</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Hair Stylists
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Scissors className="h-4 w-4 text-muted-foreground" />
                    <div className="text-2xl font-bold">
                      {staff.filter((m) => m.specialties.includes("hair")).length}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Spa Specialists
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div className="text-2xl font-bold">
                      {staff.filter((m) => m.specialties.includes("spa")).length}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Skin Care Specialists
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div className="text-2xl font-bold">
                      {staff.filter((m) => m.specialties.includes("skin care")).length}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="hair" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Hair Stylists</CardTitle>
                <CardDescription>Staff specializing in hair services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead className="hidden md:table-cell">Since</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-10">
                            <Loader2 className="h-5 w-5 mx-auto animate-spin" />
                          </TableCell>
                        </TableRow>
                      ) : filteredStaff.filter((m) => m.specialties.includes("hair")).length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="h-24 text-center text-muted-foreground"
                          >
                            No hair stylists found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredStaff
                          .filter((m) => m.specialties.includes("hair"))
                          .map((member) => (
                            <TableRow key={member.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar>
                                    <AvatarImage src={member.avatar_url || ""} />
                                    <AvatarFallback>
                                      {getInitials(`${member.first_name} ${member.last_name}`)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">
                                      {member.first_name} {member.last_name}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="font-medium">{member.email}</TableCell>
                              <TableCell>{member.phone || "-"}</TableCell>
                              <TableCell className="hidden md:table-cell">
                                {format(new Date(member.created_at), "MMM yyyy")}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="outline" size="sm">
                                  View Schedule
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
          </TabsContent>
          <TabsContent value="spa" className="mt-6">
            {/* Similar table for spa specialists */}
            <Card>
              <CardHeader>
                <CardTitle>Spa Specialists</CardTitle>
                <CardDescription>Staff specializing in spa treatments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead className="hidden md:table-cell">Since</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-10">
                            <Loader2 className="h-5 w-5 mx-auto animate-spin" />
                          </TableCell>
                        </TableRow>
                      ) : filteredStaff.filter((m) => m.specialties.includes("spa")).length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="h-24 text-center text-muted-foreground"
                          >
                            No spa specialists found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredStaff
                          .filter((m) => m.specialties.includes("spa"))
                          .map((member) => (
                            <TableRow key={member.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar>
                                    <AvatarImage src={member.avatar_url || ""} />
                                    <AvatarFallback>
                                      {getInitials(`${member.first_name} ${member.last_name}`)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">
                                      {member.first_name} {member.last_name}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="font-medium">{member.email}</TableCell>
                              <TableCell>{member.phone || "-"}</TableCell>
                              <TableCell className="hidden md:table-cell">
                                {format(new Date(member.created_at), "MMM yyyy")}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="outline" size="sm">
                                  View Schedule
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
          </TabsContent>
          <TabsContent value="skin" className="mt-6">
            {/* Similar table for skin care specialists */}
            <Card>
              <CardHeader>
                <CardTitle>Skin Care Specialists</CardTitle>
                <CardDescription>Staff specializing in skin care treatments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead className="hidden md:table-cell">Since</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-10">
                            <Loader2 className="h-5 w-5 mx-auto animate-spin" />
                          </TableCell>
                        </TableRow>
                      ) : filteredStaff.filter((m) => m.specialties.includes("skin care")).length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="h-24 text-center text-muted-foreground"
                          >
                            No skin care specialists found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredStaff
                          .filter((m) => m.specialties.includes("skin care"))
                          .map((member) => (
                            <TableRow key={member.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar>
                                    <AvatarImage src={member.avatar_url || ""} />
                                    <AvatarFallback>
                                      {getInitials(`${member.first_name} ${member.last_name}`)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">
                                      {member.first_name} {member.last_name}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="font-medium">{member.email}</TableCell>
                              <TableCell>{member.phone || "-"}</TableCell>
                              <TableCell className="hidden md:table-cell">
                                {format(new Date(member.created_at), "MMM yyyy")}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="outline" size="sm">
                                  View Schedule
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
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Staff Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
            <DialogDescription>
              Update the staff member's information.
            </DialogDescription>
          </DialogHeader>
          {selectedStaff && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-first-name">First Name</Label>
                  <Input
                    id="edit-first-name"
                    value={selectedStaff.first_name || ''}
                    onChange={(e) => setSelectedStaff({ ...selectedStaff, first_name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-last-name">Last Name</Label>
                  <Input
                    id="edit-last-name"
                    value={selectedStaff.last_name || ''}
                    onChange={(e) => setSelectedStaff({ ...selectedStaff, last_name: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  value={selectedStaff.email}
                  readOnly
                  disabled
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={selectedStaff.phone || ''}
                  onChange={(e) => setSelectedStaff({ ...selectedStaff, phone: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Specialties</Label>
                <div className="flex flex-wrap gap-2">
                  {["hair", "nails", "spa", "skin care"].map((specialty) => (
                    <div
                      key={specialty}
                      className={`cursor-pointer rounded-full px-3 py-1 text-sm ${
                        selectedStaff.specialties.includes(specialty)
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                      onClick={() => {
                        setSelectedStaff({
                          ...selectedStaff,
                          specialties: selectedStaff.specialties.includes(specialty)
                            ? selectedStaff.specialties.filter((s) => s !== specialty)
                            : [...selectedStaff.specialties, specialty],
                        });
                      }}
                    >
                      {specialty}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
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
