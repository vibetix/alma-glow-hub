
import { Profile } from '@/types/database';

export type AuthUser = {
  id: string;
  email?: string;
  name?: string;
  role?: 'admin' | 'staff' | 'user';
}

export type AuthContextType = {
  user: AuthUser | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>;
  logout: () => Promise<void>;
};
