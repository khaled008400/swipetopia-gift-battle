
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function useAuthCheck() {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<() => void>(() => {});
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const requiresAuth = (action: () => void, redirectUrl?: string) => {
    console.log("requiresAuth called, authentication status:", isAuthenticated, "user:", user?.id);
    
    if (isAuthenticated && user) {
      console.log("User is authenticated, executing action");
      action();
    } else {
      console.log("User is not authenticated, showing dialog");
      setPendingAction(() => action);
      setShowAuthDialog(true);
    }
  };

  const handleLogin = () => {
    console.log("Redirecting to login page");
    setShowAuthDialog(false);
    
    // Include the current URL as the return path
    const returnPath = encodeURIComponent(window.location.pathname + window.location.search);
    navigate(`/login?from=${returnPath}`);
  };

  const handleCancel = () => {
    console.log("Auth dialog canceled");
    setShowAuthDialog(false);
    setPendingAction(() => {});
  };

  const AuthDialog = () => (
    <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Authentication Required</DialogTitle>
          <DialogDescription>
            You need to be logged in to access this feature.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleLogin}>Log In</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return { requiresAuth, AuthDialog };
}
