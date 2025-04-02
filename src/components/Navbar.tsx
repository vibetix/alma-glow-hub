
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { getDashboardLink, getProfileLink } from '@/utils/auth-navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const location = useLocation();
  const isMobile = useIsMobile();
  const { user, profile, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update cart count whenever localStorage changes
  useEffect(() => {
    const updateCartCount = () => {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        const cartItems = JSON.parse(storedCart);
        const count = cartItems.reduce((total, item) => total + item.quantity, 0);
        setCartItemsCount(count);
      } else {
        setCartItemsCount(0);
      }
    };

    // Update immediately
    updateCartCount();

    // Listen for storage events to update cart count in real-time across tabs
    window.addEventListener('storage', updateCartCount);

    // Setup an interval to check for cart updates (needed for same-tab updates)
    const intervalId = setInterval(updateCartCount, 1000);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      clearInterval(intervalId);
    };
  }, [location.pathname]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/spa", label: "Spa" },
    { href: "/skincare", label: "Skin Care" },
    { href: "/hair", label: "Hair" },
    { href: "/shop", label: "Shop" },
    { href: "/booking", label: "Book Now" },
  ];

  const handleLogout = () => {
    logout();
  };

  const getDashboardLink = () => {
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

  const getProfileLink = () => {
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

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300",
        isScrolled 
          ? "bg-white/80 backdrop-blur-md shadow-sm py-3" 
          : "bg-transparent py-6"
      )}
    >
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="relative z-50"
        >
          <img 
            src="/lovable-uploads/fb6df437-d752-46c4-9f14-60e6145c5695.png" 
            alt="Alma Beauty Logo" 
            className="h-12 md:h-14"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "nav-link text-sm font-medium",
                location.pathname === link.href ? "text-alma-gold after:bg-alma-gold" : "text-alma-darkGreen hover:text-alma-gold"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/cart" className="relative p-2 text-alma-darkGreen hover:text-alma-gold transition-colors">
            <ShoppingCart size={20} />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-alma-gold text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </Link>
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-alma-darkGreen hover:text-alma-gold">
                  <div className="w-6 h-6 rounded-full bg-alma-gold text-white flex items-center justify-center text-xs font-bold mr-2">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="max-w-[80px] truncate">{user?.name || 'User'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={getDashboardLink(profile)}>
                    {profile?.role === 'admin' ? 'Admin Dashboard' : profile?.role === 'staff' ? 'Staff Dashboard' : 'My Dashboard'}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={getProfileLink(profile)}>Profile Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-alma-darkGreen hover:text-alma-gold">
                <User size={20} className="mr-2" /> 
                Login
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden relative z-50 p-2 text-alma-darkGreen"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-white z-40 flex flex-col p-6 pt-24 animate-fade-in md:hidden">
            <nav className="flex flex-col space-y-6">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "text-lg font-medium animate-fade-in-up",
                    location.pathname === link.href ? "text-alma-gold" : "text-alma-darkGreen",
                  )}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            
            <div className="flex items-center space-x-4 mt-8 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <Link to="/cart" className="flex items-center text-alma-darkGreen">
                <ShoppingCart size={20} className="mr-2" />
                Cart {cartItemsCount > 0 && `(${cartItemsCount})`}
              </Link>
              
              <div className="h-5 w-px bg-alma-gray mx-2"></div>
              
              {isAuthenticated ? (
                <div className="flex flex-col space-y-3">
                  <Link
                    to={getDashboardLink(profile)}
                    className="flex items-center text-alma-darkGreen"
                  >
                    <User size={20} className="mr-2" /> 
                    {profile?.role === 'admin' ? 'Admin Dashboard' : profile?.role === 'staff' ? 'Staff Dashboard' : 'My Dashboard'}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-red-500"
                  >
                    <LogOut size={20} className="mr-2" /> 
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/login" className="flex items-center text-alma-darkGreen">
                  <User size={20} className="mr-2" /> 
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
