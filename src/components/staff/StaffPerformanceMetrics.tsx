
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Clock, Star, DollarSign, UserCheck } from "lucide-react";

// Mock data for performance metrics
const performanceData = [
  { name: "Mon", clients: 7, hours: 8, revenue: 560 },
  { name: "Tue", clients: 5, hours: 6, revenue: 420 },
  { name: "Wed", clients: 8, hours: 9, revenue: 640 },
  { name: "Thu", clients: 6, hours: 7, revenue: 490 },
  { name: "Fri", clients: 9, hours: 10, revenue: 720 },
  { name: "Sat", clients: 10, hours: 11, revenue: 800 },
  { name: "Sun", clients: 0, hours: 0, revenue: 0 },
];

const statsData = [
  {
    title: "Client Satisfaction",
    value: "4.9/5",
    icon: <Star className="h-5 w-5 text-yellow-500" />,
    description: "Based on 32 reviews this month"
  },
  {
    title: "Hours Worked",
    value: "38 hrs",
    icon: <Clock className="h-5 w-5 text-blue-500" />,
    description: "This week (87% of target)"
  },
  {
    title: "Revenue Generated",
    value: "$3,630",
    icon: <DollarSign className="h-5 w-5 text-green-500" />,
    description: "This week (up 12% from last week)"
  },
  {
    title: "Client Retention",
    value: "93%",
    icon: <UserCheck className="h-5 w-5 text-purple-500" />,
    description: "45 returning clients this month"
  }
];

export const StaffPerformanceMetrics = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Weekly Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="clients" name="Clients" fill="#8884d8" />
                <Bar dataKey="hours" name="Hours" fill="#82ca9d" />
                <Bar dataKey="revenue" name="Revenue ($)" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsData.map((stat, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-white rounded-full p-2 shadow-sm">
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{stat.title}</p>
                    <p className="text-xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
