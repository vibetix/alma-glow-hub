
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
      // All non-admin users go to home page
      navigate('/');
    }
  };

  const getDashboardLink = (profile: Profile | null) => {
    if (!profile || profile.role !== 'admin') return '/';
    
    return '/admin';
  };

  const getProfileLink = (profile: Profile | null) => {
    if (!profile || profile.role !== 'admin') return '/';
    
    return '/admin/settings';
  };

  return {
    redirectBasedOnRole,
    getDashboardLink,
    getProfileLink,
  };
};
