
import React from "react";
import { UserLayout } from "@/components/UserLayout";
import { RecommendedServices } from "@/components/user/RecommendedServices";
import { LoyaltyCard } from "@/components/user/LoyaltyCard";
import { ReferralProgram } from "@/components/user/ReferralProgram";
import { Wishlist } from "@/components/user/Wishlist";
import { useAuth } from "@/contexts/AuthContext";

const UserDashboard = () => {
  const { user } = useAuth();
  
  // Mock data for loyalty card
  const loyaltyData = {
    userName: user?.name || "Guest User",
    points: 750,
    tier: "Silver" as const,
    nextTierPoints: 1000,
    pointsToNextTier: 250
  };
  
  return (
    <UserLayout title="Dashboard">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LoyaltyCard {...loyaltyData} />
          <ReferralProgram />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RecommendedServices />
          <Wishlist />
        </div>
      </div>
    </UserLayout>
  );
};

export default UserDashboard;
