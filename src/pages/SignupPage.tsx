
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ShoppingBag, Video, Mail, Phone, ArrowRight } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { UserRole } from "@/types/auth.types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
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

  const handleSocialSignup = async (provider: string) => {
    setIsLoading(true);
    try {
      // Currently the social signup flow would be implemented here
      // For now, we'll just show a toast message
      toast({
        title: "Coming Soon",
        description: `Sign up with ${provider} will be available soon!`,
      });
    } catch (error: any) {
      console.error(`${provider} signup error:`, error);
      toast({
        title: "Error",
        description: error.message || `Failed to sign up with ${provider}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (authMethod === "email") {
      if (!username || !email || !password || !confirmPassword) {
        toast({
          title: "Error",
          description: "Please fill all fields",
          variant: "destructive",
        });
        return;
      }
    } else {
      if (!username || !phone || !password || !confirmPassword) {
        toast({
          title: "Error",
          description: "Please fill all fields",
          variant: "destructive",
        });
        return;
      }
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
      if (authMethod === "email") {
        await signup(email, username, password, selectedRoles);
      } else {
        // Phone signup would be implemented here
        // For now, we'll just show a toast message
        toast({
          title: "Coming Soon",
          description: "Phone signup will be available soon!",
        });
        return;
      }
      
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

        <Tabs defaultValue="email" className="w-full mb-6" onValueChange={(value) => setAuthMethod(value as "email" | "phone")}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="email">
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

              {/* Role Selection */}
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
                  <>
                    Sign Up <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="phone">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username-phone" className="text-sm text-gray-300">
                  Username
                </label>
                <Input
                  id="username-phone"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-app-gray-dark border-app-gray-light text-white"
                  disabled={isLoading || authLoading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm text-gray-300">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-app-gray-dark border-app-gray-light text-white"
                  disabled={isLoading || authLoading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password-phone" className="text-sm text-gray-300">
                  Password
                </label>
                <Input
                  id="password-phone"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-app-gray-dark border-app-gray-light text-white"
                  disabled={isLoading || authLoading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword-phone" className="text-sm text-gray-300">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword-phone"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-app-gray-dark border-app-gray-light text-white"
                  disabled={isLoading || authLoading}
                />
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <label className="text-sm text-gray-300 block mb-2">
                  I am a: (select all that apply)
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-3 rounded-md bg-app-gray-dark border border-app-gray-light hover:bg-app-gray transition-colors">
                    <input
                      type="checkbox"
                      id="role-seller-phone"
                      checked={selectedRoles.includes("seller")}
                      onChange={() => handleRoleChange("seller")}
                      className="h-4 w-4"
                    />
                    <ShoppingBag className="h-5 w-5 text-app-yellow" />
                    <label htmlFor="role-seller-phone" className="flex-1 cursor-pointer">
                      Seller - I want to sell products
                    </label>
                  </div>
                  
                  <div className="flex items-center gap-2 p-3 rounded-md bg-app-gray-dark border border-app-gray-light hover:bg-app-gray transition-colors">
                    <input
                      type="checkbox"
                      id="role-streamer-phone"
                      checked={selectedRoles.includes("streamer")}
                      onChange={() => handleRoleChange("streamer")}
                      className="h-4 w-4"
                    />
                    <Video className="h-5 w-5 text-purple-500" />
                    <label htmlFor="role-streamer-phone" className="flex-1 cursor-pointer">
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
                  <>
                    Sign Up <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="relative flex items-center justify-center my-6">
          <Separator className="absolute w-full" />
          <span className="relative px-2 bg-app-gray-dark text-gray-400 text-sm">OR</span>
        </div>

        <div className="space-y-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSocialSignup('Google')}
            disabled={isLoading || authLoading}
            className="w-full flex items-center justify-center text-white"
          >
            <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" className="w-5 h-5 mr-2" alt="Google" />
            Sign up with Google
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSocialSignup('Apple')}
            disabled={isLoading || authLoading}
            className="w-full flex items-center justify-center text-white"
          >
            <img src="https://cdn-icons-png.flaticon.com/512/0/747.png" className="w-5 h-5 mr-2" alt="Apple" />
            Sign up with Apple
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSocialSignup('Facebook')}
            disabled={isLoading || authLoading}
            className="w-full flex items-center justify-center text-white"
          >
            <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" className="w-5 h-5 mr-2" alt="Facebook" />
            Sign up with Facebook
          </Button>
        </div>

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
