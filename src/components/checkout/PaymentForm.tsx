
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, CreditCard, Lock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PaymentFormProps {
  onSubmit: () => void;
  onBack: () => void;
}

export const PaymentForm = ({ onSubmit, onBack }: PaymentFormProps) => {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      toast({
        title: "Missing information",
        description: "Please fill in all payment details",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, you would process the payment here
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onSubmit();
    }, 1500);
  };
  
  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };
  
  // Format expiry date (MM/YY)
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    
    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <h2 className="text-xl font-medium mb-6">Payment Information</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-500 flex items-center">
            <Lock size={14} className="mr-1" />
            Secured by Stripe
          </div>
          <div className="flex space-x-2">
            <CreditCard className="text-blue-600 h-6 w-6" />
            <CreditCard className="text-red-600 h-6 w-6" />
            <CreditCard className="text-orange-600 h-6 w-6" />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="cardName">Name on Card</Label>
            <Input
              id="cardName"
              placeholder="John Doe"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="4242 4242 4242 4242"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              maxLength={19}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiryDate">Expiry Date (MM/YY)</Label>
              <Input
                id="expiryDate"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                maxLength={5}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="cvv">Security Code</Label>
              <Input
                id="cvv"
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ""))}
                maxLength={4}
                required
              />
            </div>
          </div>
          
          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full bg-alma-gold hover:bg-alma-gold/90 text-white"
              size="lg"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Continue to Review"}
              {!isProcessing && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
            
            <Button 
              type="button" 
              variant="ghost" 
              className="w-full mt-2"
              onClick={onBack}
              disabled={isProcessing}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shipping
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
