
import React from "react";
import { StaffLayout } from "@/components/StaffLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StaffTimeManagement = () => {
  return (
    <StaffLayout title="Time Management">
      <Card>
        <CardHeader>
          <CardTitle>Time Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Time tracking coming soon...</p>
        </CardContent>
      </Card>
    </StaffLayout>
  );
};

export default StaffTimeManagement;
