
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CreditCard, Truck, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary";
import { ShippingForm } from "@/components/checkout/ShippingForm";
import { PaymentForm } from "@/components/checkout/PaymentForm";
import { OrderConfirmation } from "@/components/checkout/OrderConfirmation";
import { useAuth } from "@/contexts/AuthContext";

type CheckoutStep = "shipping" | "payment" | "review" | "confirmation";

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping");
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [shippingData, setShippingData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    phone: ""
  });
  
  // Get cart items from localStorage
  const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
  
  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 100 ? 0 : 5.99;
  const total = subtotal + tax + shipping;
  
  const handleShippingSubmit = (data) => {
    setShippingData(data);
    setCurrentStep("payment");
    window.scrollTo(0, 0);
  };
  
  const handlePaymentSubmit = () => {
    setCurrentStep("review");
    window.scrollTo(0, 0);
  };
  
  const handlePlaceOrder = () => {
    // This would typically include sending the order to a backend
    // For now, we'll simulate a server response
    
    // Show loading state
    toast({
      title: "Processing your order...",
      description: "Please wait while we confirm your payment.",
    });
    
    // Simulate API call
    setTimeout(() => {
      // Generate a random order number
      const generatedOrderNumber = "ORD-" + Math.floor(100000 + Math.random() * 900000);
      setOrderNumber(generatedOrderNumber);
      
      // Clear cart from localStorage
      localStorage.setItem('cart', JSON.stringify([]));
      
      // Show success toast
      toast({
        title: "Order placed successfully!",
        description: `Your order number is ${generatedOrderNumber}`,
      });
      
      // Move to confirmation step
      setCurrentStep("confirmation");
      window.scrollTo(0, 0);
    }, 2000);
  };
  
  // If cart is empty, redirect to cart page
  if (cartItems.length === 0 && currentStep !== "confirmation") {
    return (
      <>
        <Navbar />
        <PageTransition>
          <div className="container-custom py-32 text-center">
            <h2 className="heading-2 mb-6">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">
              You need to add some items to your cart before proceeding to checkout.
            </p>
            <Link to="/cart">
              <Button className="bg-alma-gold hover:bg-alma-gold/90 text-white">
                Return to Cart
              </Button>
            </Link>
          </div>
        </PageTransition>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <PageTransition>
        <div className="container-custom py-32">
          <div className="max-w-6xl mx-auto">
            {/* Checkout Steps */}
            {currentStep !== "confirmation" && (
              <div className="mb-10">
                <div className="flex justify-between items-center mb-6">
                  <Link to="/cart" className="text-gray-600 hover:text-alma-gold flex items-center">
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Cart
                  </Link>
                  
                  <h1 className="heading-2 text-center">Checkout</h1>
                  
                  <div className="w-24"></div> {/* Spacer for alignment */}
                </div>
                
                <div className="flex justify-between mb-8">
                  <div className="flex flex-col items-center w-1/3">
                    <div className={`rounded-full w-10 h-10 flex items-center justify-center mb-2 ${currentStep === "shipping" ? "bg-alma-gold text-white" : "bg-alma-lightgray text-gray-600"}`}>
                      <Truck size={20} />
                    </div>
                    <span className={currentStep === "shipping" ? "font-medium" : "text-gray-500"}>Shipping</span>
                  </div>
                  <div className="flex flex-col items-center w-1/3">
                    <div className={`rounded-full w-10 h-10 flex items-center justify-center mb-2 ${currentStep === "payment" ? "bg-alma-gold text-white" : "bg-alma-lightgray text-gray-500"}`}>
                      <CreditCard size={20} />
                    </div>
                    <span className={currentStep === "payment" ? "font-medium" : "text-gray-500"}>Payment</span>
                  </div>
                  <div className="flex flex-col items-center w-1/3">
                    <div className={`rounded-full w-10 h-10 flex items-center justify-center mb-2 ${currentStep === "review" ? "bg-alma-gold text-white" : "bg-alma-lightgray text-gray-500"}`}>
                      <CheckCircle size={20} />
                    </div>
                    <span className={currentStep === "review" ? "font-medium" : "text-gray-500"}>Review</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Checkout Form Area */}
              <div className="lg:col-span-2">
                {currentStep === "shipping" && (
                  <ShippingForm 
                    initialData={shippingData} 
                    onSubmit={handleShippingSubmit} 
                  />
                )}
                
                {currentStep === "payment" && (
                  <PaymentForm 
                    onSubmit={handlePaymentSubmit} 
                    onBack={() => setCurrentStep("shipping")} 
                  />
                )}
                
                {currentStep === "review" && (
                  <div className="bg-white rounded-lg p-6 shadow-sm border">
                    <h2 className="text-xl font-medium mb-6">Review Your Order</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium text-gray-700 mb-2">Shipping Details</h3>
                        <div className="bg-gray-50 p-4 rounded">
                          <p>{shippingData.fullName}</p>
                          <p>{shippingData.address}</p>
                          <p>{shippingData.city}, {shippingData.state} {shippingData.zipCode}</p>
                          <p>{shippingData.country}</p>
                          <p>{shippingData.phone}</p>
                          <p>{shippingData.email}</p>
                        </div>
                        <Button 
                          variant="link" 
                          className="text-alma-gold p-0 h-auto mt-2"
                          onClick={() => setCurrentStep("shipping")}
                        >
                          Edit
                        </Button>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-gray-700 mb-2">Payment Method</h3>
                        <div className="bg-gray-50 p-4 rounded">
                          <p className="flex items-center">
                            <CreditCard size={16} className="mr-2 text-gray-500" />
                            Credit Card ending in 1234
                          </p>
                        </div>
                        <Button 
                          variant="link" 
                          className="text-alma-gold p-0 h-auto mt-2"
                          onClick={() => setCurrentStep("payment")}
                        >
                          Edit
                        </Button>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <Button 
                          className="w-full bg-alma-gold hover:bg-alma-gold/90 text-white"
                          size="lg"
                          onClick={handlePlaceOrder}
                        >
                          Place Order
                        </Button>
                        <p className="text-center text-sm text-gray-500 mt-4">
                          By placing your order, you agree to our Terms of Service and Privacy Policy.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {currentStep === "confirmation" && (
                  <OrderConfirmation 
                    orderNumber={orderNumber} 
                    shippingDetails={shippingData}
                  />
                )}
              </div>
              
              {/* Order Summary */}
              <div className="lg:col-span-1">
                {currentStep !== "confirmation" ? (
                  <CheckoutSummary 
                    cartItems={cartItems}
                    subtotal={subtotal}
                    tax={tax}
                    shipping={shipping}
                    total={total}
                  />
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Thank you for your order!</h3>
                    <p className="text-gray-600 mb-4">
                      We've sent a confirmation email to {shippingData.email}
                    </p>
                    <Button 
                      className="bg-alma-gold hover:bg-alma-gold/90 text-white"
                      onClick={() => navigate('/shop')}
                    >
                      Continue Shopping
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
      <Footer />
    </>
  );
};

export default Checkout;
