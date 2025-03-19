
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function useAuthCheck() {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<() => void>(() => {});
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const requiresAuth = (action: () => void, redirectUrl?: string) => {
    if (isAuthenticated) {
      action();
    } else {
      setPendingAction(() => action);
      setShowAuthDialog(true);
    }
  };

  const handleLogin = () => {
    setShowAuthDialog(false);
    navigate('/login');
  };

  const handleCancel = () => {
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
