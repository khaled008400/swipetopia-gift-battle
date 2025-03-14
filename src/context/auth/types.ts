
import { AppUser } from "@/services/auth.service";

export interface AuthContextType {
  user: AppUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}
