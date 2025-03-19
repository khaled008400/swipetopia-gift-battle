
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AtSign, User } from "lucide-react";

/**
 * Hook to handle authentication checks and prompt login when needed
 */
export const useAuthCheck = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [returnPath, setReturnPath] = useState("");
  const [actionType, setActionType] = useState("");

  const checkAuth = (callback?: () => void, redirectPath?: string, action?: string) => {
    if (isAuthenticated) {
      if (callback) callback();
      return true;
    }
    
    // Store current path to return after login
    const currentPath = redirectPath || window.location.pathname;
    setReturnPath(currentPath);
    if (action) setActionType(action);
    
    // Show auth dialog instead of redirecting
    setShowAuthDialog(true);
    return false;
  };

  const closeAuthDialog = () => {
    setShowAuthDialog(false);
  };

  const handleLogin = () => {
    closeAuthDialog();
    if (returnPath) {
      navigate(`/login?from=${returnPath}${actionType ? `&action=${actionType}` : ''}`);
    } else {
      navigate('/login');
    }
  };

  const handleSignup = () => {
    closeAuthDialog();
    navigate('/signup');
  };

  const requiresAuth = (callback: () => void, redirectPath?: string, action?: string) => {
    return checkAuth(callback, redirectPath, action);
  };

  const AuthDialog = () => (
    <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sign in required</DialogTitle>
          <DialogDescription>
            You need to be signed in to access this feature
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p className="text-sm text-gray-500">
            Please sign in or create an account to continue
          </p>
          <div className="flex flex-col space-y-3 mt-4">
            <Button onClick={handleLogin} className="w-full">
              <AtSign className="mr-2 h-4 w-4" />
              Sign In
            </Button>
            <Button onClick={handleSignup} variant="outline" className="w-full">
              <User className="mr-2 h-4 w-4" />
              Create Account
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return {
    requiresAuth,
    isAuthenticated,
    AuthDialog,
    showAuthDialog,
    closeAuthDialog
  };
};
