
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

// Mock data for appointments
const appointments = [
  {
    id: 1,
    client: "Sarah Davis",
    service: "Full Highlights & Haircut",
    day: 1, // Monday
    startHour: 10,
    endHour: 11.5,
    status: "confirmed"
  },
  {
    id: 2,
    client: "Michael Brown",
    service: "Men's Haircut & Styling",
    day: 1, // Monday
    startHour: 12,
    endHour: 12.75,
    status: "confirmed"
  },
  {
    id: 3,
    client: "Jennifer Wilson",
    service: "Facial & Skin Treatment",
    day: 1, // Monday
    startHour: 14,
    endHour: 15.5,
    status: "new-client"
  },
  {
    id: 4,
    client: "Robert Johnson",
    service: "Beard Trim & Shave",
    day: 1, // Monday
    startHour: 16,
    endHour: 16.5,
    status: "confirmed"
  },
  {
    id: 5,
    client: "Amanda Lee",
    service: "Balayage & Blowout",
    day: 1, // Monday
    startHour: 17,
    endHour: 19,
    status: "confirmed"
  },
  {
    id: 6,
    client: "David Miller",
    service: "Haircut & Style",
    day: 2, // Tuesday
    startHour: 9,
    endHour: 10,
    status: "confirmed"
  },
  {
    id: 7,
    client: "Emily Thompson",
    service: "Color & Blowout",
    day: 2, // Tuesday
    startHour: 10.5,
    endHour: 12.5,
    status: "confirmed"
  },
  {
    id: 8,
    client: "James Wilson",
    service: "Men's Haircut",
    day: 2, // Tuesday
    startHour: 13,
    endHour: 13.5,
    status: "confirmed"
  },
  {
    id: 9,
    client: "Sophia Martinez",
    service: "Keratin Treatment",
    day: 3, // Wednesday
    startHour: 10,
    endHour: 12,
    status: "new-client"
  },
  {
    id: 10,
    client: "Daniel Johnson",
    service: "Haircut & Beard Trim",
    day: 3, // Wednesday
    startHour: 13,
    endHour: 14,
    status: "confirmed"
  },
  {
    id: 11,
    client: "Olivia Smith",
    service: "Highlights & Cut",
    day: 3, // Wednesday
    startHour: 15,
    endHour: 17,
    status: "confirmed"
  },
  {
    id: 12,
    client: "William Brown",
    service: "Men's Color & Cut",
    day: 4, // Thursday
    startHour: 11,
    endHour: 12,
    status: "confirmed"
  },
  {
    id: 13,
    client: "Emma Davis",
    service: "Blowout & Style",
    day: 4, // Thursday
    startHour: 12.5,
    endHour: 13.5,
    status: "confirmed"
  },
  {
    id: 14,
    client: "Alex Johnson",
    service: "Hair Treatment",
    day: 5, // Friday
    startHour: 9,
    endHour: 10,
    status: "confirmed"
  },
  {
    id: 15,
    client: "Ava Williams",
    service: "Full Highlights",
    day: 5, // Friday
    startHour: 14,
    endHour: 16,
    status: "confirmed"
  },
  {
    id: 16,
    client: "Noah Thomas",
    service: "Men's Haircut",
    day: 5, // Friday
    startHour: 16.5,
    endHour: 17,
    status: "new-client"
  },
  {
    id: 17,
    client: "Mia Martin",
    service: "Color Correction",
    day: 6, // Saturday
    startHour: 10,
    endHour: 13,
    status: "confirmed"
  },
  {
    id: 18,
    client: "Liam Anderson",
    service: "Haircut & Style",
    day: 6, // Saturday
    startHour: 14,
    endHour: 15,
    status: "confirmed"
  },
  {
    id: 19,
    client: "Charlotte Wilson",
    service: "Updo & Styling",
    day: 6, // Saturday
    startHour: 16,
    endHour: 17.5,
    status: "confirmed"
  }
];

interface StaffWeekViewProps {
  currentDate: Date;
}

export const StaffWeekView = ({ currentDate }: StaffWeekViewProps) => {
  // Generate the days of the week based on the current date
  const getDaysOfWeek = () => {
    const days = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push({
        name: day.toLocaleString('default', { weekday: 'short' }),
        date: day.getDate(),
        month: day.toLocaleString('default', { month: 'short' }),
        full: day
      });
    }
    
    return days;
  };
  
  const daysOfWeek = getDaysOfWeek();
  const businessHours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 8 PM
  
  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex border-b">
          <div className="w-16 border-r"></div>
          {daysOfWeek.map((day, index) => (
            <div 
              key={index} 
              className={`flex-1 p-2 text-center border-r last:border-r-0 ${
                day.full.toDateString() === new Date().toDateString() ? 'bg-alma-gold/10' : ''
              }`}
            >
              <p className="font-medium">{day.name}</p>
              <p className="text-sm">{day.month} {day.date}</p>
            </div>
          ))}
        </div>
        
        <div className="relative">
          {businessHours.map((hour, hourIndex) => (
            <div key={hourIndex} className="flex border-b last:border-b-0">
              <div className="w-16 py-2 px-2 border-r text-right text-xs text-muted-foreground">
                {hour === 12 ? '12 PM' : hour < 12 ? `${hour} AM` : `${hour - 12} PM`}
              </div>
              
              {[1, 2, 3, 4, 5, 6, 0].map((day, dayIndex) => (
                <div 
                  key={dayIndex} 
                  className={`flex-1 h-12 border-r last:border-r-0 relative ${
                    daysOfWeek[dayIndex].full.toDateString() === new Date().toDateString() ? 'bg-alma-gold/5' : ''
                  }`}
                >
                  {/* Half-hour line */}
                  <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-gray-100"></div>
                  
                  {/* Render appointments for this day and hour */}
                  {appointments
                    .filter(appt => appt.day === day && 
                             Math.floor(appt.startHour) === hour)
                    .map(appt => {
                      const durationHours = appt.endHour - appt.startHour;
                      const startOffset = (appt.startHour - Math.floor(appt.startHour)) * 100;
                      
                      return (
                        <div
                          key={appt.id}
                          className={`absolute left-0 right-0 mx-1 rounded px-2 py-1 overflow-hidden ${
                            appt.status === 'new-client' 
                              ? 'bg-blue-100 border-l-4 border-blue-500'
                              : 'bg-alma-gold/20 border-l-4 border-alma-gold'
                          }`}
                          style={{ 
                            top: `${startOffset}%`,
                            height: `${durationHours * 100}%`,
                            zIndex: 10
                          }}
                        >
                          <p className="font-medium text-xs truncate">{appt.client}</p>
                          <p className="text-xs truncate opacity-70">{appt.service}</p>
                        </div>
                      );
                    })}
                </div>
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
