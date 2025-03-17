
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

// Mock data for recommended services
const recommendedServices = [
  {
    id: 1,
    name: "Deep Tissue Massage",
    description: "Perfect after your recent spa visit",
    image: "/lovable-uploads/fb6df437-d752-46c4-9f14-60e6145c5695.png",
    path: "/spa",
  },
  {
    id: 2,
    name: "Hair Conditioning Treatment",
    description: "Recommended based on your hair type",
    image: "/lovable-uploads/fb6df437-d752-46c4-9f14-60e6145c5695.png",
    path: "/hair",
  },
  {
    id: 3,
    name: "Anti-Aging Facial",
    description: "Pairs well with products you've purchased",
    image: "/lovable-uploads/fb6df437-d752-46c4-9f14-60e6145c5695.png",
    path: "/skincare",
  },
];

export const RecommendedServices = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Recommended For You</CardTitle>
        <CardDescription>Based on your previous appointments and preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendedServices.map((service) => (
            <div key={service.id} className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
              <img
                src={service.image}
                alt={service.name}
                className="h-16 w-16 rounded-md object-cover"
              />
              <div className="flex-1">
                <h4 className="font-medium">{service.name}</h4>
                <p className="text-sm text-gray-500">{service.description}</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to={service.path}>Book</Link>
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="ghost" size="sm" asChild className="gap-1 text-alma-gold">
            <Link to="/booking">
              View all services
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
