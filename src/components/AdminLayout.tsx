
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { AuthStatusBadge } from "@/components/AuthStatusBadge";
import { 
  Users, 
  BarChart3, 
  Settings, 
  LogOut, 
  Home, 
  UserPlus,
  Package,
  ShoppingCart,
  CreditCard 
} from "lucide-react";

type AdminLayoutProps = {
  children: React.ReactNode;
  title: string;
};

export const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarLinks = [
    {
      title: "Dashboard",
      icon: <Home className="h-5 w-5" />,
      href: "/admin",
      active: location.pathname === "/admin",
    },
    {
      title: "Users",
      icon: <Users className="h-5 w-5" />,
      href: "/admin/users",
      active: location.pathname === "/admin/users",
    },
    {
      title: "Create Staff",
      icon: <UserPlus className="h-5 w-5" />,
      href: "/admin/create-staff",
      active: location.pathname === "/admin/create-staff",
    },
    {
      title: "Products",
      icon: <Package className="h-5 w-5" />,
      href: "/admin/products",
      active: location.pathname === "/admin/products",
    },
    {
      title: "Orders",
      icon: <ShoppingCart className="h-5 w-5" />,
      href: "/admin/orders",
      active: location.pathname === "/admin/orders",
    },
    {
      title: "Payments",
      icon: <CreditCard className="h-5 w-5" />,
      href: "/admin/payments",
      active: location.pathname === "/admin/payments",
    },
    {
      title: "Performance",
      icon: <BarChart3 className="h-5 w-5" />,
      href: "/admin/staff",
      active: location.pathname === "/admin/staff",
    },
    {
      title: "Settings",
      icon: <Settings className="h-5 w-5" />,
      href: "/admin/settings",
      active: location.pathname === "/admin/settings",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="container-custom py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/">
              <img 
                src="/lovable-uploads/fb6df437-d752-46c4-9f14-60e6145c5695.png" 
                alt="Alma Beauty Logo" 
                className="h-10"
              />
            </Link>
            <Separator orientation="vertical" className="h-8 mx-4" />
            <h1 className="text-lg font-medium">{title}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">{user?.name}</span>
              <AuthStatusBadge />
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      <div className="flex-1 flex">
        <aside className="w-64 bg-white border-r flex-shrink-0 hidden md:block">
          <nav className="p-4 space-y-1">
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
                  link.active
                    ? "bg-alma-gold/10 text-alma-gold font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {link.icon}
                {link.title}
              </Link>
            ))}
          </nav>
        </aside>
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};
