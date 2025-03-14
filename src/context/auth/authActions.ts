
import { useToast } from "@/components/ui/use-toast";
import AuthService from "@/services/auth.service";
import { AppUser } from "@/services/auth.service";

export function useAuthActions(setUser: React.Dispatch<React.SetStateAction<AppUser | null>>) {
  const { toast } = useToast();

  const login = async (email: string, password: string): Promise<void> => {
    try {
      console.log("Login function called with email:", email);
      const data = await AuthService.login({ email, password });
      console.log("Login successful, setting user:", data.user.username);
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
      
      console.error("Login error:", message);
      
      toast({
        title: "Login failed",
        description: message,
        variant: "destructive",
      });
      throw new Error(message + " - Toast is handled");
    }
  };

  const signup = async (username: string, email: string, password: string): Promise<void> => {
    try {
      console.log("Signup function called with email:", email);
      const data = await AuthService.register({ 
        username, 
        email, 
        password,
        password_confirmation: password
      });
      console.log("Signup successful, setting user:", data.user.username);
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
      
      console.error("Signup error:", message);
      
      toast({
        title: "Signup failed",
        description: message,
        variant: "destructive",
      });
      throw new Error(message + " - Toast is handled");
    }
  };

  const logout = () => {
    console.log("Logout called");
    AuthService.logout();
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return { login, signup, logout };
}
