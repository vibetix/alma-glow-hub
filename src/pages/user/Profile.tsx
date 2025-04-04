
import React, { useEffect, useState } from "react";
import { UserLayout } from "@/components/UserLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, User, Lock, CreditCard } from "lucide-react";

const profileSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  phone: z.string().optional(),
});

const passwordSchema = z.object({
  current_password: z.string().min(6, "Password must be at least 6 characters"),
  new_password: z.string().min(6, "Password must be at least 6 characters"),
  confirm_password: z.string().min(6, "Password must be at least 6 characters"),
}).refine(data => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

const UserProfile = () => {
  const { user, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: "",
    },
  });
  
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });
  
  useEffect(() => {
    if (profile) {
      profileForm.reset({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        phone: profile.phone || "",
      });
    }
  }, [profile, profileForm]);
  
  const onUpdateProfile = async (values: z.infer<typeof profileSchema>) => {
    if (!user?.id) return;
    
    try {
      setIsUpdating(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: values.first_name,
          last_name: values.last_name,
          phone: values.phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const onChangePassword = async (values: z.infer<typeof passwordSchema>) => {
    try {
      setIsChangingPassword(true);
      
      const { error } = await supabase.auth.updateUser({
        password: values.new_password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Password Updated",
        description: "Your password has been updated successfully.",
      });
      
      passwordForm.reset();
    } catch (error) {
      console.error("Error changing password:", error);
      toast({
        title: "Password Update Failed",
        description: "There was an error updating your password.",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };
  
  return (
    <UserLayout title="Profile Settings">
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Personal Info
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="payment">
            <CreditCard className="h-4 w-4 mr-2" />
            Payment Methods
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and contact information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile?.avatar_url || ""} />
                  <AvatarFallback className="text-xl">
                    {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium">{user?.name}</h3>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
              
              <Separator />
              
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onUpdateProfile)} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <FormField
                      control={profileForm.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your first name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={profileForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Your phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="bg-alma-gold hover:bg-alma-gold/90"
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Profile"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Update your password and secure your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-6">
                  <FormField
                    control={passwordForm.control}
                    name="current_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <FormField
                      control={passwordForm.control}
                      name="new_password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={passwordForm.control}
                      name="confirm_password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="bg-alma-gold hover:bg-alma-gold/90"
                      disabled={isChangingPassword}
                    >
                      {isChangingPassword ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating Password...
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Manage your payment methods and billing details.
              </CardDescription>
            </CardHeader>
            <CardContent className="py-10">
              <div className="flex flex-col items-center justify-center text-center">
                <CreditCard className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium">No Payment Methods</h3>
                <p className="mt-1 text-sm text-gray-500 max-w-md">
                  You haven't added any payment methods yet. Add a payment method to enable quicker checkout for future purchases.
                </p>
                <Button className="mt-6 bg-alma-gold hover:bg-alma-gold/90">
                  Add Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </UserLayout>
  );
};

export default UserProfile;
