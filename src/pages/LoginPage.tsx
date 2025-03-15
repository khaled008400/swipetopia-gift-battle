
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
  const { login, isLoading: authLoading, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Check if user is already authenticated and redirect accordingly
  useEffect(() => {
    if (isAuthenticated) {
      const from = new URLSearchParams(location.search).get('from');
      const userIsAdmin = isAdmin();
      
      console.log("User is authenticated", { from, isAdmin: userIsAdmin, email });
      
      if (from && from.startsWith('/admin') && userIsAdmin) {
        console.log("Redirecting to admin page:", from);
        navigate(from);
      } else if (userIsAdmin) {
        console.log("Admin user detected, redirecting to admin dashboard");
        navigate('/admin-dashboard');
      } else {
        console.log("Regular user detected, redirecting to home");
        navigate('/');
      }
    }
  }, [isAuthenticated, isAdmin, navigate, location, email]);

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
      console.log("Attempting login with:", email, "password:", password ? "********" : "empty");
      
      const result = await login(email, password);
      console.log("Login result:", result);
      
      // Check if user is admin
      const userIsAdmin = isAdmin();
      console.log("Is admin?", userIsAdmin);
      
      // Show success message
      toast({
        title: "Login successful",
        description: userIsAdmin ? "Welcome to the admin panel" : "Welcome back!",
      });
      
      // The redirect will be handled by the useEffect above
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
            <p>Admin login: admin@flytick.net / 123456</p>
            <p>Regular admin: admin@example.com / any password</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
