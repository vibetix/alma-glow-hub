
import { Profile } from '@/types/database';

export const getDashboardLink = (profile: Profile | null) => {
  if (!profile) return '/login';
  
  if (profile.role === 'admin') return '/admin';
  
  // All other users (including staff) go to user dashboard
  return '/user';
};

export const getProfileLink = (profile: Profile | null) => {
  if (!profile) return '/login';
  
  if (profile.role === 'admin') return '/admin/settings';
  
  // All non-admin users go to user profile
  return '/user/profile';
};

export const redirectAfterLogin = (profile: Profile | null) => {
  if (!profile) return '/';
  
  if (profile.role === 'admin') return '/admin';
  
  // All other users go to user dashboard
  return '/user';
};
