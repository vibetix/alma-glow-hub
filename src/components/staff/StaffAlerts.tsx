
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Clock, Clipboard, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data for alerts
const alerts = [
  {
    id: 1,
    type: "inventory",
    title: "Low inventory alert",
    description: "Purple shampoo and conditioner running low",
    icon: <Clipboard className="h-5 w-5 text-amber-500" />,
    time: "1 hour ago"
  },
  {
    id: 2,
    type: "schedule",
    title: "Schedule change",
    description: "Thursday's availability was updated",
    icon: <Clock className="h-5 w-5 text-blue-500" />,
    time: "3 hours ago"
  },
  {
    id: 3,
    type: "message",
    title: "New client message",
    description: "Jennifer asked about product recommendations",
    icon: <MessageSquare className="h-5 w-5 text-green-500" />,
    time: "5 hours ago"
  }
];

export const StaffAlerts = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">Alerts</CardTitle>
        <AlertCircle className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-start gap-3 border-b pb-4 last:border-0 last:pb-0">
              <div className="bg-gray-100 rounded-full p-2 mt-0.5">
                {alert.icon}
              </div>
              <div className="space-y-1">
                <p className="font-medium text-sm">{alert.title}</p>
                <p className="text-xs text-muted-foreground">{alert.description}</p>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-xs text-muted-foreground">{alert.time}</span>
                  <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                    Mark as read
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
