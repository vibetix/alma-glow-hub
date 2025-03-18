
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Megaphone, 
  Users, 
  Calendar,
  PieChart,
  BarChart3,
  ArrowUpRight
} from "lucide-react";

// Mock data for campaigns
const campaigns = [
  { 
    id: 1, 
    name: "Summer Special", 
    status: "active", 
    audience: "All Customers", 
    reach: 2456, 
    engagement: 18, 
    conversions: 89,
    startDate: "2023-06-01",
    endDate: "2023-08-31"
  },
  { 
    id: 2, 
    name: "Loyalty Members Exclusive", 
    status: "scheduled", 
    audience: "Gold Members", 
    reach: 873, 
    engagement: 0, 
    conversions: 0,
    startDate: "2023-09-15",
    endDate: "2023-10-15"
  },
  { 
    id: 3, 
    name: "Holiday Gift Sets", 
    status: "draft", 
    audience: "All Customers", 
    reach: 0, 
    engagement: 0, 
    conversions: 0,
    startDate: null,
    endDate: null
  }
];

export const MarketingCampaigns = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Marketing Campaigns</CardTitle>
            <CardDescription>Manage your promotional campaigns</CardDescription>
          </div>
          <Button size="sm">
            <Megaphone className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="border rounded-md p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{campaign.name}</h3>
                <Badge 
                  variant={
                    campaign.status === "active" ? "default" : 
                    campaign.status === "scheduled" ? "secondary" : 
                    "outline"
                  }
                  className={campaign.status === "active" ? "bg-amber-500 hover:bg-amber-600" : ""}
                >
                  {campaign.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mb-2">
                <div className="text-xs">
                  <span className="text-muted-foreground">Audience:</span> {campaign.audience}
                </div>
                <div className="text-xs">
                  <span className="text-muted-foreground">Reach:</span> {campaign.reach.toLocaleString()}
                </div>
                <div className="text-xs">
                  <span className="text-muted-foreground">Conversions:</span> {campaign.conversions}
                </div>
              </div>
              
              {campaign.status === "active" && (
                <>
                  <div className="mt-3 mb-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Campaign progress</span>
                      <span>68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                </>
              )}
              
              <div className="flex justify-between items-center mt-3">
                <div className="text-xs text-muted-foreground">
                  {campaign.startDate ? (
                    <>
                      {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate!).toLocaleDateString()}
                    </>
                  ) : (
                    "Not scheduled"
                  )}
                </div>
                <Button variant="ghost" size="sm">
                  Details
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
