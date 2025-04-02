
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, UserPlus, Edit, Trash, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/database";
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface UserWithDetails extends Profile {
  last_sign_in_at?: string;
}

const Users = () => {
  const [users, setUsers] = useState<UserWithDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserWithDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      setUsers(data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      toast({
        title: "Failed to load users",
        description: "There was an error loading the user list",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      (user.first_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.last_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    setCurrentUser(null);
    setIsDialogOpen(true);
  };

  const handleEditUser = (user: UserWithDetails) => {
    setCurrentUser(user);
    setIsDialogOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const { error } = await supabase
          .from('profiles')
          .delete()
          .eq('id', userId);
          
        if (error) {
          throw error;
        }
        
        // Remove the user from the local state
        setUsers(users.filter(user => user.id !== userId));
        
        toast({
          title: "User deleted",
          description: "The user has been successfully deleted",
        });
      } catch (err) {
        console.error('Error deleting user:', err);
        toast({
          title: "Failed to delete user",
          description: "There was an error deleting the user",
          variant: "destructive",
        });
      }
    }
  };

  const handleDialogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    
    try {
      // Extract form values
      const firstName = (form.elements.namedItem('first_name') as HTMLInputElement).value;
      const lastName = (form.elements.namedItem('last_name') as HTMLInputElement).value;
      const phone = (form.elements.namedItem('phone') as HTMLInputElement).value;
      const role = (form.elements.namedItem('role') as HTMLSelectElement).value as 'admin' | 'staff' | 'user';
      
      if (currentUser) {
        // Update existing user
        const updateData = {
          first_name: firstName,
          last_name: lastName,
          phone,
          role,
          updated_at: new Date().toISOString()
        };
        
        const { error } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', currentUser.id);
          
        if (error) {
          throw error;
        }
        
        // Update the user in the local state
        setUsers(users.map(u => 
          u.id === currentUser.id 
            ? { ...u, first_name: firstName, last_name: lastName, phone, role } 
            : u
        ));
        
        toast({
          title: "User updated",
          description: "The user has been successfully updated",
        });
      } else {
        // For adding a new user, we would need to create both auth user and profile
        // Since we can't create auth users directly from the client, we'd need a server function
        // For this example, we'll show a message
        toast({
          title: "Feature not available",
          description: "Creating users directly is not implemented in this demo",
          variant: "destructive",
        });
      }
      
      setIsDialogOpen(false);
    } catch (err) {
      console.error('Error submitting user form:', err);
      toast({
        title: "Failed to save user",
        description: "There was an error saving the user data",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return 'Never';
    }
  };

  return (
    <AdminLayout title="User Management">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search users..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={handleAddUser}>
          <UserPlus size={18} className="mr-2" />
          Add User
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-alma-gold" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.first_name} {user.last_name}
                    </TableCell>
                    <TableCell className="capitalize">{user.role}</TableCell>
                    <TableCell>{user.phone || "Not provided"}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800`}
                      >
                        Active
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(user.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    {searchTerm 
                      ? "No users found matching your search." 
                      : "No users found. Add some users to get started."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentUser ? "Edit User" : "Add New User"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleDialogSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  placeholder="Enter first name"
                  defaultValue={currentUser?.first_name || ""}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  placeholder="Enter last name"
                  defaultValue={currentUser?.last_name || ""}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  defaultValue={currentUser?.phone || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  name="role"
                  className="w-full border border-gray-300 rounded-md h-10 px-3"
                  defaultValue={currentUser?.role || "user"}
                >
                  <option value="user">Customer</option>
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {currentUser ? "Save Changes" : "Add User"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Users;
