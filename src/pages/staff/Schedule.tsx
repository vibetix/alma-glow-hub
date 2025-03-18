
import React from "react";
import { StaffLayout } from "@/components/StaffLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarRange, ChevronLeft, ChevronRight, Clock, Users } from "lucide-react";
import { StaffWeekView } from "@/components/staff/StaffWeekView";

const Schedule = () => {
  const [currentWeek, setCurrentWeek] = React.useState(new Date());
  
  const formatWeekRange = (date: Date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    const startMonth = startOfWeek.toLocaleString('default', { month: 'short' });
    const endMonth = endOfWeek.toLocaleString('default', { month: 'short' });
    
    return `${startMonth} ${startOfWeek.getDate()} - ${endMonth} ${endOfWeek.getDate()}, ${endOfWeek.getFullYear()}`;
  };
  
  const previousWeek = () => {
    const prevWeek = new Date(currentWeek);
    prevWeek.setDate(currentWeek.getDate() - 7);
    setCurrentWeek(prevWeek);
  };
  
  const nextWeek = () => {
    const nxtWeek = new Date(currentWeek);
    nxtWeek.setDate(currentWeek.getDate() + 7);
    setCurrentWeek(nxtWeek);
  };
  
  return (
    <StaffLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">My Schedule</h1>
          <Button className="bg-alma-gold hover:bg-alma-gold/90 text-white">
            <Clock className="mr-2 h-4 w-4" />
            Set Availability
          </Button>
        </div>
        
        <Tabs defaultValue="week">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={previousWeek}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center px-3 py-1 rounded-md border bg-background">
                <CalendarRange className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm font-medium">{formatWeekRange(currentWeek)}</span>
              </div>
              
              <Button variant="outline" size="icon" onClick={nextWeek}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <TabsContent value="day">
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-muted-foreground py-12">
                  Daily view will be implemented soon.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="week" className="space-y-4">
            <StaffWeekView currentDate={currentWeek} />
          </TabsContent>
          
          <TabsContent value="month">
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-muted-foreground py-12">
                  Monthly view will be implemented soon.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </StaffLayout>
  );
};

export default Schedule;
