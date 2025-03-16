
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
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
  UserCog
} from "lucide-react";

type AdminLayoutProps = {
  children: React.ReactNode;
  title: string;
};

export const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on location change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Set sidebar to open by default
  useEffect(() => {
    setIsSidebarOpen(true);
  }, []);

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
      <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-600"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <Link to="/" className="flex items-center">
          <img
            src="/lovable-uploads/fb6df437-d752-46c4-9f14-60e6145c5695.png"
            alt="Alma Beauty"
            className="h-10"
          />
        </Link>
        <div className="w-6"></div> {/* Spacer for balance */}
      </header>

      {/* Mobile sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white md:hidden">
          <div className="flex flex-col h-full pt-20 px-6">
            <div className="space-y-6">
              {sidebarLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-3 p-3 rounded-md ${
                    isActive(link.path)
                      ? "bg-alma-gold text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <link.icon size={20} />
                  <span>{link.label}</span>
                </Link>
              ))}
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut size={20} className="mr-3" />
                Logout
              </Button>
            </div>
            
            <div className="mt-auto pb-8">
              <Link to="/" className="flex items-center space-x-2 text-alma-gold hover:underline">
                <span>Back to Website</span>
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1">
        {/* Sidebar for desktop - fixed position during scroll */}
        <aside
          className={`bg-white fixed inset-y-0 left-0 z-30 overflow-y-auto transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 shadow-md md:w-64 md:flex md:flex-col`}
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
        <main className={`flex-1 px-6 py-8 md:ml-64`}>
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
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
