
import React from "react";
import { StaffLayout } from "@/components/StaffLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StaffClients = () => {
  return (
    <StaffLayout title="Clients">
      <Card>
        <CardHeader>
          <CardTitle>My Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Client management coming soon...</p>
        </CardContent>
      </Card>
    </StaffLayout>
  );
};

export default StaffClients;
