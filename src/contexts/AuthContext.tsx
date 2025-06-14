
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
    // Only redirect if we have complete auth data and a pending redirect
    if (!isLoading && user && profile && isLoginRedirectPending) {
      console.log(`Post-login redirect: User role is ${profile.role}, current path: ${location.pathname}`);
      
      // Clear the redirect flag immediately to prevent multiple redirections
      setIsLoginRedirectPending(false);
      
      // Determine target path based on role
      let targetPath = '';
      switch (profile.role) {
        case 'admin':
          targetPath = '/admin';
          break;
        case 'staff':
          targetPath = '/staff';
          break;
        case 'user':
        default:
          targetPath = '/user/dashboard';
          break;
      }
      
      console.log(`Redirecting ${profile.role} to ${targetPath}`);
      
      // Only redirect if we're not already on the target path
      if (location.pathname !== targetPath) {
        navigate(targetPath, { replace: true });
      }
    }
  }, [user, profile, isLoading, isLoginRedirectPending, navigate, location.pathname, setIsLoginRedirectPending]);

  // Handle role-based access control for protected routes
  useEffect(() => {
    if (!isLoading && user && profile?.role) {
      const path = location.pathname;
      
      // Skip access control during login redirect
      if (isLoginRedirectPending) return;
      
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
            navigate('/admin', { replace: true });
            break;
          case 'staff':
            navigate('/staff', { replace: true });
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
        navigate('/user/dashboard', { replace: true });
        return;
      }
      
      if (isStaffRoute && profile.role !== 'staff') {
        console.log(`User with role ${profile.role} trying to access staff route, redirecting`);
        toast({
          title: "Access Denied",
          description: "You do not have permission to access the staff dashboard.",
          variant: "destructive",
        });
        navigate('/user/dashboard', { replace: true });
        return;
      }
    }
  }, [profile, isLoading, user, location.pathname, navigate, isLoginRedirectPending]);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log(`AuthContext: Starting login process for ${email}`);
    
    try {
      console.log("AuthContext: Calling auth service login");
      const success = await authLogin(email, password);
      
      console.log("AuthContext: Auth service login result:", success);
      
      if (success) {
        console.log("AuthContext: Login successful, setting redirect flag");
        setIsLoginRedirectPending(true);
        return true;
      } else {
        console.log("AuthContext: Login failed");
        return false;
      }
    } catch (error) {
      console.error("AuthContext: Login error:", error);
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
