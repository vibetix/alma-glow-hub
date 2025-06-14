
import React from "react";
import { StaffLayout } from "@/components/StaffLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StaffPerformance = () => {
  return (
    <StaffLayout title="Performance">
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Performance analytics coming soon...</p>
        </CardContent>
      </Card>
    </StaffLayout>
  );
};

export default StaffPerformance;
