
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthUser } from '@/types/auth';
import { Profile } from '@/types/database';
import { useAuthService } from './use-auth-service';

export const useAuthState = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginRedirectPending, setIsLoginRedirectPending] = useState(false);
  const { fetchProfile } = useAuthService();
  
  const loadUserAndProfile = async (session: any) => {
    if (!session?.user) {
      console.log("No session user, clearing state");
      setUser(null);
      setProfile(null);
      return;
    }

    console.log("Loading user and profile for:", session.user.id);
    
    const authUser: AuthUser = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.user_metadata?.name || 
            `${session.user.user_metadata?.first_name || ''} ${session.user.user_metadata?.last_name || ''}`.trim()
    };
    
    setUser(authUser);
    console.log("User set, now fetching profile...");
    
    try {
      const userProfile = await fetchProfile(session.user.id);
      if (userProfile) {
        console.log("Profile loaded successfully with role:", userProfile.role);
        setProfile(userProfile);
        setUser(prev => prev ? { ...prev, role: userProfile.role } : null);
      } else {
        console.log("No profile found for user");
        setProfile(null);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setProfile(null);
    }
  };
  
  useEffect(() => {
    let mounted = true;
    
    console.log("Initializing auth state...");
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        
        if (!mounted) return;
        
        if (event === 'SIGNED_IN' && session) {
          console.log("User signed in, loading profile...");
          await loadUserAndProfile(session);
        } else if (event === 'SIGNED_OUT') {
          console.log("User signed out, clearing state");
          setUser(null);
          setProfile(null);
          setIsLoginRedirectPending(false);
        } else if (event === 'TOKEN_REFRESHED' && session) {
          console.log("Token refreshed, updating user data");
          await loadUserAndProfile(session);
        }
        
        if (mounted) {
          setIsLoading(false);
        }
      }
    );

    // Get initial session
    const initializeSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          if (mounted) {
            setIsLoading(false);
          }
          return;
        }
        
        if (session?.user && mounted) {
          console.log("Initial session found, loading user and profile...");
          await loadUserAndProfile(session);
        }
        
        if (mounted) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error initializing session:', error);
        if (mounted) {
          setUser(null);
          setProfile(null);
          setIsLoading(false);
        }
      }
    };

    initializeSession();
    
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  return {
    user,
    setUser,
    profile,
    setProfile,
    isLoading,
    setIsLoading,
    isLoginRedirectPending,
    setIsLoginRedirectPending,
  };
};
