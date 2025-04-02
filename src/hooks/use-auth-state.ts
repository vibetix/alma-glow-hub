
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
    const checkSession = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Format the user data to match our AuthUser type
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || `${session.user.user_metadata?.first_name || ''} ${session.user.user_metadata?.last_name || ''}`.trim()
          });
          
          const userProfile = await fetchProfile(session.user.id);
          setProfile(userProfile);
          
          if (userProfile) {
            // Update user object with role from profile
            setUser(prev => prev ? { ...prev, role: userProfile.role } : null);
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setUser(null);
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Format the user data to match our AuthUser type
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || `${session.user.user_metadata?.first_name || ''} ${session.user.user_metadata?.last_name || ''}`.trim()
          });
          
          const userProfile = await fetchProfile(session.user.id);
          setProfile(userProfile);
          
          if (userProfile) {
            // Update user object with role from profile
            setUser(prev => prev ? { ...prev, role: userProfile.role } : null);
          }
        } else {
          setUser(null);
          setProfile(null);
        }
      }
    );

    return () => {
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
  };
};
