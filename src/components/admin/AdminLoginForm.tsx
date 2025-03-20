
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

export interface AdminLoginFormProps {
  onLoginSuccess?: () => void;
}

const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [redirectInProgress, setRedirectInProgress] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Invalid input",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }
    
    if (redirectInProgress || isLoading) {
      console.log("AdminLoginForm: Redirect already in progress or loading, ignoring submission");
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("AdminLoginForm: Login with:", email);
      
      // Use login method from AuthContext
      const { error } = await login(email, password);
      
      if (error) {
        console.error("AdminLoginForm: Login error:", error);
        toast({
          title: "Login failed",
          description: error.message || "Invalid credentials",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      console.log("AdminLoginForm: Login successful");
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      // Prevent multiple redirects
      setRedirectInProgress(true);
      
      // Handle successful login with increased delay to ensure state updates fully processed
      setTimeout(() => {
        console.log("AdminLoginForm: Executing navigation callback");
        if (onLoginSuccess) {
          console.log("AdminLoginForm: Calling onLoginSuccess callback");
          onLoginSuccess();
        } else {
          console.log("AdminLoginForm: Redirecting to /videos");
          navigate('/videos', { replace: true });
        }
      }, 500);
      
    } catch (err: any) {
      console.error("AdminLoginForm: Login submission error:", err);
      toast({
        title: "Login error",
        description: err.message || "An unexpected error occurred",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="admin@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login to Admin Panel"}
      </Button>
    </form>
  );
};

export default AdminLoginForm;
