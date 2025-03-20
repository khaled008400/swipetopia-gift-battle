
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export interface AdminLoginFormProps {
  onLoginSuccess?: () => void;
}

const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

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
      console.log("AdminLoginForm: Attempting login with:", email);
      
      // Sign out any existing session first to prevent conflicts
      await supabase.auth.signOut();
      
      // Attempt login with a delay to ensure signOut completes
      setTimeout(async () => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (error) {
            console.error("AdminLoginForm: Login error:", error);
            toast({
              title: "Login failed",
              description: error.message || "Invalid credentials",
              variant: "destructive",
            });
            setIsLoading(false);
          } else if (data.user) {
            console.log("AdminLoginForm: Login successful for:", data.user.id);
            toast({
              title: "Login successful",
              description: "Welcome back!",
            });
            
            // Allow a moment for auth state to update
            setTimeout(() => {
              if (onLoginSuccess) {
                onLoginSuccess();
              } else {
                navigate('/videos');
              }
              setIsLoading(false);
            }, 500);
          }
        } catch (innerErr: any) {
          console.error("AdminLoginForm: Login submission error:", innerErr);
          toast({
            title: "Login error",
            description: innerErr.message || "An unexpected error occurred",
            variant: "destructive",
          });
          setIsLoading(false);
        }
      }, 100);
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
