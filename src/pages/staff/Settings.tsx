
import React from "react";
import { StaffLayout } from "@/components/StaffLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { User, Bell, Lock, Palette, Calendar, Clock } from "lucide-react";

const Settings = () => {
  const handleSaveProfile = () => {
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated."
    });
  };
  
  const handleSavePassword = () => {
    toast({
      title: "Password updated",
      description: "Your password has been successfully changed."
    });
  };
  
  const handleSaveNotifications = () => {
    toast({
      title: "Notification preferences saved",
      description: "Your notification settings have been updated."
    });
  };
  
  return (
    <StaffLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        </div>
        
        <Tabs defaultValue="profile">
          <div className="flex flex-col md:flex-row gap-6">
            <Card className="md:w-64 h-fit">
              <CardContent className="pt-6">
                <div className="space-y-1">
                  <TabsList className="flex flex-col w-full h-auto space-y-1">
                    <TabsTrigger value="profile" className="justify-start">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </TabsTrigger>
                    <TabsTrigger value="password" className="justify-start">
                      <Lock className="mr-2 h-4 w-4" />
                      Password
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="justify-start">
                      <Bell className="mr-2 h-4 w-4" />
                      Notifications
                    </TabsTrigger>
                    <TabsTrigger value="appearance" className="justify-start">
                      <Palette className="mr-2 h-4 w-4" />
                      Appearance
                    </TabsTrigger>
                    <TabsTrigger value="calendar" className="justify-start">
                      <Calendar className="mr-2 h-4 w-4" />
                      Calendar
                    </TabsTrigger>
                  </TabsList>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex-1">
              <TabsContent value="profile" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>
                      Manage your profile information visible to clients and staff.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col items-center gap-4 sm:flex-row">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-alma-gold/10 text-alma-gold text-xl">
                          EJ
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col sm:flex-row items-center gap-2">
                        <Button variant="outline" size="sm">
                          Upload New Photo
                        </Button>
                        <Button variant="outline" size="sm" className="text-muted-foreground">
                          Remove Photo
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">First Name</label>
                        <Input value="Emma" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Last Name</label>
                        <Input value="Johnson" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <Input value="staff@alma.com" />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone Number</label>
                      <Input value="(555) 123-4567" />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Professional Title</label>
                      <Input value="Senior Hair Stylist" />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Bio</label>
                      <Textarea
                        value="Emma is a passionate hair stylist with over 8 years of experience specializing in color, balayage, and precision cuts. She stays current with the latest trends and techniques through ongoing education and has a devoted client following."
                        rows={5}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Specialties</label>
                      <Input value="Color, Balayage, Hair Extensions, Haircuts, Blowouts" />
                      <p className="text-xs text-muted-foreground">Separate specialties with commas</p>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button onClick={handleSaveProfile} className="bg-alma-gold hover:bg-alma-gold/90 text-white">
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="password" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>
                      Change your password to keep your account secure.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Current Password</label>
                      <Input type="password" />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">New Password</label>
                      <Input type="password" />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Confirm New Password</label>
                      <Input type="password" />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button onClick={handleSavePassword} className="bg-alma-gold hover:bg-alma-gold/90 text-white">
                        Update Password
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>
                      Manage how and when you receive notifications.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Appointment Notifications</h4>
                          <p className="text-sm text-muted-foreground">Receive alerts for new and updated appointments</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Client Messages</h4>
                          <p className="text-sm text-muted-foreground">Get notified when clients send you messages</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Schedule Changes</h4>
                          <p className="text-sm text-muted-foreground">Notify about changes to your work schedule</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Performance Reviews</h4>
                          <p className="text-sm text-muted-foreground">Get notified about new client reviews</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Email Notifications</h4>
                          <p className="text-sm text-muted-foreground">Receive email notifications in addition to in-app alerts</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">SMS Notifications</h4>
                          <p className="text-sm text-muted-foreground">Receive text message notifications for important alerts</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button onClick={handleSaveNotifications} className="bg-alma-gold hover:bg-alma-gold/90 text-white">
                        Save Preferences
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="appearance" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>
                      Customize how the application looks and feels.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Dark Mode</h4>
                          <p className="text-sm text-muted-foreground">Use a darker color theme</p>
                        </div>
                        <Switch />
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Text Size</h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">A</span>
                          <input
                            type="range"
                            min="1"
                            max="3"
                            defaultValue="2"
                            className="flex-1"
                          />
                          <span className="text-lg">A</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Color Theme</h4>
                        <div className="grid grid-cols-4 gap-2">
                          <div className="h-10 w-10 rounded-full bg-alma-gold ring-2 ring-offset-2 ring-alma-gold cursor-pointer" />
                          <div className="h-10 w-10 rounded-full bg-blue-500 cursor-pointer" />
                          <div className="h-10 w-10 rounded-full bg-purple-500 cursor-pointer" />
                          <div className="h-10 w-10 rounded-full bg-green-500 cursor-pointer" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="calendar" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Calendar Settings</CardTitle>
                    <CardDescription>
                      Customize your calendar display preferences and integrations.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Default Calendar View</h4>
                          <p className="text-sm text-muted-foreground">Select your preferred calendar view</p>
                        </div>
                        <select className="border rounded p-2">
                          <option>Week</option>
                          <option>Day</option>
                          <option>Month</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Working Hours</h4>
                          <p className="text-sm text-muted-foreground">Set your typical working hours</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <select className="border rounded p-2 w-20">
                            <option>9:00</option>
                            <option>10:00</option>
                            <option>8:00</option>
                          </select>
                          <span>to</span>
                          <select className="border rounded p-2 w-20">
                            <option>5:00</option>
                            <option>6:00</option>
                            <option>7:00</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Weekend Display</h4>
                          <p className="text-sm text-muted-foreground">Show weekends in calendar</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Appointment Buffer Time</h4>
                          <p className="text-sm text-muted-foreground">Add buffer time between appointments</p>
                        </div>
                        <select className="border rounded p-2">
                          <option>15 minutes</option>
                          <option>30 minutes</option>
                          <option>No buffer</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">External Calendar Sync</h4>
                          <p className="text-sm text-muted-foreground">Sync with your Google/iCloud calendar</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Clock className="mr-2 h-4 w-4" />
                          Connect
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button className="bg-alma-gold hover:bg-alma-gold/90 text-white">
                        Save Calendar Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </StaffLayout>
  );
};

export default Settings;
