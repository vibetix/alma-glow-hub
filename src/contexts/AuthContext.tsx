
import { createContext, useContext, ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthService } from '@/hooks/use-auth-service';
import { useAuthState } from '@/hooks/use-auth-state';
import { useAuthNavigation } from '@/hooks/use-auth-navigation';
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
    setIsLoading 
  } = useAuthState();
  
  const { 
    login: authLogin, 
    signup: authSignup, 
    logout: authLogout 
  } = useAuthService();
  
  const { redirectBasedOnRole } = useAuthNavigation();

  // Handle role-based redirection only for unauthorized access to protected routes
  useEffect(() => {
    if (!isLoading && user && profile?.role) {
      const path = location.pathname;
      
      // Only redirect from incorrect role-specific routes, not from login or home
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
        redirectBasedOnRole(profile);
        return;
      }
      
      if (isAdminRoute && profile.role !== 'admin') {
        console.log(`User with role ${profile.role} trying to access admin route, redirecting`);
        toast({
          title: "Access Denied",
          description: "You do not have permission to access the admin dashboard.",
          variant: "destructive",
        });
        redirectBasedOnRole(profile);
        return;
      }
      
      if (isStaffRoute && profile.role !== 'staff') {
        console.log(`User with role ${profile.role} trying to access staff route, redirecting`);
        toast({
          title: "Access Denied",
          description: "You do not have permission to access the staff dashboard.",
          variant: "destructive",
        });
        redirectBasedOnRole(profile);
        return;
      }
    }
  }, [profile, isLoading, user, redirectBasedOnRole, location.pathname]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log(`Attempting login for email: ${email}`);
      const success = await authLogin(email, password);
      
      if (success) {
        console.log("Login successful, waiting for profile to load...");
        
        // Wait for profile to be loaded before redirecting
        let attempts = 0;
        const maxAttempts = 10;
        
        const waitForProfile = () => {
          return new Promise<void>((resolve) => {
            const checkProfile = () => {
              attempts++;
              console.log(`Checking for profile data, attempt ${attempts}`);
              
              // Get the current auth state
              const currentUser = user;
              const currentProfile = profile;
              
              if (currentProfile && currentUser) {
                console.log(`Profile loaded for user ${currentUser.id} with role: ${currentProfile.role}`);
                console.log(`Redirecting ${currentProfile.role} to appropriate dashboard`);
                redirectBasedOnRole(currentProfile);
                resolve();
              } else if (attempts >= maxAttempts) {
                console.log("Max attempts reached, redirecting to default dashboard");
                navigate('/user/dashboard');
                resolve();
              } else {
                setTimeout(checkProfile, 200);
              }
            };
            checkProfile();
          });
        };
        
        await waitForProfile();
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
