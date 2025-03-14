
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

export interface AdminLoginFormProps {
  onLoginSuccess?: () => void;
}

const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Invalid input",
        description: "Please enter both username and password",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // For demo purposes, we'll accept any login
    // In a real app, you would validate credentials against an API
    setTimeout(() => {
      setIsLoading(false);
      
      // Always succeed in this demo
      toast({
        title: "Login successful",
        description: "Welcome to the admin dashboard",
      });
      
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          placeholder="admin"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login to Admin Panel"}
      </Button>
    </form>
  );
};

export default AdminLoginForm;
