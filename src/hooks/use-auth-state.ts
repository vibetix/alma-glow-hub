
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
  
  useEffect(() => {
    let mounted = true;
    
    const initializeAuth = async () => {
      try {
        console.log("Initializing auth state...");
        
        // Set up auth state listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log("Auth state changed:", event, session?.user?.id);
            
            if (!mounted) return;
            
            if (session?.user) {
              const authUser: AuthUser = {
                id: session.user.id,
                email: session.user.email,
                name: session.user.user_metadata?.name || 
                      `${session.user.user_metadata?.first_name || ''} ${session.user.user_metadata?.last_name || ''}`.trim()
              };
              
              setUser(authUser);
              console.log("User set, now fetching profile...");
              
              // Fetch profile immediately after setting user
              try {
                const userProfile = await fetchProfile(session.user.id);
                if (mounted && userProfile) {
                  console.log("Profile loaded with role:", userProfile.role);
                  setProfile(userProfile);
                  setUser(prev => prev ? { ...prev, role: userProfile.role } : null);
                } else {
                  console.log("No profile found for user");
                }
              } catch (error) {
                console.error("Error fetching profile:", error);
              }
            } else {
              console.log("No session, clearing user and profile");
              setUser(null);
              setProfile(null);
              setIsLoginRedirectPending(false);
            }
            
            if (mounted) {
              setIsLoading(false);
            }
          }
        );

        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          if (mounted) {
            setIsLoading(false);
          }
          return;
        }
        
        // If we have a session but the auth state change hasn't fired yet
        if (session?.user && mounted) {
          console.log("Initial session found, setting up user...");
          const authUser: AuthUser = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || 
                  `${session.user.user_metadata?.first_name || ''} ${session.user.user_metadata?.last_name || ''}`.trim()
          };
          
          setUser(authUser);
          
          try {
            const userProfile = await fetchProfile(session.user.id);
            if (mounted && userProfile) {
              console.log("Initial profile loaded with role:", userProfile.role);
              setProfile(userProfile);
              setUser(prev => prev ? { ...prev, role: userProfile.role } : null);
            }
          } catch (error) {
            console.error("Error fetching initial profile:", error);
          }
        }
        
        if (mounted) {
          setIsLoading(false);
        }
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setUser(null);
          setProfile(null);
          setIsLoading(false);
        }
      }
    };

    initializeAuth();
    
    return () => {
      mounted = false;
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
