
import React from "react";
import { StaffLayout } from "@/components/StaffLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Scissors, Star, DollarSign } from "lucide-react";

// Mock service data
const serviceCategories = [
  {
    id: 1,
    name: "Hair",
    services: [
      { id: 1, name: "Women's Haircut", duration: 60, price: 85, featured: true },
      { id: 2, name: "Men's Haircut", duration: 45, price: 55, featured: false },
      { id: 3, name: "Blowout", duration: 45, price: 65, featured: false },
      { id: 4, name: "Color", duration: 120, price: 125, featured: true },
      { id: 5, name: "Highlights", duration: 150, price: 175, featured: true },
    ]
  },
  {
    id: 2,
    name: "Skin Care",
    services: [
      { id: 6, name: "Signature Facial", duration: 60, price: 95, featured: true },
      { id: 7, name: "Deep Cleansing", duration: 75, price: 110, featured: false },
      { id: 8, name: "Anti-Aging Treatment", duration: 90, price: 140, featured: true },
    ]
  },
  {
    id: 3,
    name: "Nail Care",
    services: [
      { id: 9, name: "Manicure", duration: 45, price: 40, featured: false },
      { id: 10, name: "Pedicure", duration: 60, price: 65, featured: true },
      { id: 11, name: "Gel Polish", duration: 60, price: 55, featured: false },
    ]
  }
];

const Services = () => {
  return (
    <StaffLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Services</h1>
          <Button variant="outline" size="sm">
            <Scissors className="mr-2 h-4 w-4" />
            Service Guide
          </Button>
        </div>
        
        <Tabs defaultValue="hair">
          <TabsList className="mb-4">
            {serviceCategories.map(category => (
              <TabsTrigger key={category.id} value={category.name.toLowerCase()}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {serviceCategories.map(category => (
            <TabsContent key={category.id} value={category.name.toLowerCase()}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{category.name} Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.services.map(service => (
                      <div key={service.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{service.name}</h3>
                            {service.featured && (
                              <Badge variant="outline" className="bg-alma-gold/10 text-alma-gold border-alma-gold/20">
                                Featured
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Clock className="mr-1 h-3 w-3" />
                              {service.duration} min
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="mr-1 h-3 w-3" />
                              ${service.price}
                            </div>
                            <div className="flex items-center">
                              <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
                              4.8
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-md font-medium">Your Specialties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "Color", level: "Expert", clients: 68 },
                  { name: "Balayage", level: "Advanced", clients: 52 },
                  { name: "Hair Extensions", level: "Intermediate", clients: 24 },
                  { name: "Haircuts", level: "Expert", clients: 87 },
                  { name: "Blowouts", level: "Advanced", clients: 64 },
                  { name: "Treatments", level: "Intermediate", clients: 31 },
                ].map((specialty, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="font-medium">{specialty.name}</div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {specialty.level}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {specialty.clients} clients
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </StaffLayout>
  );
};

export default Services;
