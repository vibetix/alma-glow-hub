
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { FileDown, FileSpreadsheet, FileCsv } from "lucide-react";

type ExportType = "products" | "customers" | "orders" | "appointments";

export const DataExport = () => {
  const [exportType, setExportType] = useState<ExportType>("products");
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = (format: "csv" | "excel") => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      
      // In a real app, this would trigger an actual file download
      toast({
        title: "Export successful",
        description: `Your ${exportType} data has been exported as ${format.toUpperCase()}`,
      });
    }, 1500);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Export Data</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Select data to export</label>
            <Select value={exportType} onValueChange={(value) => setExportType(value as ExportType)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select data type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="products">Products</SelectItem>
                <SelectItem value="customers">Customers</SelectItem>
                <SelectItem value="orders">Orders</SelectItem>
                <SelectItem value="appointments">Appointments</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex space-x-3">
            <Button 
              onClick={() => handleExport("csv")} 
              variant="outline" 
              className="flex-1"
              disabled={isExporting}
            >
              <FileCsv className="mr-2 h-4 w-4" />
              Export as CSV
            </Button>
            <Button 
              onClick={() => handleExport("excel")} 
              variant="outline" 
              className="flex-1"
              disabled={isExporting}
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export as Excel
            </Button>
          </div>
          
          <div className="mt-4">
            <p className="text-xs text-muted-foreground">
              Downloads include all current filters and sorting applied to your data.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
