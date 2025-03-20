
import React, { useState, useEffect } from 'react';
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
  const { toast } = useToast();
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Monitor authentication state to handle navigation after successful login
  useEffect(() => {
    console.log("AdminLoginForm: Auth state changed", { isAuthenticated, userId: user?.id });
    if (isAuthenticated && user && isLoading) {
      console.log("AdminLoginForm: User authenticated, calling success callback or navigating");
      setIsLoading(false);
      
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        // Default navigation if no callback provided
        navigate('/admin', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, onLoginSuccess, isLoading]);

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
    
    setIsLoading(true);
    
    try {
      console.log("AdminLoginForm: Attempting to login with:", email);
      const { data, error } = await login(email, password);
      
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
      
      console.log("AdminLoginForm: Login successful:", data);
      toast({
        title: "Login successful",
        description: "Welcome to the admin dashboard",
      });
      
      // Note: The effect will handle navigation once auth state is confirmed
      console.log("AdminLoginForm: Waiting for auth state to update...");
      
      // Add a fallback timeout just in case the auth state doesn't update
      setTimeout(() => {
        console.log("AdminLoginForm: Fallback navigation timeout triggered");
        if (isLoading) {
          setIsLoading(false);
          if (onLoginSuccess) {
            onLoginSuccess();
          } else {
            navigate('/admin', { replace: true });
          }
        }
      }, 1000);
      
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
