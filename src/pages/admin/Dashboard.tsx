
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
import { toast } from "@/hooks/use-toast";

export interface DashboardSummaryProps {
  userCount: number;
  orderCount: number;
  appointmentCount: number;
  productCount: number;
}

const Dashboard = () => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardSummaryProps>({
    userCount: 0,
    orderCount: 0,
    appointmentCount: 0,
    productCount: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch data from all tables
        const fetchCounts = async () => {
          return await Promise.all([
            supabase.from('profiles').select('id', { count: 'exact', head: true }),
            supabase.from('orders').select('id', { count: 'exact', head: true }),
            supabase.from('appointments').select('id', { count: 'exact', head: true }),
            supabase.from('products').select('id', { count: 'exact', head: true })
          ]);
        };
        
        const [
          { count: usersCount, error: usersError },
          { count: ordersCount, error: ordersError },
          { count: appointmentsCount, error: appointmentsError },
          { count: productsCount, error: productsError }
        ] = await fetchCounts();
        
        // Check for errors
        if (usersError || ordersError || appointmentsError || productsError) {
          console.error("Database errors:", { usersError, ordersError, appointmentsError, productsError });
          throw new Error('Failed to fetch dashboard data');
        }
        
        setDashboardData({
          userCount: usersCount || 0,
          orderCount: ordersCount || 0,
          appointmentCount: appointmentsCount || 0,
          productCount: productsCount || 0,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "Error loading dashboard",
          description: "Failed to load dashboard data from the database.",
          variant: "destructive",
        });
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
              userCount={dashboardData.userCount} 
              orderCount={dashboardData.orderCount}
              appointmentCount={dashboardData.appointmentCount}
              productCount={dashboardData.productCount}
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
