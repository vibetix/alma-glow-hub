
import React from "react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, User } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const AuthStatusBadge = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={`${
              user?.role === "admin" 
                ? "bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200" 
                : "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200"
            } font-medium`}
          >
            {user?.role === "admin" ? (
              <>
                <Shield className="h-3 w-3 mr-1" /> Admin
              </>
            ) : (
              <>
                <User className="h-3 w-3 mr-1" /> User
              </>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">Logged in as: {user?.email}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
