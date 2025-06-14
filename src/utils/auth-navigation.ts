
import { Profile } from '@/types/database';

export const getDashboardLink = (profile: Profile | null) => {
  if (!profile) return '/';
  
  if (profile.role === 'admin') return '/admin';
  if (profile.role === 'staff') return '/user'; // Staff can use user dashboard for now
  
  return '/user'; // Regular users go to user dashboard
};

export const getProfileLink = (profile: Profile | null) => {
  if (!profile) return '/';
  
  if (profile.role === 'admin') return '/admin/settings';
  
  return '/user/profile'; // All non-admin users go to user profile
};

export const redirectAfterLogin = (profile: Profile | null) => {
  if (!profile) return '/';
  
  if (profile.role === 'admin') return '/admin';
  
  return '/user'; // All other users go to user dashboard
};
