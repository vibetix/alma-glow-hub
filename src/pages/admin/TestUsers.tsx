
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { createAllTestUsers } from '@/utils/auth-seeder';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const TestUsers = () => {
  const [isCreating, setIsCreating] = useState(false);
  
  const handleCreateTestUsers = async () => {
    setIsCreating(true);
    try {
      await createAllTestUsers();
      toast({
        title: "Test users created",
        description: "Admin, staff, and regular user accounts have been created.",
      });
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
              <p className="mb-2 font-medium">This will create the following accounts:</p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li><strong>Admin:</strong> admin@almabeauty.com / password123</li>
                <li><strong>Staff:</strong> staff@almabeauty.com / password123</li>
                <li><strong>User:</strong> user@almabeauty.com / password123</li>
              </ul>
            </div>
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-md">
              <p className="text-amber-800 text-sm">
                <strong>Note:</strong> If users with these emails already exist, they will not be recreated.
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
