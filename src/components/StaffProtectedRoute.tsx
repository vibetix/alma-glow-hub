
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

type StaffProtectedRouteProps = {
  children: React.ReactNode;
};

export const StaffProtectedRoute = ({ children }: StaffProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Don't redirect while still loading
    if (isLoading) return;

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to view this page",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    // This is specifically for staff routes
    if (user?.role !== 'staff') {
      toast({
        title: "Access denied",
        description: "This page is only for staff members",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate, user]);

  // Show loading spinner while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-alma-gold" />
        <span className="ml-2 text-lg">Loading...</span>
      </div>
    );
  }

  // If authenticated and is a staff member, render children
  return isAuthenticated && user?.role === 'staff' ? <>{children}</> : null;
};
