
import React from "react";
import { StaffLayout } from "@/components/StaffLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, ChevronLeft, ChevronRight } from "lucide-react";

// Mock data for clients
const clients = [
  {
    id: 1,
    name: "Sarah Davis",
    email: "sarah.davis@example.com",
    phone: "(555) 123-4567",
    lastVisit: "2023-10-15",
    status: "regular",
    avatar: "",
    initials: "SD"
  },
  {
    id: 2,
    name: "Michael Brown",
    email: "michael.brown@example.com",
    phone: "(555) 234-5678",
    lastVisit: "2023-10-20",
    status: "regular",
    avatar: "",
    initials: "MB"
  },
  {
    id: 3,
    name: "Jennifer Wilson",
    email: "jennifer.wilson@example.com",
    phone: "(555) 345-6789",
    lastVisit: "2023-10-25",
    status: "new",
    avatar: "",
    initials: "JW"
  },
  {
    id: 4,
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    phone: "(555) 456-7890",
    lastVisit: "2023-10-23",
    status: "regular",
    avatar: "",
    initials: "RJ"
  },
  {
    id: 5,
    name: "Amanda Lee",
    email: "amanda.lee@example.com",
    phone: "(555) 567-8901",
    lastVisit: "2023-10-18",
    status: "regular",
    avatar: "",
    initials: "AL"
  },
  {
    id: 6,
    name: "David Miller",
    email: "david.miller@example.com",
    phone: "(555) 678-9012",
    lastVisit: "2023-10-12",
    status: "regular",
    avatar: "",
    initials: "DM"
  },
  {
    id: 7,
    name: "Emily Thompson",
    email: "emily.thompson@example.com",
    phone: "(555) 789-0123",
    lastVisit: "2023-10-05",
    status: "regular",
    avatar: "",
    initials: "ET"
  },
  {
    id: 8,
    name: "James Wilson",
    email: "james.wilson@example.com",
    phone: "(555) 890-1234",
    lastVisit: "2023-10-28",
    status: "new",
    avatar: "",
    initials: "JW"
  }
];

const Clients = () => {
  return (
    <StaffLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight">My Clients</h1>
          <Button className="bg-alma-gold hover:bg-alma-gold/90 text-white">
            <UserPlus className="mr-2 h-4 w-4" />
            Add New Client
          </Button>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">Clients Directory</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Search clients..." className="pl-9 w-[250px]" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={client.avatar} />
                          <AvatarFallback className="bg-alma-gold/10 text-alma-gold">
                            {client.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{client.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{client.email}</p>
                      <p className="text-xs text-muted-foreground">{client.phone}</p>
                    </TableCell>
                    <TableCell>
                      {new Date(client.lastVisit).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {client.status === "new" ? (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          New Client
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Regular
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </StaffLayout>
  );
};

export default Clients;
