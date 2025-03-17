
import React from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { DashboardSummary } from "@/components/admin/DashboardSummary";
import { DataExport } from "@/components/admin/DataExport";
import { StaffPerformance } from "@/components/admin/StaffPerformance";
import { InventoryAlerts } from "@/components/admin/InventoryAlerts";
import { MarketingCampaigns } from "@/components/admin/MarketingCampaigns";

const Dashboard = () => {
  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        <DashboardSummary />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StaffPerformance />
          <DataExport />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InventoryAlerts />
          <MarketingCampaigns />
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
