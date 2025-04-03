
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SpaServices from "./pages/SpaServices";
import SkinCareServices from "./pages/SkinCareServices";
import HairServices from "./pages/HairServices";
import Booking from "./pages/Booking";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AboutUs from "./pages/AboutUs";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Appointments from "./pages/admin/Appointments";
import Products from "./pages/admin/Products";
import Settings from "./pages/admin/Settings";
import Orders from "./pages/admin/Orders";
import Payments from "./pages/admin/Payments";
import Staff from "./pages/admin/Staff";
import TestUsers from "./pages/admin/TestUsers"; // Added for test users

// User Pages
import UserDashboard from "./pages/user/Dashboard";
import UserAppointments from "./pages/user/Appointments";
import UserOrders from "./pages/user/Orders";
import UserProfile from "./pages/user/Profile";

// Staff Pages
import StaffDashboard from "./pages/staff/Dashboard";
import StaffSchedule from "./pages/staff/Schedule";
import StaffClients from "./pages/staff/Clients";
import StaffServices from "./pages/staff/Services";
import StaffMessages from "./pages/staff/Messages";
import StaffTimeManagement from "./pages/staff/TimeManagement";
import StaffPerformance from "./pages/staff/Performance";
import StaffSettings from "./pages/staff/Settings";

// Auth components
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { UserProtectedRoute } from "@/components/UserProtectedRoute";
import { StaffProtectedRoute } from "@/components/StaffProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/spa" element={<SpaServices />} />
            <Route path="/skincare" element={<SkinCareServices />} />
            <Route path="/hair" element={<HairServices />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/about" element={<AboutUs />} />
            
            {/* User Routes (Protected) */}
            <Route 
              path="/user/dashboard" 
              element={
                <UserProtectedRoute>
                  <UserDashboard />
                </UserProtectedRoute>
              } 
            />
            <Route 
              path="/user/appointments" 
              element={
                <UserProtectedRoute>
                  <UserAppointments />
                </UserProtectedRoute>
              } 
            />
            <Route 
              path="/user/orders" 
              element={
                <UserProtectedRoute>
                  <UserOrders />
                </UserProtectedRoute>
              } 
            />
            <Route 
              path="/user/profile" 
              element={
                <UserProtectedRoute>
                  <UserProfile />
                </UserProtectedRoute>
              } 
            />
            
            {/* Staff Routes (Protected) */}
            <Route 
              path="/staff" 
              element={
                <StaffProtectedRoute>
                  <StaffDashboard />
                </StaffProtectedRoute>
              } 
            />
            <Route 
              path="/staff/schedule" 
              element={
                <StaffProtectedRoute>
                  <StaffSchedule />
                </StaffProtectedRoute>
              } 
            />
            <Route 
              path="/staff/clients" 
              element={
                <StaffProtectedRoute>
                  <StaffClients />
                </StaffProtectedRoute>
              } 
            />
            <Route 
              path="/staff/services" 
              element={
                <StaffProtectedRoute>
                  <StaffServices />
                </StaffProtectedRoute>
              } 
            />
            <Route 
              path="/staff/messages" 
              element={
                <StaffProtectedRoute>
                  <StaffMessages />
                </StaffProtectedRoute>
              } 
            />
            <Route 
              path="/staff/time" 
              element={
                <StaffProtectedRoute>
                  <StaffTimeManagement />
                </StaffProtectedRoute>
              } 
            />
            <Route 
              path="/staff/performance" 
              element={
                <StaffProtectedRoute>
                  <StaffPerformance />
                </StaffProtectedRoute>
              } 
            />
            <Route 
              path="/staff/settings" 
              element={
                <StaffProtectedRoute>
                  <StaffSettings />
                </StaffProtectedRoute>
              } 
            />
            
            {/* Admin Routes (Protected) */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute adminOnly>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute adminOnly>
                  <Users />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/appointments" 
              element={
                <ProtectedRoute adminOnly>
                  <Appointments />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/products" 
              element={
                <ProtectedRoute adminOnly>
                  <Products />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/orders" 
              element={
                <ProtectedRoute adminOnly>
                  <Orders />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/payments" 
              element={
                <ProtectedRoute adminOnly>
                  <Payments />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/staff" 
              element={
                <ProtectedRoute adminOnly>
                  <Staff />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/settings" 
              element={
                <ProtectedRoute adminOnly>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/test-users" 
              element={
                <ProtectedRoute adminOnly>
                  <TestUsers />
                </ProtectedRoute>
              } 
            />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
