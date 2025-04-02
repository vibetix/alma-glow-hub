
import React, { useEffect, useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { DashboardSummary } from "@/components/admin/DashboardSummary";
import { DataExport } from "@/components/admin/DataExport";
import { StaffPerformance } from "@/components/admin/StaffPerformance";
import { InventoryAlerts } from "@/components/admin/InventoryAlerts";
import { MarketingCampaigns } from "@/components/admin/MarketingCampaigns";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalAppointments: 0,
    totalProducts: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch counts in parallel
        const [
          { count: usersCount, error: usersError },
          { count: ordersCount, error: ordersError },
          { count: appointmentsCount, error: appointmentsError },
          { count: productsCount, error: productsError }
        ] = await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('orders').select('id', { count: 'exact', head: true }),
          supabase.from('appointments').select('id', { count: 'exact', head: true }),
          supabase.from('products').select('id', { count: 'exact', head: true })
        ]);
        
        // Check for any errors
        if (usersError || ordersError || appointmentsError || productsError) {
          throw new Error('Failed to fetch dashboard data');
        }
        
        setDashboardData({
          totalUsers: usersCount || 0,
          totalOrders: ordersCount || 0,
          totalAppointments: appointmentsCount || 0,
          totalProducts: productsCount || 0,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (profile?.role === 'admin') {
      fetchDashboardData();
    }
  }, [profile]);

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {loading ? (
          <div className="grid gap-6">
            <Skeleton className="h-32 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-80" />
              <Skeleton className="h-80" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-80" />
              <Skeleton className="h-80" />
            </div>
          </div>
        ) : (
          <>
            <DashboardSummary 
              userCount={dashboardData.totalUsers} 
              orderCount={dashboardData.totalOrders}
              appointmentCount={dashboardData.totalAppointments}
              productCount={dashboardData.totalProducts}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StaffPerformance />
              <DataExport />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InventoryAlerts />
              <MarketingCampaigns />
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
