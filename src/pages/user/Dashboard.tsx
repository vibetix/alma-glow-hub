
import React from "react";
import { UserLayout } from "@/components/UserLayout";
import { RecommendedServices } from "@/components/user/RecommendedServices";
import { LoyaltyCard } from "@/components/user/LoyaltyCard";
import { ReferralProgram } from "@/components/user/ReferralProgram";
import { Wishlist } from "@/components/user/Wishlist";

const UserDashboard = () => {
  return (
    <UserLayout title="Dashboard">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LoyaltyCard />
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
