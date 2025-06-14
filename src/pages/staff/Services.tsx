
import React from "react";
import { StaffLayout } from "@/components/StaffLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StaffServices = () => {
  return (
    <StaffLayout title="Services">
      <Card>
        <CardHeader>
          <CardTitle>My Services</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Service management coming soon...</p>
        </CardContent>
      </Card>
    </StaffLayout>
  );
};

export default StaffServices;
