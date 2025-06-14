
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from 'react';

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

// User Pages
import UserDashboard from "./pages/user/Dashboard";
import UserProfile from "./pages/user/Profile";
import UserOrders from "./pages/user/Orders";
import UserWishlist from "./pages/user/Wishlist";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Appointments from "./pages/admin/Appointments";
import Products from "./pages/admin/Products";
import Settings from "./pages/admin/Settings";
import Orders from "./pages/admin/Orders";
import Payments from "./pages/admin/Payments";
import Staff from "./pages/admin/Staff";
import TestUsers from "./pages/admin/TestUsers";
import StaffManagement from "./pages/admin/StaffManagement";

// Auth components
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { UserProtectedRoute } from "@/components/UserProtectedRoute";
import TestUserSetup from "./pages/TestUserSetup";

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
              path="/user" 
              element={
                <UserProtectedRoute>
                  <UserDashboard />
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
            <Route 
              path="/user/orders" 
              element={
                <UserProtectedRoute>
                  <UserOrders />
                </UserProtectedRoute>
              } 
            />
            <Route 
              path="/user/wishlist" 
              element={
                <UserProtectedRoute>
                  <UserWishlist />
                </UserProtectedRoute>
              } 
            />
            <Route 
              path="/user/appointments" 
              element={
                <UserProtectedRoute>
                  <UserDashboard />
                </UserProtectedRoute>
              } 
            />
            <Route 
              path="/user/addresses" 
              element={
                <UserProtectedRoute>
                  <UserDashboard />
                </UserProtectedRoute>
              } 
            />
            <Route 
              path="/user/settings" 
              element={
                <UserProtectedRoute>
                  <UserProfile />
                </UserProtectedRoute>
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
            <Route 
              path="/admin/create-staff" 
              element={
                <ProtectedRoute adminOnly>
                  <StaffManagement />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Setup Route */}
            <Route path="/setup-admin" element={<TestUserSetup />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
