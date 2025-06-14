
import { ReactNode } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, 
  Package, 
  Heart, 
  MapPin, 
  Settings, 
  Calendar,
  LogOut,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface UserLayoutProps {
  children?: ReactNode;
}

export const UserLayout = ({ children }: UserLayoutProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const sidebarItems = [
    { href: '/user', label: 'Dashboard', icon: Home },
    { href: '/user/profile', label: 'Profile', icon: User },
    { href: '/user/orders', label: 'Orders', icon: Package },
    { href: '/user/appointments', label: 'Appointments', icon: Calendar },
    { href: '/user/wishlist', label: 'Wishlist', icon: Heart },
    { href: '/user/addresses', label: 'Addresses', icon: MapPin },
    { href: '/user/settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <img 
                  src="/lovable-uploads/fb6df437-d752-46c4-9f14-60e6145c5695.png" 
                  alt="Alma Beauty Logo" 
                  className="h-10"
                />
              </Link>
              <div className="text-2xl font-serif text-alma-darkGreen">My Account</div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-alma-darkGreen hover:text-alma-gold">
                Back to Store
              </Link>
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="text-alma-darkGreen hover:text-alma-gold"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-alma-gold rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-alma-darkGreen">
                      {user?.name || 'User'}
                    </h3>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>
              </div>
              
              <nav className="space-y-2">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                        "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        isActive 
                          ? "bg-alma-gold/10 text-alma-gold" 
                          : "text-gray-600 hover:text-alma-gold hover:bg-gray-50"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {children || <Outlet />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
