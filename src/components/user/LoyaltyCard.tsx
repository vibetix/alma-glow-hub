
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronRight, Gift, Star, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

type LoyaltyCardProps = {
  userName: string;
  points: number;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum";
  nextTierPoints: number;
  pointsToNextTier: number;
};

// Helper function to get tier color
const getTierColor = (tier: string) => {
  switch (tier) {
    case "Bronze":
      return "bg-amber-700";
    case "Silver":
      return "bg-gray-400";
    case "Gold":
      return "bg-alma-gold";
    case "Platinum":
      return "bg-purple-600";
    default:
      return "bg-alma-gold";
  }
};

export const LoyaltyCard = ({
  userName,
  points,
  tier,
  nextTierPoints,
  pointsToNextTier,
}: LoyaltyCardProps) => {
  const progress = Math.floor((points / nextTierPoints) * 100);
  const tierColor = getTierColor(tier);

  return (
    <Card className="overflow-hidden border-none shadow-md">
      <div className={`${tierColor} h-2 w-full`}></div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Alma Beauty Rewards</CardTitle>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-current text-alma-gold" />
            <span className="font-medium">{points} points</span>
          </div>
        </div>
        <CardDescription>Exclusive perks for our valued customers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Current tier: <span className="font-semibold">{tier}</span></span>
            <span>{pointsToNextTier} points to next tier</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-sm mb-4">
          <div className="bg-gray-100 rounded p-2">
            <p className="font-bold text-lg">10%</p>
            <p className="text-gray-600">Product Discount</p>
          </div>
          <div className="bg-gray-100 rounded p-2">
            <p className="font-bold text-lg">2x</p>
            <p className="text-gray-600">Points on Services</p>
          </div>
          <div className="bg-gray-100 rounded p-2">
            <p className="font-bold text-lg">Free</p>
            <p className="text-gray-600">Birthday Gift</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline" size="sm" className="gap-1">
          <Gift className="h-4 w-4" />
          Redeem Points
        </Button>
        <Button variant="ghost" size="sm" className="gap-1">
          View Benefits
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
