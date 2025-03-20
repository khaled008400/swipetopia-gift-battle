
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Bell,
  ChevronLeft,
  Moon,
  Lock,
  HelpCircle,
  FileText,
  Languages,
  Smartphone,
  LogOut,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  const [notificationSettings, setNotificationSettings] = useState({
    likes: true,
    comments: true,
    followers: true,
    mentions: true,
    videos: true
  });
  
  const [darkMode, setDarkMode] = useState(true);
  
  // Check authentication status and redirect if not logged in
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log("User not authenticated, redirecting to login from settings page");
      setIsRedirecting(true);
      
      // Add a small delay to avoid potential race conditions
      const redirectTimer = setTimeout(() => {
        navigate('/login');
      }, 100);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out."
      });
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "There was a problem signing out. Please try again."
      });
    }
  };
  
  const handleToggleNotification = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    
    toast({
      title: "Settings updated",
      description: "Your notification preferences have been saved"
    });
  };
  
  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real implementation, this would update a theme context
    toast({
      title: "Display mode updated",
      description: `${!darkMode ? "Dark" : "Light"} mode activated`
    });
  };
  
  // Show loading state if authentication check is in progress
  if (isLoading || isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-app-black">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-app-yellow" />
          <p className="text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }
  
  // Only render settings page if authenticated
  return (
    <div className="min-h-[calc(100vh-64px)] bg-app-black p-4">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="mr-2"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold">Settings</h1>
      </div>
      
      <div className="space-y-6">
        {/* Notification Settings */}
        <div className="bg-app-gray-dark rounded-lg p-4">
          <h2 className="text-lg font-medium mb-4 flex items-center">
            <Bell className="mr-2 h-5 w-5 text-app-yellow" />
            Notification Settings
          </h2>
          
          <div className="space-y-4">
            {Object.entries(notificationSettings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <Label htmlFor={`notification-${key}`} className="capitalize">
                  {key}
                </Label>
                <Switch
                  id={`notification-${key}`}
                  checked={value}
                  onCheckedChange={() => handleToggleNotification(key as keyof typeof notificationSettings)}
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Display Settings */}
        <div className="bg-app-gray-dark rounded-lg p-4">
          <h2 className="text-lg font-medium mb-4 flex items-center">
            <Moon className="mr-2 h-5 w-5 text-app-yellow" />
            Display Settings
          </h2>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="dark-mode">Dark Mode</Label>
            <Switch
              id="dark-mode"
              checked={darkMode}
              onCheckedChange={handleToggleDarkMode}
            />
          </div>
        </div>
        
        {/* Account Settings */}
        <div className="bg-app-gray-dark rounded-lg p-4">
          <h2 className="text-lg font-medium mb-4 flex items-center">
            <Lock className="mr-2 h-5 w-5 text-app-yellow" />
            Account & Privacy
          </h2>
          
          <div className="space-y-3">
            <Button 
              variant="ghost" 
              className="w-full justify-between text-left font-normal" 
              onClick={() => navigate('/privacy')}
            >
              <span>Privacy Settings</span>
              <ChevronLeft className="h-4 w-4 rotate-180" />
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-between text-left font-normal"
              onClick={() => navigate('/password')}
            >
              <span>Change Password</span>
              <ChevronLeft className="h-4 w-4 rotate-180" />
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-between text-left font-normal"
            >
              <span>Connected Accounts</span>
              <ChevronLeft className="h-4 w-4 rotate-180" />
            </Button>
          </div>
        </div>
        
        {/* Support & About */}
        <div className="bg-app-gray-dark rounded-lg p-4">
          <h2 className="text-lg font-medium mb-4 flex items-center">
            <HelpCircle className="mr-2 h-5 w-5 text-app-yellow" />
            Support & About
          </h2>
          
          <div className="space-y-3">
            <Button 
              variant="ghost" 
              className="w-full justify-between text-left font-normal"
            >
              <span>Help Center</span>
              <ChevronLeft className="h-4 w-4 rotate-180" />
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-between text-left font-normal"
            >
              <span>Terms of Service</span>
              <ChevronLeft className="h-4 w-4 rotate-180" />
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-between text-left font-normal"
            >
              <span>Privacy Policy</span>
              <ChevronLeft className="h-4 w-4 rotate-180" />
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-between text-left font-normal"
            >
              <span>App Version 1.0.0</span>
            </Button>
          </div>
        </div>
        
        {/* Logout Button */}
        <Button 
          variant="destructive" 
          className="w-full mt-6"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
