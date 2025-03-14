
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
  isOnline: boolean;
}

const LoginForm = ({ onSubmit, isLoading, isOnline }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

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

    await onSubmit(email, password);
  };

  const fillDemoCredentials = () => {
    setEmail("demo@example.com");
    setPassword("password");
    toast({
      title: "Demo credentials filled",
      description: "Click 'Sign In' to log in with demo account",
      variant: "default",
    });
  };

  return (
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

      <Button 
        type="button"
        variant="outline"
        onClick={fillDemoCredentials}
        className="w-full text-app-yellow border-app-yellow hover:bg-app-yellow/10"
      >
        Use Demo Credentials
      </Button>

      <div className="mt-6 text-center">
        <p className="text-gray-400">
          Don't have an account?{" "}
          <Link to="/signup" className="text-app-yellow hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
