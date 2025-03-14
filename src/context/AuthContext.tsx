
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Session } from "@supabase/supabase-js";
import { AuthContextType, UserProfile, UserRole } from "@/types/auth.types";

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
  // Create a mock user that's always authenticated
  const mockUser: UserProfile = {
    id: "mock-admin-id",
    username: "admin",
    email: "admin@example.com",
    avatar_url: "https://i.pravatar.cc/150?u=admin",
    coins: 1000,
    roles: ["admin", "streamer"],
    bio: "Admin account for development and testing",
    location: "San Francisco, CA",
    followers: 120,
    following: 45,
    interests: ["technology", "design", "gaming"]
  };

  const [user, setUser] = useState<UserProfile | null>(mockUser);
  const [session, setSession] = useState<Session | null>({} as Session);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Simplified auth methods that do nothing
  const login = async (email: string, password: string) => {
    return Promise.resolve();
  };

  const signup = async (email: string, username: string, password: string, roles: UserRole[] = ["user"]) => {
    return Promise.resolve();
  };

  const logout = async () => {
    return Promise.resolve();
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
        isAuthenticated: true, // Always authenticated
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
