
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { toast } = useToast();

  useEffect(() => {
    // Update network status
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Connected",
        description: "Your internet connection has been restored",
        variant: "default",
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Connection lost",
        description: "You are currently offline. Some features may be unavailable.",
        variant: "destructive",
      });
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    if (!navigator.onLine) {
      toast({
        title: "No internet connection",
        description: "You are currently offline. Some features may be unavailable.",
        variant: "destructive",
      });
    }

    // Cleanup event listeners
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  return { isOnline };
}
