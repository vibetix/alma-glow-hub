
import React, { useEffect, useState } from "react";
import { UserLayout } from "@/components/UserLayout";
import { RecommendedServices } from "@/components/user/RecommendedServices";
import { LoyaltyCard } from "@/components/user/LoyaltyCard";
import { ReferralProgram } from "@/components/user/ReferralProgram";
import { Wishlist } from "@/components/user/Wishlist";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

// Define types for our dashboard data
type UserStats = {
  appointmentCount: number;
  orderCount: number;
  wishlistCount: number;
  points: number;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum";
};

const UserDashboard = () => {
  const { user, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [userStats, setUserStats] = useState<UserStats>({
    appointmentCount: 0,
    orderCount: 0,
    wishlistCount: 0,
    points: 0,
    tier: "Bronze",
  });
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        
        // Fetch appointment count
        const { count: appointmentCount, error: appointmentError } = await supabase
          .from('appointments')
          .select('*', { count: 'exact', head: true })
          .eq('client_id', user.id);
        
        if (appointmentError) throw appointmentError;
        
        // Fetch order count
        const { count: orderCount, error: orderError } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
        
        if (orderError) throw orderError;
        
        // Calculate loyalty points and tier
        // For this demo, we'll calculate based on order and appointment counts
        const basePoints = (appointmentCount || 0) * 50 + (orderCount || 0) * 100;
        
        let tier: UserStats['tier'] = "Bronze";
        if (basePoints >= 1000) tier = "Silver";
        if (basePoints >= 2000) tier = "Gold";
        if (basePoints >= 3000) tier = "Platinum";
        
        setUserStats({
          appointmentCount: appointmentCount || 0,
          orderCount: orderCount || 0,
          wishlistCount: Math.floor(Math.random() * 5), // Placeholder - would be a real count in a full implementation
          points: basePoints,
          tier,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error Loading Dashboard",
          description: "Failed to load your dashboard data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user?.id) {
      fetchUserData();
    } else {
      setIsLoading(false);
    }
  }, [user?.id]);
  
  // Calculate points needed for next tier
  const getNextTierPoints = () => {
    switch (userStats.tier) {
      case "Bronze": return 1000;
      case "Silver": return 2000;
      case "Gold": return 3000;
      case "Platinum": return null; // Already at highest tier
    }
  };
  
  const nextTierPoints = getNextTierPoints();
  
  // Loyalty card data
  const loyaltyData = {
    userName: user?.name || "Guest User",
    points: userStats.points,
    tier: userStats.tier,
    nextTierPoints: nextTierPoints || userStats.points, // If at max tier, use current points
    pointsToNextTier: nextTierPoints ? nextTierPoints - userStats.points : 0
  };
  
  return (
    <UserLayout title="Dashboard">
      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      ) : (
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
      )}
    </UserLayout>
  );
};

export default UserDashboard;
