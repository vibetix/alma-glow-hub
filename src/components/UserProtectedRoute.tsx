
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

type UserProtectedRouteProps = {
  children: React.ReactNode;
};

export const UserProtectedRoute = ({ children }: UserProtectedRouteProps) => {
  const { user, profile, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Don't redirect while still loading
    if (isLoading) return;

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to access your account",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Show loading spinner while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-alma-gold" />
        <span className="ml-2 text-lg">Loading...</span>
      </div>
    );
  }

  // If authenticated, render children
  return isAuthenticated ? <>{children}</> : null;
};
