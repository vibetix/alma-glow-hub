
import React from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TestUsers = () => {
  return (
    <AdminLayout title="Test Users">
      <Card>
        <CardHeader>
          <CardTitle>Test User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Test user creation and management coming soon...</p>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default TestUsers;
