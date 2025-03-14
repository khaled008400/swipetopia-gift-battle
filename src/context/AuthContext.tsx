
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
        console.log("AuthContext: Current session:", currentSession);
        
        if (currentSession) {
          setSession(currentSession);
          try {
            const profile = await fetchUserProfile(currentSession.user);
            if (profile) {
              console.log("AuthContext: User profile loaded:", profile);
              setUser(profile);
            }
          } catch (profileError) {
            console.error("AuthContext: Error fetching profile:", profileError);
            // Continue even if profile fetch fails
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("AuthContext: Error retrieving session:", error);
        setUser(null);
      } finally {
        // Always set loading to false, even if there are errors
        setIsLoading(false);
      }
    };
    
    initializeAuth();
    
    // Set up auth state change listener
    const subscription = setupAuthListener(async (event, session) => {
      console.log("AuthContext: Auth state changed:", event, session);
      setSession(session);
      
      if (session && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
        try {
          const profile = await fetchUserProfile(session.user);
          if (profile) {
            console.log("AuthContext: Profile from auth listener:", profile);
            setUser(profile);
          }
        } catch (error) {
          console.error("AuthContext: Error fetching profile after auth state change:", error);
          // Continue even if profile fetch fails
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const data = await loginUser(email, password);
      
      if (!data.user) {
        throw new Error("Login failed - user data not returned");
      }
      
      // Set session immediately
      if (data.session) {
        setSession(data.session);
      }
      
      try {
        // Get profile data
        const profile = await fetchUserProfile(data.user);
        if (profile) {
          console.log("AuthContext: Profile after login:", profile);
          setUser(profile);
        }
      } catch (profileError) {
        console.error("AuthContext: Error fetching profile after login:", profileError);
      }
      
      toast({
        title: "Login successful",
        description: `Welcome back!`,
      });
      
      return data;
    } catch (error: any) {
      console.error("AuthContext: Login error:", error);
      toast({
        title: "Login failed",
        description: error.message || "Failed to login",
        variant: "destructive",
      });
      throw error;
    } finally {
      // Always ensure loading state is reset
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
    } catch (error: any) {
      console.error("AuthContext: Signup error:", error);
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
      
      // Clean up local state
      setUser(null);
      setSession(null);
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error: any) {
      console.error("AuthContext: Logout error:", error);
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
    console.log("AuthContext: Checking isAdmin. User:", user);
    if (!user) return false;
    console.log("AuthContext: User role:", user.role);
    return user?.role === 'admin';
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
