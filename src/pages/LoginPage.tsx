
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import NetworkStatusAlert from "@/components/auth/NetworkStatusAlert";
import LoginForm from "@/components/auth/LoginForm";
import DevelopmentInfo from "@/components/auth/DevelopmentInfo";

const LoginPage = () => {
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

  const handleLogin = async (email: string, password: string) => {
    console.log("Form submitted with:", { email, password });

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

        <NetworkStatusAlert 
          isOnline={isOnline} 
          isConnectedToApi={isConnectedToApi} 
        />

        <LoginForm 
          onSubmit={handleLogin}
          isLoading={isLoading}
          isOnline={isOnline}
        />
        
        <DevelopmentInfo />
      </div>
    </div>
  );
};

export default LoginPage;
