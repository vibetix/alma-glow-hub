
import React from "react";
import { StaffLayout } from "@/components/StaffLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StaffSettings = () => {
  return (
    <StaffLayout title="Settings">
      <Card>
        <CardHeader>
          <CardTitle>Staff Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Settings management coming soon...</p>
        </CardContent>
      </Card>
    </StaffLayout>
  );
};

export default StaffSettings;
