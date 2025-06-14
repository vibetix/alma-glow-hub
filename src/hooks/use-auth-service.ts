
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AuthUser } from '@/types/auth';
import { Profile } from '@/types/database';

export const useAuthService = () => {
  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      console.log("AuthService: Fetching profile for user:", userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("AuthService: Profile fetch error:", error);
        throw error;
      }

      if (data) {
        console.log("AuthService: Profile fetched successfully:", data);
        // Ensure role is cast to the proper type
        return {
          ...data,
          role: data.role as 'admin' | 'staff' | 'user'
        };
      }
      
      console.log("AuthService: No profile data found");
      return null;
    } catch (error) {
      console.error('AuthService: Error fetching profile:', error);
      return null;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log("AuthService: Starting login process");
    
    try {
      console.log("AuthService: Calling Supabase signInWithPassword");
      
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });

      console.log("AuthService: Supabase response:", { data: !!data, error });

      if (error) {
        console.error("AuthService: Supabase login error:", error);
        throw error;
      }

      if (data?.user) {
        console.log("AuthService: User authenticated successfully:", data.user.id);
        
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });

        return true;
      } else {
        console.log("AuthService: No user data returned");
        return false;
      }
    } catch (error: any) {
      console.error("AuthService: Login error:", error);
      
      toast({
        title: "Login failed",
        description: error.message || "There was an error logging in",
        variant: "destructive",
      });
      return false;
    }
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
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
        throw error;
      }

      toast({
        title: "Sign up successful",
        description: "Welcome to Alma Salon & Spa!",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "There was an error creating your account",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      console.log("Logging out...");
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }
      
      // Force a page reload to clear any cached state
      console.log("Logout successful, reloading page...");
      window.location.href = '/';
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: error.message || "There was an error logging out",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    fetchProfile,
    login,
    signup,
    logout,
  };
};
