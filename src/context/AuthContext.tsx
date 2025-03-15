
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Session } from "@supabase/supabase-js";
import { AuthContextType, UserProfile, UserRole } from "@/types/auth.types";
import { loginUser, logoutUser, signupUser, getSession, setupAuthListener } from "@/services/auth.functions";
import { fetchUserProfile } from "@/hooks/useUserProfile";
import { supabase } from "@/integrations/supabase/client";

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
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  
  useEffect(() => {
    // Function to handle session changes
    const handleSessionChange = async (event: string, newSession: Session | null) => {
      setSession(newSession);
      
      if (newSession?.user) {
        try {
          const userProfile = await fetchUserProfile(newSession.user);
          setUser(userProfile);
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      
      setIsLoading(false);
    };
    
    // Initial session check
    const checkSession = async () => {
      try {
        const currentSession = await getSession();
        await handleSessionChange('INITIAL_SESSION', currentSession);
      } catch (error) {
        console.error("Error checking session:", error);
        setIsLoading(false);
      }
    };
    
    // Set up auth listener
    const { data: authListener } = setupAuthListener(handleSessionChange);
    
    // Check for existing session
    checkSession();
    
    // Cleanup
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { session: newSession } = await loginUser(email, password);
      
      if (newSession?.user) {
        toast({
          title: "Login successful",
          description: "Welcome back!"
        });
      }
      
      return newSession;
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, username: string, password: string, roles: UserRole[] = ["user"]) => {
    setIsLoading(true);
    try {
      await signupUser(email, username, password, roles);
      
      toast({
        title: "Account created",
        description: "Your account has been created successfully."
      });
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Signup failed",
        description: error.message || "There was an error creating your account.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutUser();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: error.message || "There was an error logging out.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = () => {
    return user?.roles.includes("admin") || false;
  };

  const hasRole = (role: UserRole) => {
    return user?.roles.includes(role) || false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!session,
        isLoading,
        login,
        signup,
        logout,
        isAdmin,
        hasRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
