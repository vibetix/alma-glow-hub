
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ShoppingBag, FileText, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

// Mock inventory alert data
const lowStockItems = [
  { id: 1, name: "Alma Rejuvenating Serum", stock: 5, threshold: 10 },
  { id: 2, name: "Natural Clay Mask", stock: 3, threshold: 10 },
  { id: 3, name: "Hydrating Body Lotion", stock: 8, threshold: 10 },
  { id: 4, name: "Exfoliating Facial Scrub", stock: 2, threshold: 5 },
];

export const InventoryAlerts = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Inventory Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Low Stock Alert</AlertTitle>
          <AlertDescription>
            {lowStockItems.length} products are low in stock and need attention.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-4">
          {lowStockItems.map((item) => (
            <div key={item.id} className="flex justify-between border-b pb-3 last:border-0 last:pb-0">
              <div>
                <h4 className="font-medium">{item.name}</h4>
                <div className="flex items-center text-sm mt-1">
                  <ShoppingBag className="mr-1 h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Current stock: </span>
                  <span className="ml-1 font-medium text-red-500">{item.stock}</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <Badge variant="destructive">Low Stock</Badge>
                <Button variant="ghost" size="sm" className="mt-1 h-6">
                  Restock
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex justify-between items-center pt-2 border-t">
          <div>
            <h4 className="text-sm font-medium">Set Alert Thresholds</h4>
            <p className="text-xs text-muted-foreground">
              Configure when to receive low stock alerts
            </p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/admin/products">
              Settings
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
