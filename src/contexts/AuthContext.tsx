
import { createContext, useContext, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthService } from '@/hooks/use-auth-service';
import { useAuthState } from '@/hooks/use-auth-state';
import { useAuthNavigation } from '@/hooks/use-auth-navigation';
import { AuthContextType } from '@/types/auth';
import { toast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
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
  
  const { redirectBasedOnRole } = useAuthNavigation();

  // Redirect based on user role with more strict logic
  useEffect(() => {
    if (profile && !isLoading) {
      const path = window.location.pathname;
      
      // Strict role-based redirection
      if (path === '/login' || path === '/') {
        redirectBasedOnRole(profile);
      }
      
      // Additional checks for unauthorized access
      if (path.startsWith('/admin') && profile.role !== 'admin') {
        toast({
          title: "Access Denied",
          description: "You do not have permission to access the admin dashboard.",
          variant: "destructive",
        });
        navigate('/');
      }
      
      if (path.startsWith('/staff') && profile.role !== 'staff') {
        toast({
          title: "Access Denied",
          description: "You do not have permission to access the staff dashboard.",
          variant: "destructive",
        });
        navigate('/');
      }
      
      if (path.startsWith('/user') && profile.role !== 'user') {
        toast({
          title: "Access Denied",
          description: "You do not have permission to access the user dashboard.",
          variant: "destructive",
        });
        navigate('/');
      }
    }
  }, [profile, isLoading, redirectBasedOnRole, navigate]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const success = await authLogin(email, password);
      
      // Additional validation for admin login
      if (success) {
        // Wait for profile to load
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const currentProfile = profile; // Capture current profile state
        
        if (email === 'admin@almabeauty.com' && currentProfile?.role !== 'admin') {
          // Logout if non-admin tries to use admin email
          await authLogout();
          toast({
            title: "Login Failed",
            description: "Invalid login credentials.",
            variant: "destructive",
          });
          return false;
        }
      }
      
      return success;
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
