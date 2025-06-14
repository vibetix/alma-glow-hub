
import { createContext, useContext, ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthService } from '@/hooks/use-auth-service';
import { useAuthState } from '@/hooks/use-auth-state';
import { AuthContextType } from '@/types/auth';
import { toast } from '@/hooks/use-toast';

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
    setIsLoading,
    isLoginRedirectPending,
    setIsLoginRedirectPending
  } = useAuthState();
  
  const { 
    login: authLogin, 
    signup: authSignup, 
    logout: authLogout 
  } = useAuthService();

  // Handle post-login redirection when both user and profile are loaded
  useEffect(() => {
    if (!isLoading && user && profile && isLoginRedirectPending) {
      console.log(`Post-login redirect: User role is ${profile.role}`);
      
      setIsLoginRedirectPending(false);
      
      // Role-based redirection
      switch (profile.role) {
        case 'admin':
          console.log('Redirecting admin to /admin');
          navigate('/admin');
          break;
        case 'staff':
          console.log('Redirecting staff to /staff');
          navigate('/staff');
          break;
        case 'user':
        default:
          console.log('Redirecting user to /user/dashboard');
          navigate('/user/dashboard');
          break;
      }
    }
  }, [user, profile, isLoading, isLoginRedirectPending, navigate, setIsLoginRedirectPending]);

  // Handle role-based access control for protected routes
  useEffect(() => {
    if (!isLoading && user && profile?.role) {
      const path = location.pathname;
      
      // Only redirect from incorrect role-specific routes
      const isUserRoute = path.startsWith('/user');
      const isAdminRoute = path.startsWith('/admin');
      const isStaffRoute = path.startsWith('/staff');
      
      if (isUserRoute && profile.role !== 'user') {
        console.log(`User with role ${profile.role} trying to access user route, redirecting`);
        toast({
          title: "Access Denied",
          description: "You do not have permission to access the user dashboard.",
          variant: "destructive",
        });
        
        // Redirect to appropriate dashboard
        switch (profile.role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'staff':
            navigate('/staff');
            break;
        }
        return;
      }
      
      if (isAdminRoute && profile.role !== 'admin') {
        console.log(`User with role ${profile.role} trying to access admin route, redirecting`);
        toast({
          title: "Access Denied",
          description: "You do not have permission to access the admin dashboard.",
          variant: "destructive",
        });
        navigate('/user/dashboard');
        return;
      }
      
      if (isStaffRoute && profile.role !== 'staff') {
        console.log(`User with role ${profile.role} trying to access staff route, redirecting`);
        toast({
          title: "Access Denied",
          description: "You do not have permission to access the staff dashboard.",
          variant: "destructive",
        });
        navigate('/user/dashboard');
        return;
      }
    }
  }, [profile, isLoading, user, location.pathname, navigate]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log(`Attempting login for email: ${email}`);
      const success = await authLogin(email, password);
      
      if (success) {
        console.log("Login successful, setting redirect flag");
        setIsLoginRedirectPending(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
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
      setIsLoginRedirectPending(false);
      await authLogout();
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: AuthContextType = {
    user,
    profile,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
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
