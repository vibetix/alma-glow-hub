
import { useState } from "react";
import { UserLayout } from "@/components/UserLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { User, Phone, Mail, MapPin, Shield, CreditCard, X } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const Profile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  
  const [profileForm, setProfileForm] = useState({
    firstName: "Regular",
    lastName: "User",
    email: "user@alma.com",
    phone: "+1 (555) 123-4567",
  });

  const [addressForm, setAddressForm] = useState({
    street: "123 Beauty Lane",
    city: "Los Angeles",
    state: "California",
    zipCode: "90210",
    country: "United States",
  });

  const [paymentForm, setPaymentForm] = useState({
    cardNumber: "",
    nameOnCard: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    cardType: "credit",
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentSelectChange = (name: string, value: string) => {
    setPaymentForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSave = () => {
    // In a real app, this would be an API call
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
  };

  const handleAddressSave = () => {
    // In a real app, this would be an API call
    toast({
      title: "Address updated",
      description: "Your address has been updated successfully.",
    });
  };

  const handlePaymentSave = () => {
    // Validate payment form
    if (!paymentForm.cardNumber || !paymentForm.nameOnCard || 
        !paymentForm.expiryMonth || !paymentForm.expiryYear || !paymentForm.cvv) {
      toast({
        title: "Error",
        description: "Please fill in all payment details.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would validate and process the payment method
    const lastFour = paymentForm.cardNumber.slice(-4);
    const newPaymentMethod = {
      id: Date.now(),
      type: paymentForm.cardType,
      lastFour,
      nameOnCard: paymentForm.nameOnCard,
      expiry: `${paymentForm.expiryMonth}/${paymentForm.expiryYear.slice(-2)}`,
    };

    setPaymentMethods([...paymentMethods, newPaymentMethod]);
    setIsPaymentDialogOpen(false);
    setPaymentForm({
      cardNumber: "",
      nameOnCard: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      cardType: "credit",
    });

    toast({
      title: "Payment method added",
      description: "Your payment method has been added successfully.",
    });
  };

  const removePaymentMethod = (id: number) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
    toast({
      title: "Payment method removed",
      description: "Your payment method has been removed successfully.",
    });
  };

  return (
    <UserLayout title="Profile Settings">
      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList>
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="address">Address</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="payment">Payment Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Cancel" : "Edit"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">
                      <User className="inline-block w-4 h-4 mr-2" />
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={profileForm.firstName}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">
                      <User className="inline-block w-4 h-4 mr-2" />
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={profileForm.lastName}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      <Mail className="inline-block w-4 h-4 mr-2" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profileForm.email}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      <Phone className="inline-block w-4 h-4 mr-2" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={profileForm.phone}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                {isEditing && (
                  <div className="flex justify-end">
                    <Button 
                      className="bg-alma-gold hover:bg-alma-gold/90"
                      onClick={handleProfileSave}
                    >
                      Save Changes
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="address" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
              <CardDescription>Update your shipping address</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="street">
                    <MapPin className="inline-block w-4 h-4 mr-2" />
                    Street Address
                  </Label>
                  <Input
                    id="street"
                    name="street"
                    value={addressForm.street}
                    onChange={handleAddressChange}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={addressForm.city}
                      onChange={handleAddressChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      name="state"
                      value={addressForm.state}
                      onChange={handleAddressChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={addressForm.zipCode}
                      onChange={handleAddressChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value={addressForm.country}
                      onChange={handleAddressChange}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    className="bg-alma-gold hover:bg-alma-gold/90"
                    onClick={handleAddressSave}
                  >
                    Save Address
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Update your password</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">
                    <Shield className="inline-block w-4 h-4 mr-2" />
                    Current Password
                  </Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="Enter your current password"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter your new password"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your new password"
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button className="bg-alma-gold hover:bg-alma-gold/90">
                    Update Password
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Manage your payment methods</CardDescription>
                </div>
                <Button 
                  size="sm" 
                  className="bg-alma-gold hover:bg-alma-gold/90"
                  onClick={() => setIsPaymentDialogOpen(true)}
                >
                  Add Payment Method
                </Button>
              </div>
            </CardHeader>
            <CardContent className="py-6">
              {paymentMethods.length === 0 ? (
                <div className="text-center">
                  <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium">No payment methods</h3>
                  <p className="mt-1 text-gray-500">You haven't added any payment methods yet.</p>
                  <Button 
                    className="mt-6 bg-alma-gold hover:bg-alma-gold/90"
                    onClick={() => setIsPaymentDialogOpen(true)}
                  >
                    Add Payment Method
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex justify-between items-center p-4 border rounded-md">
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 mr-3 text-gray-500" />
                        <div>
                          <p className="font-medium capitalize">
                            {method.type} Card •••• {method.lastFour}
                          </p>
                          <p className="text-sm text-gray-500">
                            {method.nameOnCard} | Expires: {method.expiry}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removePaymentMethod(method.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Payment Method Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
              Enter your card details to add a new payment method.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="cardType">Card Type</Label>
              <Select 
                value={paymentForm.cardType}
                onValueChange={(value) => handlePaymentSelectChange("cardType", value)}
              >
                <SelectTrigger id="cardType">
                  <SelectValue placeholder="Select card type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit">Credit Card</SelectItem>
                  <SelectItem value="debit">Debit Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={paymentForm.cardNumber}
                onChange={handlePaymentChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="nameOnCard">Name on Card</Label>
              <Input
                id="nameOnCard"
                name="nameOnCard"
                placeholder="John Doe"
                value={paymentForm.nameOnCard}
                onChange={handlePaymentChange}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <Label htmlFor="expiryMonth">Month</Label>
                <Select 
                  value={paymentForm.expiryMonth}
                  onValueChange={(value) => handlePaymentSelectChange("expiryMonth", value)}
                >
                  <SelectTrigger id="expiryMonth">
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => {
                      const month = (i + 1).toString().padStart(2, '0');
                      return (
                        <SelectItem key={month} value={month}>
                          {month}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="col-span-1">
                <Label htmlFor="expiryYear">Year</Label>
                <Select 
                  value={paymentForm.expiryYear}
                  onValueChange={(value) => handlePaymentSelectChange("expiryYear", value)}
                >
                  <SelectTrigger id="expiryYear">
                    <SelectValue placeholder="YYYY" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => {
                      const year = (new Date().getFullYear() + i).toString();
                      return (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="col-span-1">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  name="cvv"
                  placeholder="123"
                  value={paymentForm.cvv}
                  onChange={handlePaymentChange}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-alma-gold hover:bg-alma-gold/90" onClick={handlePaymentSave}>
              Add Payment Method
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </UserLayout>
  );
};

export default Profile;
