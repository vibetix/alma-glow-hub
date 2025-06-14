
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface AuthUser extends User {
  name?: string;
  role?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  profile: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user:", userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      console.log("Profile fetched:", data);
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  const redirectUserBasedOnRole = (userProfile: any) => {
    if (!userProfile) {
      navigate('/');
      return;
    }

    console.log(`Redirecting user with role: ${userProfile.role}`);
    
    // Admin users go to admin dashboard
    if (userProfile.role === 'admin') {
      navigate('/admin');
    } 
    // Staff users can be added later
    else if (userProfile.role === 'staff') {
      navigate('/user');
    }
    // Regular users go to user dashboard
    else {
      navigate('/user');
    }
  };

  useEffect(() => {
    let mounted = true;
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth event:", event, session?.user?.id);
        
        if (!mounted) return;
        
        if (session?.user) {
          const authUser = {
            ...session.user,
            name: session.user.user_metadata?.first_name || 
                  `${session.user.user_metadata?.first_name || ''} ${session.user.user_metadata?.last_name || ''}`.trim() ||
                  session.user.email?.split('@')[0] || 'User'
          };
          
          setUser(authUser);
          
          // Fetch profile after setting user
          setTimeout(async () => {
            const userProfile = await fetchProfile(session.user.id);
            if (userProfile && mounted) {
              setProfile(userProfile);
              setUser(prev => prev ? { ...prev, role: userProfile.role } : null);
            }
          }, 0);
        } else {
          console.log("No session, clearing user state");
          setUser(null);
          setProfile(null);
        }
        
        if (mounted) {
          setIsLoading(false);
        }
      }
    );

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user && mounted) {
          const authUser = {
            ...session.user,
            name: session.user.user_metadata?.first_name || 
                  `${session.user.user_metadata?.first_name || ''} ${session.user.user_metadata?.last_name || ''}`.trim() ||
                  session.user.email?.split('@')[0] || 'User'
          };
          
          setUser(authUser);
          
          const userProfile = await fetchProfile(session.user.id);
          if (userProfile && mounted) {
            setProfile(userProfile);
            setUser(prev => prev ? { ...prev, role: userProfile.role } : null);
          }
        }
        
        if (mounted) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();
    
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("Login attempt for:", email);
      
      if (!email.trim() || !password.trim()) {
        toast({
          title: "Login failed",
          description: "Please enter both email and password",
          variant: "destructive",
        });
        return false;
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      
      if (error) {
        console.error("Login error:", error);
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      if (data.user) {
        console.log("Login successful");
        
        // Fetch profile to determine redirect
        const userProfile = await fetchProfile(data.user.id);
        
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        
        // Redirect based on role
        setTimeout(() => {
          redirectUserBasedOnRole(userProfile);
        }, 100);
        
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      
      setUser(null);
      setProfile(null);
      navigate('/');
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string): Promise<boolean> => {
    try {
      if (!email.trim() || !password.trim() || !firstName.trim() || !lastName.trim()) {
        toast({
          title: "Signup failed",
          description: "Please fill in all fields",
          variant: "destructive",
        });
        return false;
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      
      if (error) {
        toast({
          title: "Signup failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      if (data.user) {
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account, then you can login.",
        });
        return true;
      }

      return false;
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  const value = {
    user,
    profile,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    signup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
