
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

type UserProtectedRouteProps = {
  children: React.ReactNode;
};

export const UserProtectedRoute = ({ children }: UserProtectedRouteProps) => {
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

    // This is specifically for user routes
    if (user?.role !== 'user') {
      toast({
        title: "Access denied",
        description: "This page is only for regular users",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate, user]);

  // Show nothing while checking auth status
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // If authenticated and is a regular user, render children
  return isAuthenticated && user?.role === 'user' ? <>{children}</> : null;
};
