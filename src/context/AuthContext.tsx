
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import AuthService, { User } from "../services/auth.service";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  
  // Check if user is logged in on component mount
  useEffect(() => {
    const storedUser = AuthService.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const data = await AuthService.login({ username, password });
      setUser(data.user);
      toast({
        title: "Login successful",
        description: `Welcome back, ${data.user.username}!`,
      });
      return data;
    } catch (error: any) {
      let message = "Network error - unable to connect to the server";
      
      if (error.response) {
        message = error.response?.data?.message || 'Failed to login';
      }
      
      toast({
        title: "Login failed",
        description: message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    try {
      const data = await AuthService.register({ 
        username, 
        email, 
        password,
        password_confirmation: password
      });
      setUser(data.user);
      toast({
        title: "Account created",
        description: `Welcome, ${data.user.username}!`,
      });
      return data;
    } catch (error: any) {
      let message = "Network error - unable to connect to the server";
      
      if (error.response) {
        message = error.response?.data?.message || 'Failed to create account';
      }
      
      toast({
        title: "Signup failed",
        description: message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
