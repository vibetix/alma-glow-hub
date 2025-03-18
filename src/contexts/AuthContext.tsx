
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

// Define the auth user type
type User = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'staff';
};

// Define the auth context type
type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock credentials for demo purposes
// In a real app, this would be handled by a backend
const ADMIN_EMAIL = 'admin@alma.com';
const ADMIN_PASSWORD = 'admin123';
const USER_EMAIL = 'user@alma.com';
const USER_PASSWORD = 'user123';
const STAFF_EMAIL = 'staff@alma.com';
const STAFF_PASSWORD = 'staff123';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('almaUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demo authentication logic (replace with real auth in production)
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const userData: User = {
        id: '1',
        email,
        name: 'Admin User',
        role: 'admin'
      };
      
      setUser(userData);
      localStorage.setItem('almaUser', JSON.stringify(userData));
      setIsLoading(false);
      toast({
        title: "Login successful",
        description: "Welcome to the admin dashboard!",
      });
      return true;
    } else if (email === USER_EMAIL && password === USER_PASSWORD) {
      const userData: User = {
        id: '2',
        email,
        name: 'Regular User',
        role: 'user'
      };
      
      setUser(userData);
      localStorage.setItem('almaUser', JSON.stringify(userData));
      setIsLoading(false);
      toast({
        title: "Login successful",
        description: "Welcome to your dashboard!",
      });
      return true;
    } else if (email === STAFF_EMAIL && password === STAFF_PASSWORD) {
      const userData: User = {
        id: '3',
        email,
        name: 'Emma Johnson',
        role: 'staff'
      };
      
      setUser(userData);
      localStorage.setItem('almaUser', JSON.stringify(userData));
      setIsLoading(false);
      toast({
        title: "Login successful",
        description: "Welcome to the staff dashboard!",
      });
      return true;
    }
    
    setIsLoading(false);
    toast({
      title: "Login failed",
      description: "Invalid email or password",
      variant: "destructive",
    });
    return false;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('almaUser');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate('/login');
  };

  // Provide the auth context value
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
