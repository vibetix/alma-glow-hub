
import React from "react";
import { StaffLayout } from "@/components/StaffLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const TimeManagement = () => {
  const handleSaveAvailability = () => {
    toast({
      title: "Availability saved",
      description: "Your weekly availability has been updated successfully.",
    });
  };
  
  return (
    <StaffLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Time Management</h1>
          <Button
            className="bg-alma-gold hover:bg-alma-gold/90 text-white"
            onClick={handleSaveAvailability}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Save Availability
          </Button>
        </div>
        
        <Tabs defaultValue="availability">
          <TabsList>
            <TabsTrigger value="availability">Weekly Availability</TabsTrigger>
            <TabsTrigger value="timeoff">Time Off Requests</TabsTrigger>
            <TabsTrigger value="history">Time History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="availability" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Set Your Weekly Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                    <div key={day} className="grid grid-cols-[1fr_2fr_2fr] gap-4 items-center">
                      <div className="font-medium">{day}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Start:</span>
                        <select className="border rounded p-2 w-full">
                          <option value="">Not Available</option>
                          <option value="9:00">9:00 AM</option>
                          <option value="10:00">10:00 AM</option>
                          <option value="11:00">11:00 AM</option>
                          {/* More options */}
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">End:</span>
                        <select className="border rounded p-2 w-full">
                          <option value="">Not Available</option>
                          <option value="17:00">5:00 PM</option>
                          <option value="18:00">6:00 PM</option>
                          <option value="19:00">7:00 PM</option>
                          {/* More options */}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="timeoff">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Time Off Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border p-4 rounded-md bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Vacation Request</h3>
                        <p className="text-sm text-muted-foreground">July 15 - July 22, 2023</p>
                        <div className="flex items-center mt-2">
                          <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                          <span className="text-xs text-muted-foreground">Requested on June 10, 2023</span>
                        </div>
                      </div>
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                        Pending
                      </span>
                    </div>
                  </div>
                  
                  <div className="border p-4 rounded-md bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Personal Day</h3>
                        <p className="text-sm text-muted-foreground">June 30, 2023</p>
                        <div className="flex items-center mt-2">
                          <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                          <span className="text-xs text-muted-foreground">Requested on June 15, 2023</span>
                        </div>
                      </div>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                        Approved
                      </span>
                    </div>
                  </div>
                  
                  <Button className="w-full">
                    <Calendar className="mr-2 h-4 w-4" />
                    Request Time Off
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Time History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">Date</th>
                          <th className="text-left py-3 px-4 font-medium">Clock In</th>
                          <th className="text-left py-3 px-4 font-medium">Clock Out</th>
                          <th className="text-left py-3 px-4 font-medium">Total Hours</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { date: "June 18, 2023", in: "9:00 AM", out: "5:30 PM", hours: "8.5" },
                          { date: "June 17, 2023", in: "9:15 AM", out: "5:45 PM", hours: "8.5" },
                          { date: "June 16, 2023", in: "8:45 AM", out: "4:30 PM", hours: "7.75" },
                          { date: "June 15, 2023", in: "9:00 AM", out: "6:00 PM", hours: "9.0" },
                          { date: "June 14, 2023", in: "9:30 AM", out: "5:45 PM", hours: "8.25" },
                        ].map((day, i) => (
                          <tr key={i} className="border-b">
                            <td className="py-3 px-4">{day.date}</td>
                            <td className="py-3 px-4">{day.in}</td>
                            <td className="py-3 px-4">{day.out}</td>
                            <td className="py-3 px-4">{day.hours}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </StaffLayout>
  );
};

export default TimeManagement;
