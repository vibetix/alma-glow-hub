import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { createAdminUser } from '@/utils/auth-seeder';
import { toast } from '@/hooks/use-toast';
import { Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { PageTransition } from '@/components/PageTransition';
import { Link } from 'react-router-dom';

const TestUserSetup = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateAdminUser = async () => {
    setIsCreating(true);
    setError(null);
    
    try {
      const result = await createAdminUser();
      
      if (result.success) {
        setIsCreated(true);
        toast({
          title: "Admin User Created",
          description: result.message,
        });
      } else {
        setError(result.message);
        toast({
          title: "Failed to Create Admin",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error creating admin user:', error);
      setError(error.message || "An unexpected error occurred");
      toast({
        title: "Error Creating Admin",
        description: "An unexpected error occurred. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin User Setup</CardTitle>
            <CardDescription>
              Create an admin user to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="mb-2 font-medium">The following account will be created:</p>
                <div className="bg-gray-100 p-4 rounded-md">
                  <p><strong>Email:</strong> info@almabeautyspa.com</p>
                  <p><strong>Password:</strong> password123</p>
                  <p><strong>Role:</strong> Admin</p>
                </div>
              </div>
              
              {isCreated && (
                <div className="bg-green-50 border border-green-200 p-4 rounded-md flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                  <div>
                    <p className="text-green-800 font-medium">Admin user created successfully!</p>
                    <p className="text-green-700 text-sm mt-1">
                      You can now <Link to="/login" className="text-blue-600 hover:underline">log in</Link> with the credentials above.
                    </p>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-md flex items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
                  <div>
                    <p className="text-amber-800 font-medium">There was an issue:</p>
                    <p className="text-amber-700 text-sm mt-1">{error}</p>
                    <p className="text-amber-700 text-sm mt-1">
                      You can still try to <Link to="/login" className="text-blue-600 hover:underline">log in</Link> with the credentials above as the user might already exist.
                    </p>
                  </div>
                </div>
              )}
              
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
                <p className="text-blue-800 text-sm">
                  <strong>Note:</strong> This utility creates an admin user that can access all dashboard features. For security, you should change the password after logging in.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleCreateAdminUser}
              disabled={isCreating || isCreated}
              className="bg-alma-gold hover:bg-alma-gold/90 text-black"
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Admin User...
                </>
              ) : isCreated ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Admin Created
                </>
              ) : (
                "Create Admin User"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </PageTransition>
  );
};

export default TestUserSetup;
