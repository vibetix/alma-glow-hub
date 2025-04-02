
import { Profile } from '@/types/database';

export const getDashboardLink = (profile: Profile | null) => {
  if (!profile) return '/user/dashboard';
  
  switch (profile.role) {
    case 'admin':
      return '/admin';
    case 'staff':
      return '/staff';
    case 'user':
    default:
      return '/user/dashboard';
  }
};

export const getProfileLink = (profile: Profile | null) => {
  if (!profile) return '/user/profile';
  
  switch (profile.role) {
    case 'admin':
      return '/admin/settings';
    case 'staff':
      return '/staff/settings';
    case 'user':
    default:
      return '/user/profile';
  }
};
