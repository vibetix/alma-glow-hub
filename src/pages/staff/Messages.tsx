
import React from "react";
import { StaffLayout } from "@/components/StaffLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StaffMessages = () => {
  return (
    <StaffLayout title="Messages">
      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Messaging system coming soon...</p>
        </CardContent>
      </Card>
    </StaffLayout>
  );
};

export default StaffMessages;
