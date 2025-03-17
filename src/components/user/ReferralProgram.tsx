
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Share2, Copy, Gift, Check } from "lucide-react";

export const ReferralProgram = () => {
  const [copied, setCopied] = useState(false);
  
  // Mock referral data
  const referralCode = "ALMA-FRIEND25";
  const referralUrl = `https://alma-beauty.com/ref/${referralCode}`;
  const referralReward = "$25 credit";
  const friendReward = "15% off";
  const referralsCount = 3;
  const pendingReferrals = 2;
  
  const handleCopy = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "Your referral link has been copied."
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join me at Alma Beauty Spa',
        text: `Use my referral code ${referralCode} for ${friendReward} on your first service!`,
        url: referralUrl,
      });
    } else {
      handleCopy();
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Refer & Earn</CardTitle>
        <CardDescription>
          Invite friends and earn {referralReward} when they book their first service
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 rounded-md bg-purple-50 border border-purple-100">
            <h4 className="font-semibold mb-1 text-purple-800">Your Referral Code</h4>
            <div className="flex gap-3 items-center">
              <div className="flex-1 rounded-md bg-white p-2 border border-purple-200 font-mono font-medium text-center">
                {referralCode}
              </div>
              <Button variant="outline" className="shrink-0" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 rounded-md bg-gray-50">
              <p className="text-2xl font-bold text-alma-gold">{referralsCount}</p>
              <p className="text-xs text-gray-500">Successful Referrals</p>
            </div>
            <div className="p-3 rounded-md bg-gray-50">
              <p className="text-2xl font-bold text-gray-500">{pendingReferrals}</p>
              <p className="text-xs text-gray-500">Pending Invites</p>
            </div>
          </div>
          
          <div className="pt-2">
            <div className="mb-3">
              <h4 className="text-sm font-medium mb-1">Share your referral link</h4>
              <div className="flex gap-2">
                <Input value={referralUrl} readOnly className="bg-gray-50" />
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <Button className="w-full" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share with Friends
            </Button>
          </div>
          
          <div className="pt-2 text-xs text-gray-500">
            <p>How it works:</p>
            <ul className="list-disc pl-4 space-y-1 mt-1">
              <li>Your friends get {friendReward} their first service</li>
              <li>You get {referralReward} when they complete their appointment</li>
              <li>No limit on how many friends you can refer!</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
