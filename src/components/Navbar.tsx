
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
            <span className="absolute -top-1 -right-1 bg-alma-gold text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              0
            </span>
          </Link>
          
          <Link to="/login">
            <Button variant="ghost" size="sm" className="text-alma-darkGreen hover:text-alma-gold">
              <User size={20} className="mr-2" /> 
              Login
            </Button>
          </Link>
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
                Cart (0)
              </Link>
              
              <div className="h-5 w-px bg-alma-gray mx-2"></div>
              
              <Link to="/login" className="flex items-center text-alma-darkGreen">
                <User size={20} className="mr-2" /> 
                Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
