
import { useNavigate } from 'react-router-dom';
import { Profile } from '@/types/database';

export const useAuthNavigation = () => {
  const navigate = useNavigate();

  const redirectBasedOnRole = (profile: Profile | null) => {
    if (!profile) {
      navigate('/');
      return;
    }
    
    console.log(`Redirecting based on role: ${profile.role}`);
    
    if (profile.role === 'admin') {
      navigate('/admin');
    } else {
      // All non-admin users go to user dashboard
      navigate('/user');
    }
  };

  const getDashboardLink = (profile: Profile | null) => {
    if (!profile) return '/login';
    
    if (profile.role === 'admin') return '/admin';
    
    // All other users go to user dashboard
    return '/user';
  };

  const getProfileLink = (profile: Profile | null) => {
    if (!profile) return '/login';
    
    if (profile.role === 'admin') return '/admin/settings';
    
    // All non-admin users go to user profile
    return '/user/profile';
  };

  return {
    redirectBasedOnRole,
    getDashboardLink,
    getProfileLink,
  };
};
