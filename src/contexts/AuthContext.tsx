
import { createContext, useContext, ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthService } from '@/hooks/use-auth-service';
import { useAuthState } from '@/hooks/use-auth-state';
import { useAuthNavigation } from '@/hooks/use-auth-navigation';
import { AuthContextType } from '@/types/auth';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    user, 
    profile, 
    isLoading, 
    setUser, 
    setProfile, 
    setIsLoading 
  } = useAuthState();
  
  const { 
    login: authLogin, 
    signup: authSignup, 
    logout: authLogout 
  } = useAuthService();
  
  const { redirectBasedOnRole, getDashboardLink } = useAuthNavigation();

  // Redirect based on user role with more strict logic
  useEffect(() => {
    // Only redirect if we're done loading and have profile data
    if (!isLoading && profile) {
      const path = location.pathname;
      
      // Handle redirection from login page or home page
      if (path === '/login' || path === '/') {
        console.log(`Redirecting user with role ${profile.role} to their dashboard`);
        redirectBasedOnRole(profile);
        return;
      }
      
      // Additional checks for unauthorized access
      if (path.startsWith('/admin') && profile.role !== 'admin') {
        toast({
          title: "Access Denied",
          description: "You do not have permission to access the admin dashboard.",
          variant: "destructive",
        });
        navigate(getDashboardLink(profile));
        return;
      }
      
      if (path.startsWith('/staff') && profile.role !== 'staff') {
        toast({
          title: "Access Denied",
          description: "You do not have permission to access the staff dashboard.",
          variant: "destructive",
        });
        navigate(getDashboardLink(profile));
        return;
      }
      
      if (path.startsWith('/user') && profile.role !== 'user') {
        toast({
          title: "Access Denied",
          description: "You do not have permission to access the user dashboard.",
          variant: "destructive",
        });
        navigate(getDashboardLink(profile));
        return;
      }
    }
  }, [profile, isLoading, redirectBasedOnRole, navigate, location.pathname, getDashboardLink]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const success = await authLogin(email, password);
      
      if (success) {
        // Add a small delay to ensure profile data is loaded
        await new Promise(resolve => setTimeout(resolve, 300));
        console.log("Login successful, redirecting...");
        return true;
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Prevent admin signup
      if (email === 'admin@almabeauty.com') {
        toast({
          title: "Signup Failed",
          description: "Cannot create an account with this email.",
          variant: "destructive",
        });
        return false;
      }
      
      const success = await authSignup(email, password, firstName, lastName);
      return success;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      setUser(null);
      setProfile(null);
      await authLogout();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
