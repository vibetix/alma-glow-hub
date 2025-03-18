
import React from "react";
import { StaffLayout } from "@/components/StaffLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Search, Star, Send, Phone } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock conversation data
const conversations = [
  {
    id: 1,
    client: { name: "Jennifer Wilson", avatar: "", initials: "JW" },
    lastMessage: "Hi, I was wondering if you have any recommendations for home hair care?",
    time: "10:30 AM",
    unread: true,
  },
  {
    id: 2,
    client: { name: "Michael Brown", avatar: "", initials: "MB" },
    lastMessage: "Thanks for the great haircut yesterday!",
    time: "Yesterday",
    unread: false,
  },
  {
    id: 3,
    client: { name: "Sarah Davis", avatar: "", initials: "SD" },
    lastMessage: "I'd like to reschedule my appointment for next week.",
    time: "Yesterday",
    unread: false,
  },
  {
    id: 4,
    client: { name: "Robert Johnson", avatar: "", initials: "RJ" },
    lastMessage: "Do you have any openings this Saturday?",
    time: "Jun 15",
    unread: false,
  },
  {
    id: 5,
    client: { name: "Amanda Lee", avatar: "", initials: "AL" },
    lastMessage: "Looking forward to trying the new hair treatment!",
    time: "Jun 12",
    unread: false,
  }
];

// Mock message history for the current conversation
const currentConversation = [
  {
    id: 1,
    sender: "client",
    message: "Hi Emma! I was wondering if you have any recommendations for home hair care products for color-treated hair?",
    time: "10:30 AM"
  },
  {
    id: 2,
    sender: "staff",
    message: "Hi Jennifer! Absolutely, I'd recommend using a color-safe shampoo and conditioner. The Kerastase Reflection line is excellent for maintaining color vibrancy.",
    time: "10:45 AM"
  },
  {
    id: 3,
    sender: "client",
    message: "That sounds great! Do you sell those products at the salon?",
    time: "11:00 AM"
  },
  {
    id: 4,
    sender: "staff",
    message: "Yes, we do! We have the full line in stock. If you'd like, I can set some aside for you to pick up during your next appointment.",
    time: "11:05 AM"
  },
  {
    id: 5,
    sender: "client",
    message: "Perfect! Yes, please set aside the shampoo and conditioner. I'll pick them up next week.",
    time: "11:15 AM"
  }
];

const Messages = () => {
  const handleSendMessage = () => {
    toast({
      title: "Message sent",
      description: "Your message has been sent to Jennifer Wilson."
    });
  };
  
  return (
    <StaffLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
          <div className="flex gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full rounded-md border border-input bg-background pl-8 pr-3 py-2 text-sm ring-offset-background"
              />
            </div>
            <Button variant="outline" size="sm">
              <MessageSquare className="mr-2 h-4 w-4" />
              New Message
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card className="h-[calc(100vh-200px)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-medium">Conversations</CardTitle>
              </CardHeader>
              <CardContent className="overflow-y-auto h-full">
                <div className="space-y-2">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`flex items-center gap-3 p-3 rounded-md cursor-pointer ${
                        conversation.id === 1 ? "bg-alma-gold/10" : "hover:bg-gray-100"
                      }`}
                    >
                      <Avatar>
                        <AvatarImage src={conversation.client.avatar} />
                        <AvatarFallback className={conversation.id === 1 ? "bg-alma-gold/20 text-alma-gold" : ""}>
                          {conversation.client.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className="font-medium truncate">{conversation.client.name}</p>
                          <span className="text-xs text-muted-foreground">{conversation.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                      </div>
                      {conversation.unread && (
                        <div className="w-2 h-2 bg-alma-gold rounded-full flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card className="h-[calc(100vh-200px)] flex flex-col">
              <CardHeader className="border-b pb-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-alma-gold/20 text-alma-gold">JW</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-md font-medium">Jennifer Wilson</CardTitle>
                      <p className="text-xs text-muted-foreground">Last appointment: June 10, 2023</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Star className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {currentConversation.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "staff" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.sender === "staff"
                            ? "bg-alma-gold/10 text-alma-gold/90"
                            : "bg-gray-100"
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p className="text-xs text-right mt-1 text-muted-foreground">{message.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Type your message..."
                    className="min-h-[60px]"
                  />
                  <Button className="bg-alma-gold hover:bg-alma-gold/90 text-white h-[60px]" onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
};

export default Messages;
