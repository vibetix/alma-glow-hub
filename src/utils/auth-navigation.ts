
import { Profile } from '@/types/database';

export const getDashboardLink = (profile: Profile | null) => {
  if (!profile || profile.role !== 'admin') return '/';
  
  return '/admin';
};

export const getProfileLink = (profile: Profile | null) => {
  if (!profile || profile.role !== 'admin') return '/';
  
  return '/admin/settings';
};
