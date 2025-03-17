
import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, isLoading: authLoading, isAuthenticated, isAdmin, hasRole, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Check if user is already authenticated and redirect accordingly
  useEffect(() => {
    if (!isAuthenticated || authLoading) return;
    
    console.log("User is authenticated, determining redirect location");
    const from = new URLSearchParams(location.search).get('from');
    const userIsAdmin = isAdmin();
    const userIsSeller = hasRole('seller');
      
    console.log("Auth check results:", { from, isAdmin: userIsAdmin, isSeller: userIsSeller, email, user });
      
    // If user was trying to access a specific page, redirect back there
    if (from) {
      console.log("Redirecting to requested page:", from);
      navigate(decodeURIComponent(from));
    } 
    // If user is a seller, redirect to seller dashboard as default
    else if (userIsSeller) {
      console.log("Seller user detected, redirecting to seller dashboard");
      navigate('/seller-dashboard');
    }
    // If user is an admin, always redirect to admin dashboard as default
    else if (userIsAdmin) {
      console.log("Admin user detected, redirecting to admin dashboard");
      navigate('/admin-dashboard');
    } 
    // Default redirect for regular users
    else {
      console.log("Regular user detected, redirecting to home");
      navigate('/');
    }
  }, [isAuthenticated, authLoading, navigate, location, isAdmin, hasRole, email, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log("Attempting login with:", email);
      
      const result = await login(email, password);
      console.log("Login result:", result);
      
      // Show success message
      toast({
        title: "Login successful",
        description: isAdmin() 
          ? "Welcome to the admin panel" 
          : hasRole('seller') 
            ? "Welcome to your seller dashboard" 
            : "Welcome back!",
      });
      
      // Don't manually navigate here - let the useEffect handle redirection
      // based on user roles for consistency
      
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-app-black p-4">
      <div className="w-full max-w-md p-6 glass-panel animate-scale-in">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2 neon-text">SWIPETOPIA</h1>
          <p className="text-gray-400">Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm text-gray-300">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-app-gray-dark border-app-gray-light text-white"
              disabled={isLoading || authLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm text-gray-300">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-app-gray-dark border-app-gray-light text-white"
              disabled={isLoading || authLoading}
            />
          </div>

          <Button 
            type="submit" 
            disabled={isLoading || authLoading}
            className="w-full bg-app-yellow text-app-black hover:bg-app-yellow-hover transition-all duration-300"
          >
            {isLoading || authLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Don't have an account?{" "}
            <Link to="/signup" className="text-app-yellow hover:underline">
              Sign up
            </Link>
          </p>
          <div className="mt-4 text-sm text-gray-500">
            <p className="font-semibold text-app-yellow mb-1">Test Accounts:</p>
            <p>Owner: admin@flytick.net / 123456</p>
            <p>Admin: admin@example.com / any password</p>
            <p>Seller: seller@example.com / seller123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
