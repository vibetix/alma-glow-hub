
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  LayoutDashboard,
  Users,
  Calendar,
  ShoppingBag,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  CreditCard,
  Package,
  UserCog,
  Home
} from "lucide-react";

type AdminLayoutProps = {
  children: React.ReactNode;
  title: string;
};

export const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on location change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Update sidebar state when screen size changes
  useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, [isMobile]);

  const sidebarLinks = [
    { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/users", label: "Users", icon: Users },
    { path: "/admin/appointments", label: "Appointments", icon: Calendar },
    { path: "/admin/products", label: "Products", icon: ShoppingBag },
    { path: "/admin/orders", label: "Orders", icon: Package },
    { path: "/admin/payments", label: "Payments", icon: CreditCard },
    { path: "/admin/staff", label: "Staff", icon: UserCog },
    { path: "/admin/settings", label: "Settings", icon: Settings },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top navigation for mobile */}
      <header className="bg-white shadow-sm py-4 px-4 flex items-center justify-between md:hidden sticky top-0 z-40">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-600 p-2 -ml-2"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <Link to="/" className="flex items-center">
          <img
            src="/lovable-uploads/fb6df437-d752-46c4-9f14-60e6145c5695.png"
            alt="Alma Beauty"
            className="h-8"
          />
        </Link>
        <div className="w-6"></div> {/* Spacer for balance */}
      </header>

      {/* Mobile sidebar overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-full max-w-[280px] bg-white transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <img
                src="/lovable-uploads/fb6df437-d752-46c4-9f14-60e6145c5695.png"
                alt="Alma Beauty"
                className="h-8"
              />
            </Link>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-gray-600 p-2"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-2 space-y-1">
              {sidebarLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-md ${
                    isActive(link.path)
                      ? "bg-alma-gold text-white"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <link.icon size={20} />
                  <span>{link.label}</span>
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut size={18} className="mr-3" />
              Logout
            </Button>
            
            <Link 
              to="/" 
              className="mt-4 flex items-center justify-center text-alma-gold hover:underline px-4 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span>Back to Website</span>
              <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar for desktop - fixed position during scroll */}
        <aside
          className={`bg-white fixed inset-y-0 left-0 z-40 overflow-y-auto transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } hidden md:flex md:flex-col shadow-md md:w-64`}
        >
          <div className="p-6 border-b">
            <Link to="/" className="flex items-center justify-center">
              <img
                src="/lovable-uploads/fb6df437-d752-46c4-9f14-60e6145c5695.png"
                alt="Alma Beauty"
                className="h-10"
              />
            </Link>
          </div>
          
          <div className="flex flex-col flex-1 overflow-y-auto py-6 px-3">
            <nav className="flex-1 space-y-2">
              {sidebarLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-md ${
                    isActive(link.path)
                      ? "bg-alma-gold text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <link.icon size={18} />
                  <span>{link.label}</span>
                </Link>
              ))}
            </nav>
            
            <div className="pt-6 mt-auto">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut size={18} className="mr-3" />
                Logout
              </Button>
            </div>
          </div>
        </aside>

        {/* Main content - adjust margin to account for fixed sidebar */}
        <main className={`flex-1 px-4 md:px-6 py-6 md:py-8 md:ml-64 pt-6 md:pt-8 transition-all duration-300`}>
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h1>
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="hidden md:flex text-gray-600 hover:text-gray-900"
              >
                {isSidebarOpen ? (
                  <ChevronRight size={24} className="rotate-180" />
                ) : (
                  <ChevronRight size={24} />
                )}
              </button>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
