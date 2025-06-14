
import React from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StaffManagement = () => {
  return (
    <AdminLayout title="Staff Management">
      <Card>
        <CardHeader>
          <CardTitle>Advanced Staff Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Advanced staff management features coming soon...</p>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default StaffManagement;
