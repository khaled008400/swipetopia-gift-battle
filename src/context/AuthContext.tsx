
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Session } from "@supabase/supabase-js";
import { AuthContextType, UserProfile } from "@/types/auth.types";
import { fetchUserProfile } from "@/hooks/useUserProfile";
import { 
  loginUser, 
  signupUser, 
  logoutUser, 
  getSession, 
  setupAuthListener 
} from "@/services/auth.functions";

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
    // Check active session
    const initializeAuth = async () => {
      setIsLoading(true);
      
      try {
        const currentSession = await getSession();
        
        if (currentSession) {
          setSession(currentSession);
          const profile = await fetchUserProfile(currentSession.user);
          if (profile) {
            setUser(profile);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error retrieving session:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAuth();
    
    // Set up auth state change listener
    const subscription = setupAuthListener(async (event, session) => {
      console.log("Auth state changed:", event);
      setSession(session);
      
      if (session && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
        const profile = await fetchUserProfile(session.user);
        if (profile) {
          setUser(profile);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });
    
    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const data = await loginUser(email, password);
      
      toast({
        title: "Login successful",
        description: `Welcome back${data.user?.user_metadata?.username ? ', ' + data.user.user_metadata.username : ''}!`,
      });
      
      // No need to set user here, will be handled by auth state change
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error.message || "Failed to login",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, username: string, password: string) => {
    try {
      setIsLoading(true);
      await signupUser(email, username, password);
      
      toast({
        title: "Account created",
        description: `Welcome, ${username}!`,
      });
      
      // No need to set user here, will be handled by auth state change
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Signup failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await logoutUser();
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: error.message || "Failed to log out",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = () => {
    if (!user) return false;
    return user.role === 'admin';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
