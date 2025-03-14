
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

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, remember: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate login process
    setTimeout(() => {
      setLoading(false);
      
      // Demo login - in a real app, this would validate with a backend
      if (formData.email && formData.password) {
        toast({
          title: "Login successful",
          description: "Welcome back to Alma Beauty!",
        });
        navigate("/");
      } else {
        toast({
          title: "Login failed",
          description: "Please check your credentials and try again",
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
                <h1 className="heading-3 mb-2">Welcome Back</h1>
                <p className="text-gray-600">
                  Sign in to your Alma Beauty account
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
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
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link to="/forgot-password" className="text-sm text-alma-gold hover:underline">
                      Forgot password?
                    </Link>
                  </div>
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
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember" 
                    checked={formData.remember} 
                    onCheckedChange={handleCheckboxChange}
                  />
                  <Label 
                    htmlFor="remember" 
                    className="text-sm font-normal cursor-pointer"
                  >
                    Remember me
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-alma-gold hover:bg-alma-gold/90 text-white"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-alma-gold hover:underline font-medium">
                    Create an account
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

export default Login;
