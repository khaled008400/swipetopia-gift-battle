
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
  coins: number;
  role?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
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
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  
  useEffect(() => {
    // Check active session
    const getSession = async () => {
      setIsLoading(true);
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error retrieving session:", error);
        setIsLoading(false);
        return;
      }
      
      if (session) {
        setSession(session);
        await fetchUserProfile(session.user);
      } else {
        setUser(null);
      }
      
      setIsLoading(false);
    };
    
    getSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      setSession(session);
      
      if (session && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
        await fetchUserProfile(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });
    
    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const fetchUserProfile = async (authUser: User) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();
      
      if (error) {
        console.error("Error fetching user profile:", error);
        return;
      }
      
      if (data) {
        setUser({
          id: data.id,
          username: data.username,
          email: authUser.email || '',
          avatar_url: data.avatar_url,
          coins: data.coins || 0,
          role: authUser.user_metadata?.role
        });
      }
    } catch (error) {
      console.error("Unexpected error fetching profile:", error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
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
      // First, check if username is already taken
      const { data: existingUsers, error: checkError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .limit(1);
      
      if (checkError) throw checkError;
      
      if (existingUsers && existingUsers.length > 0) {
        throw new Error("Username is already taken");
      }
      
      // Register the user if username is available
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            role: 'viewer' // Default role
          }
        }
      });
      
      if (error) throw error;
      
      // Create the user profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            username: username,
            avatar_url: `https://i.pravatar.cc/150?u=${username}` // Placeholder avatar
          });
        
        if (profileError) {
          console.error("Error creating profile:", profileError);
          toast({
            title: "Profile creation failed",
            description: "Your account was created but we couldn't set up your profile. Please contact support.",
            variant: "destructive",
          });
        }
      }
      
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
      await supabase.auth.signOut();
      
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

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
