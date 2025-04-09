
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { createAllTestUsers } from '@/utils/auth-seeder';
import { toast } from '@/hooks/use-toast';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const TestUsers = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [status, setStatus] = useState<{
    admin: boolean;
    staff: boolean;
    user: boolean;
  }>({
    admin: false,
    staff: false,
    user: false,
  });

  // Check if test users already exist
  const checkExistingUsers = async () => {
    try {
      const emails = ['admin@almabeauty.com', 'staff@almabeauty.com', 'user@almabeauty.com'];
      const { data, error } = await supabase
        .from('profiles')
        .select('email, role')
        .in('email', emails);

      if (error) throw error;

      const newStatus = { admin: false, staff: false, user: false };
      
      if (data) {
        data.forEach(profile => {
          if (profile.email === 'admin@almabeauty.com') newStatus.admin = true;
          if (profile.email === 'staff@almabeauty.com') newStatus.staff = true;
          if (profile.email === 'user@almabeauty.com') newStatus.user = true;
        });
      }
      
      setStatus(newStatus);
    } catch (error) {
      console.error('Error checking existing users:', error);
    }
  };
  
  // Check for existing users when component mounts
  useState(() => {
    checkExistingUsers();
  }, []);
  
  const handleCreateTestUsers = async () => {
    setIsCreating(true);
    try {
      await createAllTestUsers();
      toast({
        title: "Test users created",
        description: "Admin, staff, and regular user accounts have been created.",
      });
      // Update status after creation
      await checkExistingUsers();
    } catch (error) {
      console.error('Error creating test users:', error);
      toast({
        title: "Error creating test users",
        description: "An error occurred while creating test users. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Test User Management</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Create Test Users</CardTitle>
          <CardDescription>
            Create test accounts for admin, staff, and regular users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="mb-2 font-medium">The following accounts will be created:</p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li className="flex items-center">
                  <span className="mr-2">
                    {status.admin && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                  </span>
                  <span><strong>Admin:</strong> admin@almabeauty.com / password123</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">
                    {status.staff && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                  </span>
                  <span><strong>Staff:</strong> staff@almabeauty.com / password123</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">
                    {status.user && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                  </span>
                  <span><strong>User:</strong> user@almabeauty.com / password123</span>
                </li>
              </ul>
            </div>
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-md">
              <p className="text-amber-800 text-sm">
                <strong>Note:</strong> If users with these emails already exist, they will not be recreated. Green checkmarks indicate existing accounts.
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
              <p className="text-blue-800 text-sm">
                <strong>How to use:</strong> After creating the test accounts, you can log in with any of these credentials to access different role-specific dashboards.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleCreateTestUsers}
            disabled={isCreating}
            className="bg-alma-gold hover:bg-alma-gold/90 text-black"
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Users...
              </>
            ) : (
              "Create Test Users"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TestUsers;
