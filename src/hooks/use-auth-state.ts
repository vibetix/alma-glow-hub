
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
              setUser({
                id: session.user.id,
                email: session.user.email,
                name: session.user.user_metadata?.name || 
                      `${session.user.user_metadata?.first_name || ''} ${session.user.user_metadata?.last_name || ''}`.trim()
              });
              
              const userProfile = await fetchProfile(session.user.id);
              
              if (mounted) {
                setProfile(userProfile);
                
                if (userProfile) {
                  // Update user object with role from profile
                  setUser(prev => prev ? { ...prev, role: userProfile.role } : null);
                }
              }
            } else if (mounted) {
              setUser(null);
              setProfile(null);
            }
          }
        );

        // THEN check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user && mounted) {
          // Format the user data to match our AuthUser type
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || 
                  `${session.user.user_metadata?.first_name || ''} ${session.user.user_metadata?.last_name || ''}`.trim()
          });
          
          const userProfile = await fetchProfile(session.user.id);
          
          if (mounted) {
            setProfile(userProfile);
            
            if (userProfile) {
              // Update user object with role from profile
              setUser(prev => prev ? { ...prev, role: userProfile.role } : null);
            }
          }
        }
        
        if (mounted) {
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
