
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
  loading: boolean;
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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const authUser = {
          ...session.user,
          name: session.user.user_metadata?.first_name || session.user.email?.split('@')[0] || 'User'
        };
        setUser(authUser);
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const authUser = {
            ...session.user,
            name: session.user.user_metadata?.first_name || session.user.email?.split('@')[0] || 'User'
          };
          setUser(authUser);
          await fetchProfile(session.user.id);
          
          if (event === 'SIGNED_IN') {
            // Redirect based on role
            if (profile?.role === 'admin') {
              navigate('/admin');
            } else if (profile?.role === 'staff') {
              navigate('/staff');
            } else {
              navigate('/user/dashboard');
            }
          }
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate, profile?.role]);

  const fetchProfile = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (data) {
        setProfile(data);
        setUser(prev => prev ? { ...prev, role: data.role } : null);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      if (data.user) {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        return true;
      }
      
      return false;
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
    navigate('/');
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
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

      return true;
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
    isLoading: loading,
    loading,
    login,
    logout,
    signup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
