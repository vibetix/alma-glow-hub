
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Bell, Clock, Calendar, UserCheck } from "lucide-react";

export const AppointmentPreferences = () => {
  const handleSavePreferences = () => {
    toast({
      title: "Preferences updated",
      description: "Your appointment preferences have been saved."
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          Appointment Preferences
        </CardTitle>
        <CardDescription>
          Customize your booking experience
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center">
                <Bell className="h-4 w-4 mr-2 text-muted-foreground" />
                <h4 className="font-medium">Appointment Reminders</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                Receive notifications before appointments
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <h4 className="font-medium">Preferred Time Slots</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                Afternoons (12pm - 5pm)
              </p>
            </div>
            <Button variant="outline" size="sm">
              Change
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center">
                <UserCheck className="h-4 w-4 mr-2 text-muted-foreground" />
                <h4 className="font-medium">Preferred Staff</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                Emma Johnson, Michael Chen
              </p>
            </div>
            <Button variant="outline" size="sm">
              Change
            </Button>
          </div>
          
          <div className="pt-3 space-y-3">
            <div className="border-t pt-3">
              <h4 className="text-sm font-medium mb-1">Additional Notes</h4>
              <p className="text-xs text-muted-foreground">
                I prefer minimally scented products and a quiet environment during treatments.
              </p>
            </div>
            
            <Button className="w-full" onClick={handleSavePreferences}>
              Save Preferences
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
