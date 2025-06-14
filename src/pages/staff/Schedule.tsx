
import React from "react";
import { StaffLayout } from "@/components/StaffLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StaffSchedule = () => {
  return (
    <StaffLayout title="Schedule">
      <Card>
        <CardHeader>
          <CardTitle>My Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Schedule management coming soon...</p>
        </CardContent>
      </Card>
    </StaffLayout>
  );
};

export default StaffSchedule;
