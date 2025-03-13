
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface User {
  id: string;
  username: string;
  avatar: string;
  coins: number;
  followers: number;
  following: number;
}

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
  
  // Check if user is logged in on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username: string, password: string) => {
    // In a real app, this would make an API call to verify credentials
    if (username && password) {
      const mockUser: User = {
        id: "1",
        username,
        avatar: "/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png",
        coins: 1000,
        followers: 456,
        following: 123
      };
      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    // In a real app, this would make an API call to create a new user
    if (username && email && password) {
      const mockUser: User = {
        id: "1",
        username,
        avatar: "/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png",
        coins: 500,
        followers: 0,
        following: 0
      };
      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
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
