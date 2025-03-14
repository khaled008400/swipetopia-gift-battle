
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import AuthService, { AppUser } from "../services/auth.service";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: AppUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
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
  const [user, setUser] = useState<AppUser | null>(null);
  const { toast } = useToast();
  
  // Check if user is logged in on component mount and listen for auth changes
  useEffect(() => {
    const storedUser = AuthService.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Get the user profile when signed in
          try {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
              
            // Update local user state
            const updatedUser: AppUser = {
              id: session.user.id,
              username: profileData?.username || session.user.email?.split('@')[0] || 'user',
              email: session.user.email || '',
              avatar: profileData?.avatar_url || '/placeholder.svg',
              coins: profileData?.coins || 0,
              // Set default values for followers and following since they don't exist in the database
              followers: 0,
              following: 0
            };
            
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
          } catch (error) {
            console.error('Error fetching profile:', error);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem('user');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const data = await AuthService.login({ email, password });
      setUser(data.user);
      toast({
        title: "Login successful",
        description: `Welcome back, ${data.user.username}!`,
      });
    } catch (error: any) {
      let message = "Network error - unable to connect to the server";
      
      if (error.error_description) {
        message = error.error_description;
      } else if (error.message) {
        message = error.message;
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
    } catch (error: any) {
      let message = "Network error - unable to connect to the server";
      
      if (error.error_description) {
        message = error.error_description;
      } else if (error.message) {
        message = error.message;
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
