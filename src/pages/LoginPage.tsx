
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, AlertCircle, WifiOff } from "lucide-react";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, user } = useAuth();
  const { isOnline, isConnectedToApi, checkApiConnection } = useNetworkStatus();
  const navigate = useNavigate();
  const { toast } = useToast();

  console.log("LoginPage rendered. isAuthenticated:", isAuthenticated, "user:", user?.username);
  console.log("Network status:", { isOnline, isConnectedToApi });

  // Redirect if already authenticated
  useEffect(() => {
    console.log("LoginPage useEffect - checking auth status:", isAuthenticated);
    if (isAuthenticated && user) {
      console.log("User is already authenticated, redirecting to home");
      navigate("/");
    }
  }, [isAuthenticated, navigate, user]);

  // Check API connection on mount
  useEffect(() => {
    if (isOnline) {
      checkApiConnection();
    }
  }, [isOnline, checkApiConnection]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with:", { email, password });
    
    if (!email || !password) {
      console.log("Missing email or password");
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    if (!isOnline) {
      toast({
        title: "No internet connection",
        description: "Cannot log in while offline. Please check your connection.",
        variant: "destructive",
      });
      return;
    }

    // Check API connection again before login attempt
    if (isOnline) {
      const apiReachable = await checkApiConnection();
      if (!apiReachable && !import.meta.env.DEV) {
        toast({
          title: "Server unreachable",
          description: "Cannot reach authentication servers. Please try again later.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsLoading(true);
    try {
      console.log("Attempting login with:", email);
      await login(email, password);
      console.log("Login call completed successfully");
      
      // Don't navigate here - let the useEffect handle it once authentication state updates
    } catch (error: any) {
      console.error("Login error in component:", error);
      // Error toast is handled in AuthContext, but adding a fallback here
      if (error.message && !error.message.includes("Toast is handled")) {
        toast({
          title: "Login failed",
          description: error.message || "An unknown error occurred",
          variant: "destructive",
        });
      }
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

        {!isOnline && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-md flex items-center">
            <WifiOff className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-sm text-red-300">
              You are offline. Please check your internet connection.
            </p>
          </div>
        )}

        {isOnline && !isConnectedToApi && (
          <div className="mb-4 p-3 bg-amber-900/30 border border-amber-800 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 text-amber-400 mr-2" />
            <p className="text-sm text-amber-300">
              Cannot reach our servers. Some features may be unavailable.
              {import.meta.env.DEV && " In development mode, you can still log in with any credentials."}
            </p>
          </div>
        )}

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
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>

          <Button 
            type="submit" 
            disabled={isLoading || (!isOnline && !import.meta.env.DEV)}
            className="w-full bg-app-yellow text-app-black hover:bg-app-yellow-hover transition-all duration-300"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          {import.meta.env.DEV && (
            <div className="mt-2">
              <Button 
                type="button"
                variant="outline"
                onClick={() => {
                  setEmail("demo@example.com");
                  setPassword("password");
                }}
                className="w-full text-app-yellow border-app-yellow hover:bg-app-yellow/10"
              >
                Use Demo Credentials
              </Button>
            </div>
          )}
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Don't have an account?{" "}
            <Link to="/signup" className="text-app-yellow hover:underline">
              Sign up
            </Link>
          </p>
        </div>
        
        {import.meta.env.DEV && (
          <div className="mt-4 p-3 bg-blue-900/30 rounded-md">
            <p className="text-xs text-blue-400">
              Development mode: If the API is unavailable, you can still log in with any credentials.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
