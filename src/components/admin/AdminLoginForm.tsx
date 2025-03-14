
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AdminLoginFormProps {
  onLogin: (username: string, password: string) => Promise<void>;
  message?: string;
}

const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ onLogin, message }) => {
  const [username, setUsername] = useState("admin@example.com"); // Pre-fill with admin email
  const [password, setPassword] = useState("Password123!"); // Pre-fill with admin password
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await onLogin(username, password);
      // Note: Login result is handled in the parent component
    } catch (error) {
      console.error("Admin login error:", error);
      toast({
        title: "Admin Access Failed",
        description: "Unable to authenticate for admin access.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2">Admin Access</h1>
          <p className="text-gray-500">Login to access admin dashboard</p>
        </div>

        {message && (
          <Alert className="mb-4">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="admin-username" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="admin-username"
              type="email"
              placeholder="Enter your email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="admin-password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="admin-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full"
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
        </form>
        
        <div className="mt-6 p-3 bg-blue-100 rounded-md">
          <p className="text-xs text-blue-600 font-medium">
            Admin Credentials:
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Email: admin@example.com<br />
            Password: Password123!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginForm;
