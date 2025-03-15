
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ShoppingBag, Video } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { UserRole } from "@/types/auth.types";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>(["user"]);
  const [isLoading, setIsLoading] = useState(false);
  const { signup, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRoleChange = (role: UserRole) => {
    if (role === "user") return;
    
    setSelectedRoles(prev => {
      if (prev.includes(role)) {
        return prev.filter(r => r !== role);
      }
      return [...prev, role];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !email || !password || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await signup(email, username, password, selectedRoles);
      toast({
        title: "Success",
        description: "Account created successfully! You're now logged in.",
      });
      navigate("/");
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-app-black p-4">
      <div className="w-full max-w-md p-6 glass-panel animate-scale-in">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2 neon-text">SWIPETOPIA</h1>
          <p className="text-gray-400">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm text-gray-300">
              Username
            </label>
            <Input
              id="username"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-app-gray-dark border-app-gray-light text-white"
              disabled={isLoading || authLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm text-gray-300">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-app-gray-dark border-app-gray-light text-white"
              disabled={isLoading || authLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm text-gray-300">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-app-gray-dark border-app-gray-light text-white"
              disabled={isLoading || authLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm text-gray-300">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-app-gray-dark border-app-gray-light text-white"
              disabled={isLoading || authLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-300 block mb-2">
              I am a: (select all that apply)
            </label>
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-3 rounded-md bg-app-gray-dark border border-app-gray-light hover:bg-app-gray transition-colors">
                <input
                  type="checkbox"
                  id="role-seller"
                  checked={selectedRoles.includes("seller")}
                  onChange={() => handleRoleChange("seller")}
                  className="h-4 w-4"
                />
                <ShoppingBag className="h-5 w-5 text-app-yellow" />
                <label htmlFor="role-seller" className="flex-1 cursor-pointer">
                  Seller - I want to sell products
                </label>
              </div>
              
              <div className="flex items-center gap-2 p-3 rounded-md bg-app-gray-dark border border-app-gray-light hover:bg-app-gray transition-colors">
                <input
                  type="checkbox"
                  id="role-streamer"
                  checked={selectedRoles.includes("streamer")}
                  onChange={() => handleRoleChange("streamer")}
                  className="h-4 w-4"
                />
                <Video className="h-5 w-5 text-purple-500" />
                <label htmlFor="role-streamer" className="flex-1 cursor-pointer">
                  Streamer - I want to create live streams
                </label>
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading || authLoading}
            className="w-full bg-app-yellow text-app-black hover:bg-app-yellow-hover transition-all duration-300"
          >
            {isLoading || authLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-app-yellow hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
