
import { createContext, useContext, ReactNode } from 'react';
import { useAuthService } from '@/hooks/use-auth-service';
import { useAuthState } from '@/hooks/use-auth-state';
import { useAuthNavigation } from '@/hooks/use-auth-navigation';
import { useNavigate } from 'react-router-dom';
import { AuthContextType } from '@/types/auth';
import { useEffect } from 'react';

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const { user, profile, isLoading, setUser, setProfile, setIsLoading } = useAuthState();
  const { login: authLogin, signup: authSignup, logout: authLogout } = useAuthService();
  const { redirectBasedOnRole } = useAuthNavigation();

  // Redirect based on user role
  useEffect(() => {
    if (profile && !isLoading) {
      // Only redirect if on login page or landing page
      const path = window.location.pathname;
      if (path === '/login' || path === '/') {
        redirectBasedOnRole(profile);
      }
    }
  }, [profile, isLoading, redirectBasedOnRole]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const success = await authLogin(email, password);
      return success;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const success = await authSignup(email, password, firstName, lastName);
      return success;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    console.log("Logout initiated");
    setIsLoading(true);
    try {
      // First clear the local state
      setUser(null);
      setProfile(null);
      
      // Then call the auth service logout
      await authLogout();
      
      // We don't need to navigate here as we're redirecting in the auth service
    } catch (error) {
      console.error("Error during logout:", error);
      // If logout fails, we still want to clear local state
      setUser(null);
      setProfile(null);
      navigate('/login');
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

// Create hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
