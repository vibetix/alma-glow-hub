
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { User, Lock, Mail, EyeOff, Eye } from "lucide-react";
import { motion } from "framer-motion";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    agreeTerms: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, agreeTerms: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeTerms) {
      toast({
        title: "Terms required",
        description: "Please agree to the terms and conditions",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);

    // Simulate signup process
    setTimeout(() => {
      setLoading(false);
      
      // Demo signup - in a real app, this would create an account in the backend
      if (formData.fullName && formData.email && formData.password) {
        toast({
          title: "Account created",
          description: "Welcome to Alma Beauty!",
        });
        navigate("/");
      } else {
        toast({
          title: "Signup failed",
          description: "Please check your information and try again",
          variant: "destructive",
        });
      }
    }, 1500);
  };

  return (
    <>
      <Navbar />
      <PageTransition>
        <section className="py-32 bg-alma-lightgray min-h-screen flex items-center">
          <div className="container-custom">
            <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
              <div className="text-center mb-8">
                <h1 className="heading-3 mb-2">Create Your Account</h1>
                <p className="text-gray-600">
                  Join Alma Beauty and discover premium beauty services
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder="Your name"
                      className="pl-10"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      className="pl-10"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Password must be at least 8 characters
                  </p>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="agreeTerms" 
                    checked={formData.agreeTerms} 
                    onCheckedChange={handleCheckboxChange}
                    className="mt-1"
                  />
                  <Label 
                    htmlFor="agreeTerms" 
                    className="text-sm font-normal cursor-pointer"
                  >
                    I agree to the{" "}
                    <Link to="/terms" className="text-alma-gold hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-alma-gold hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-alma-gold hover:bg-alma-gold/90 text-white"
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link to="/login" className="text-alma-gold hover:underline font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </PageTransition>
      <Footer />
    </>
  );
};

export default Signup;
