
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

type ProtectedRouteProps = {
  children: React.ReactNode;
  adminOnly?: boolean;
};

export const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const { user, profile, isAuthenticated, isLoading } = useAuth();
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

    // For admin-only routes, check role from profile
    if (adminOnly && profile?.role !== 'admin') {
      toast({
        title: "Access denied",
        description: "You don't have permission to access this page",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate, adminOnly, user, profile]);

  // Show loading spinner while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-alma-gold" />
        <span className="ml-2 text-lg">Loading...</span>
      </div>
    );
  }

  // If authenticated (and has admin rights if required), render children
  return isAuthenticated && (!adminOnly || profile?.role === 'admin') ? <>{children}</> : null;
};
