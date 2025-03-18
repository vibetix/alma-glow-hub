import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 100 ? 0 : 5.99;
  const total = subtotal + tax + shipping - discount;

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (id: string) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart",
    });
  };

  const applyPromoCode = () => {
    setLoading(true);
    
    setTimeout(() => {
      if (promoCode.toUpperCase() === "WELCOME20") {
        setDiscount(subtotal * 0.2);
        toast({
          title: "Promo code applied",
          description: "You received 20% off your order!",
        });
      } else {
        toast({
          title: "Invalid promo code",
          description: "Please check your code and try again",
          variant: "destructive",
        });
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      <Navbar />
      <PageTransition>
        <section className="py-32">
          <div className="container-custom">
            <h1 className="heading-2 mb-8">Your Shopping Cart</h1>
            
            {cartItems.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                  <div className="space-y-6">
                    {cartItems.map((item) => (
                      <motion.div 
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg"
                      >
                        <div className="w-full sm:w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        
                        <div className="flex-grow">
                          <div className="flex flex-col sm:flex-row sm:justify-between">
                            <h3 className="font-medium text-lg">{item.name}</h3>
                            <p className="font-medium text-alma-gold">${item.price.toFixed(2)}</p>
                          </div>
                          
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center border rounded-md">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus size={16} />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus size={16} />
                              </Button>
                            </div>
                            
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 size={16} className="mr-1" /> Remove
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="mt-8 flex justify-between items-center">
                    <Link to="/shop">
                      <Button variant="outline" className="text-alma-darkGreen border-alma-darkGreen">
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>
                </div>
                
                <div className="lg:col-span-1">
                  <div className="bg-alma-lightgray p-6 rounded-lg space-y-6">
                    <h2 className="text-xl font-medium font-serif">Order Summary</h2>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                      </div>
                      
                      {discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount</span>
                          <span>-${discount.toFixed(2)}</span>
                        </div>
                      )}
                      
                      <div className="pt-3 border-t flex justify-between font-medium text-lg">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="pt-4 space-y-3">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Promo code"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                        />
                        <Button 
                          onClick={applyPromoCode} 
                          disabled={loading || !promoCode}
                          className="bg-alma-darkGreen text-white hover:bg-alma-darkGreen/90"
                        >
                          Apply
                        </Button>
                      </div>
                      
                      <p className="text-xs text-muted-foreground">
                        Try code: WELCOME20 for 20% off
                      </p>
                    </div>
                    
                    <Link to="/checkout">
                      <Button 
                        className="w-full bg-alma-gold hover:bg-alma-gold/90 text-white" 
                        size="lg"
                      >
                        Proceed to Checkout
                      </Button>
                    </Link>
                    
                    <div className="text-sm text-center text-gray-500">
                      <p>Secure checkout powered by Stripe</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="inline-flex justify-center items-center w-20 h-20 bg-alma-lightgray rounded-full mb-6">
                  <ShoppingBag size={32} className="text-alma-gold" />
                </div>
                <h2 className="text-2xl font-medium mb-4">Your cart is empty</h2>
                <p className="text-gray-600 mb-8">
                  Looks like you haven't added any products to your cart yet.
                </p>
                <Link to="/shop">
                  <Button className="bg-alma-gold hover:bg-alma-gold/90 text-white">
                    Browse Products
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>
      </PageTransition>
      <Footer />
    </>
  );
};

export default Cart;
