
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { isSupabaseConnected } from '@/integrations/supabase/client';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isConnectedToApi, setIsConnectedToApi] = useState(true);
  const { toast } = useToast();

  // Simplified API check
  const checkApiConnection = useCallback(async () => {
    if (!navigator.onLine) {
      setIsConnectedToApi(false);
      return false;
    }
    
    // Skip API check if Supabase is disconnected
    if (!isSupabaseConnected()) {
      setIsConnectedToApi(true);
      return true;
    }
    
    try {
      // Simple connection check
      const response = await fetch("https://www.google.com", { 
        method: "HEAD",
        mode: "no-cors"
      });
      
      setIsConnectedToApi(true);
      return true;
    } catch (error) {
      console.error("Network connectivity issue:", error);
      setIsConnectedToApi(false);
      return false;
    }
  }, []);

  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      const apiConnected = await checkApiConnection();
      
      if (apiConnected) {
        toast({
          title: "Connected",
          description: "Your internet connection has been restored",
        });
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsConnectedToApi(false);
      toast({
        title: "Connection lost",
        description: "You are currently offline",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check only
    checkApiConnection();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast, checkApiConnection]);

  return { isOnline, isConnectedToApi, checkApiConnection };
}
