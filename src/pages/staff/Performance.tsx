
import React from "react";
import { StaffLayout } from "@/components/StaffLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StaffPerformanceMetrics } from "@/components/staff/StaffPerformanceMetrics";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Calendar, ArrowUpRight, Award, Users, DollarSign, Clock } from "lucide-react";

// Mock data for charts
const revenueData = [
  { name: "Jan", revenue: 3200 },
  { name: "Feb", revenue: 3400 },
  { name: "Mar", revenue: 3100 },
  { name: "Apr", revenue: 3700 },
  { name: "May", revenue: 3900 },
  { name: "Jun", revenue: 4200 },
];

const clientData = [
  { name: "Jan", new: 12, returning: 28 },
  { name: "Feb", new: 15, returning: 30 },
  { name: "Mar", new: 18, returning: 25 },
  { name: "Apr", new: 14, returning: 32 },
  { name: "May", new: 20, returning: 35 },
  { name: "Jun", new: 22, returning: 38 },
];

const Performance = () => {
  return (
    <StaffLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Performance</h1>
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">Viewing period:</div>
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Last 6 Months
            </Button>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$21,500</div>
              <div className="flex items-center pt-1">
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-xs text-green-500 font-medium">12% from last period</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Client Retention</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">93%</div>
              <div className="flex items-center pt-1">
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-xs text-green-500 font-medium">3% from last period</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">New Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">101</div>
              <div className="flex items-center pt-1">
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-xs text-green-500 font-medium">18% from last period</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.9/5.0</div>
              <div className="flex items-center pt-1">
                <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                <span className="text-xs text-muted-foreground">Based on 87 reviews</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-md font-medium">Revenue Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-md font-medium">Client Acquisition</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={clientData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="new" fill="#8884d8" name="New Clients" />
                        <Bar dataKey="returning" fill="#82ca9d" name="Returning Clients" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <StaffPerformanceMetrics />
          </TabsContent>
          
          <TabsContent value="clients">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Client Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-medium">Appointment Frequency</p>
                      <p className="text-xl font-bold mt-1">Every 5.2 weeks</p>
                      <p className="text-xs text-muted-foreground mt-1">Average time between appointments</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-medium">Average Spending</p>
                      <p className="text-xl font-bold mt-1">$145 per visit</p>
                      <p className="text-xs text-muted-foreground mt-1">Including services and products</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-medium">Referral Rate</p>
                      <p className="text-xl font-bold mt-1">12.5%</p>
                      <p className="text-xs text-muted-foreground mt-1">Clients who refer others</p>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">Top Clients</th>
                          <th className="text-left py-3 px-4 font-medium">Visits</th>
                          <th className="text-left py-3 px-4 font-medium">Spending</th>
                          <th className="text-left py-3 px-4 font-medium">Last Visit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: "Jennifer Wilson", visits: 24, spending: "$3,450", last: "June 10, 2023" },
                          { name: "Michael Brown", visits: 18, spending: "$2,890", last: "June 17, 2023" },
                          { name: "Sarah Davis", visits: 16, spending: "$2,340", last: "June 5, 2023" },
                          { name: "Robert Johnson", visits: 14, spending: "$1,980", last: "June 12, 2023" },
                          { name: "Amanda Lee", visits: 12, spending: "$1,750", last: "May 28, 2023" },
                        ].map((client, i) => (
                          <tr key={i} className="border-b">
                            <td className="py-3 px-4 font-medium">{client.name}</td>
                            <td className="py-3 px-4">{client.visits}</td>
                            <td className="py-3 px-4">{client.spending}</td>
                            <td className="py-3 px-4">{client.last}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Service Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">Service</th>
                          <th className="text-left py-3 px-4 font-medium">Count</th>
                          <th className="text-left py-3 px-4 font-medium">Revenue</th>
                          <th className="text-left py-3 px-4 font-medium">Rating</th>
                          <th className="text-left py-3 px-4 font-medium">Growth</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: "Color", count: 68, revenue: "$8,500", rating: "4.9", growth: "+15%" },
                          { name: "Balayage", count: 52, revenue: "$7,280", rating: "4.8", growth: "+22%" },
                          { name: "Women's Haircut", count: 87, revenue: "$7,395", rating: "4.9", growth: "+8%" },
                          { name: "Blowout", count: 64, revenue: "$4,160", rating: "4.7", growth: "+5%" },
                          { name: "Men's Haircut", count: 45, revenue: "$2,475", rating: "4.8", growth: "+12%" },
                        ].map((service, i) => (
                          <tr key={i} className="border-b">
                            <td className="py-3 px-4 font-medium">{service.name}</td>
                            <td className="py-3 px-4">{service.count}</td>
                            <td className="py-3 px-4">{service.revenue}</td>
                            <td className="py-3 px-4">{service.rating}</td>
                            <td className="py-3 px-4 text-green-500">{service.growth}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Client Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    {
                      name: "Jennifer Wilson",
                      date: "June 10, 2023",
                      service: "Balayage & Cut",
                      rating: 5,
                      review: "Emma is amazing! She understood exactly what I wanted and delivered a beautiful balayage. She took her time to explain what she was doing and gave me great tips for maintaining my color. Highly recommend!"
                    },
                    {
                      name: "Michael Brown",
                      date: "June 17, 2023",
                      service: "Men's Haircut",
                      rating: 5,
                      review: "Best haircut I've ever had. Emma listened to what I wanted and gave suggestions to improve the style. Very professional and friendly."
                    },
                    {
                      name: "Sarah Davis",
                      date: "June 5, 2023",
                      service: "Full Color & Blowout",
                      rating: 4,
                      review: "Love my new color! Emma is talented and knowledgeable. The only reason for 4 stars instead of 5 is that the appointment ran a bit over time, but the results were worth the wait."
                    },
                  ].map((review, i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{review.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{review.service}</Badge>
                            <span className="text-xs text-muted-foreground">{review.date}</span>
                          </div>
                        </div>
                        <div className="flex">
                          {Array(review.rating).fill(0).map((_, i) => (
                            <Award key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm mt-2">{review.review}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </StaffLayout>
  );
};

export default Performance;
