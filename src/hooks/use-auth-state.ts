
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthUser } from '@/types/auth';
import { Profile } from '@/types/database';
import { useAuthService } from './use-auth-service';

export const useAuthState = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { fetchProfile } = useAuthService();
  
  useEffect(() => {
    let mounted = true;
    
    const setupAuth = async () => {
      try {
        // Set up auth state listener FIRST
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log("Auth state changed:", event);
            
            if (session?.user && mounted) {
              // Format the user data to match our AuthUser type
              const authUser: AuthUser = {
                id: session.user.id,
                email: session.user.email,
                name: session.user.user_metadata?.name || 
                      `${session.user.user_metadata?.first_name || ''} ${session.user.user_metadata?.last_name || ''}`.trim()
              };
              
              setUser(authUser);
              
              // Use setTimeout to avoid potential deadlock with Supabase
              setTimeout(async () => {
                try {
                  if (!mounted) return;
                  
                  console.log("Fetching profile for user:", authUser.id);
                  const userProfile = await fetchProfile(session.user.id);
                  console.log("Profile fetched:", userProfile);
                  
                  if (mounted) {
                    setProfile(userProfile);
                    
                    if (userProfile) {
                      // Update user object with role from profile
                      setUser(prev => prev ? { ...prev, role: userProfile.role } : null);
                    }
                    
                    // Always make sure to set isLoading to false, even if profile fetch fails
                    setIsLoading(false);
                  }
                } catch (error) {
                  console.error("Error fetching profile:", error);
                  if (mounted) {
                    setIsLoading(false);
                  }
                }
              }, 0);
            } else if (mounted) {
              setUser(null);
              setProfile(null);
              setIsLoading(false);
            }
          }
        );

        // THEN check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user && mounted) {
          // Format the user data to match our AuthUser type
          const authUser: AuthUser = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || 
                  `${session.user.user_metadata?.first_name || ''} ${session.user.user_metadata?.last_name || ''}`.trim()
          };
          
          setUser(authUser);
          
          try {
            console.log("Fetching initial profile for user:", authUser.id);
            const userProfile = await fetchProfile(session.user.id);
            console.log("Initial profile fetched:", userProfile);
            
            if (mounted) {
              setProfile(userProfile);
              
              if (userProfile) {
                // Update user object with role from profile
                setUser(prev => prev ? { ...prev, role: userProfile.role } : null);
              }
              
              // Always ensure we set isLoading to false when we're done
              setIsLoading(false);
            }
          } catch (error) {
            console.error("Error fetching initial profile:", error);
            if (mounted) {
              setIsLoading(false);
            }
          }
        } else if (mounted) {
          // Make sure to set isLoading to false even if there's no session
          setIsLoading(false);
        }
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error setting up auth:', error);
        if (mounted) {
          setUser(null);
          setProfile(null);
          setIsLoading(false);
        }
        return () => {};
      }
    };

    const cleanup = setupAuth();
    
    return () => {
      mounted = false;
      cleanup.then(unsubscribe => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      });
    };
  }, [fetchProfile]);

  return {
    user,
    setUser,
    profile,
    setProfile,
    isLoading,
    setIsLoading,
  };
};
