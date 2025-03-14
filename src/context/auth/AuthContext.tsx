
import { createContext, useContext } from "react";
import { AuthContextType, AuthProviderProps } from "./types";
import { useAuthState } from "./useAuthState";
import { useAuthActions } from "./authActions";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { user, setUser } = useAuthState();
  const { login, signup, logout } = useAuthActions(setUser);
  
  console.log("AuthProvider rendering, authenticated:", !!user);

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
