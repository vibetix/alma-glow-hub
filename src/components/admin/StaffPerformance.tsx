
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/badge";
import { StarIcon, TrendingUp, Award } from "lucide-react";

// Mock data - in a real app, this would come from an API
const staffData = [
  { name: "Emma Johnson", appointments: 42, rating: 4.9, revenue: 3780 },
  { name: "Michael Chen", appointments: 38, rating: 4.7, revenue: 3420 },
  { name: "Sarah Williams", appointments: 45, rating: 4.8, revenue: 4050 },
  { name: "David Brown", appointments: 36, rating: 4.6, revenue: 3240 },
];

const chartData = [
  { name: "Emma", appointments: 42, revenue: 3780 },
  { name: "Michael", appointments: 38, revenue: 3420 },
  { name: "Sarah", appointments: 45, revenue: 4050 },
  { name: "David", appointments: 36, revenue: 3240 },
];

export const StaffPerformance = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Staff Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="appointments" fill="#8884d8" name="Appointments" />
              <Bar dataKey="revenue" fill="#82ca9d" name="Revenue ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="space-y-4">
          <div className="text-sm font-medium mb-2">Top Performers</div>
          {staffData.map((staff, index) => (
            <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
              <div>
                <p className="font-medium">{staff.name}</p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <StarIcon className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{staff.rating}/5.0</span>
                </div>
              </div>
              <div className="flex items-center">
                <Badge variant={index === 0 ? "gold" : "outline"} className="mr-2">
                  {index === 0 && <Award className="mr-1 h-3 w-3" />}
                  {staff.appointments} appts
                </Badge>
                <Badge variant={index === 0 ? "purple" : "secondary"}>
                  ${staff.revenue}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
