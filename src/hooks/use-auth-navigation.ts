
import { useNavigate } from 'react-router-dom';
import { Profile } from '@/types/database';

export const useAuthNavigation = () => {
  const navigate = useNavigate();

  const redirectBasedOnRole = (profile: Profile | null) => {
    if (!profile) return;
    
    console.log(`Redirecting to role-specific dashboard: ${profile.role}`);
    
    switch (profile.role) {
      case 'admin':
        navigate('/admin');
        break;
      case 'staff':
        navigate('/staff');
        break;
      case 'user':
        navigate('/user/dashboard');
        break;
      default:
        navigate('/user/dashboard');
        break;
    }
  };

  const getDashboardLink = (profile: Profile | null) => {
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

  const getProfileLink = (profile: Profile | null) => {
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

  return {
    redirectBasedOnRole,
    getDashboardLink,
    getProfileLink,
  };
};
