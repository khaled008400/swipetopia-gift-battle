
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isConnectedToApi, setIsConnectedToApi] = useState(true);
  const { toast } = useToast();

  // Check if we can reach the API server
  const checkApiConnection = useCallback(async () => {
    if (!navigator.onLine) {
      setIsConnectedToApi(false);
      return false;
    }
    
    try {
      // Check if we can reach Supabase
      const response = await fetch("https://ifeuccpukdosoxtufxzi.supabase.co/rest/v1/", {
        method: "HEAD",
        headers: {
          "Content-Type": "application/json",
          "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmZXVjY3B1a2Rvc294dHVmeHppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3NDM2MjAsImV4cCI6MjA1NzMxOTYyMH0.I4wy6OFJY_zYNrhYWjw7xphFTBc5vT9sgNM3i2iPUqI"
        }
      });
      
      const connected = response.ok || response.status === 200;
      setIsConnectedToApi(connected);
      return connected;
    } catch (error) {
      console.error("API connectivity issue:", error);
      setIsConnectedToApi(false);
      return false;
    }
  }, []);

  useEffect(() => {
    // Update network status
    const handleOnline = async () => {
      setIsOnline(true);
      
      // When we come back online, check if we can reach the API
      const apiConnected = await checkApiConnection();
      
      if (apiConnected) {
        toast({
          title: "Connected",
          description: "Your internet connection has been restored",
          variant: "default",
        });
      } else {
        toast({
          title: "Limited Connection",
          description: "You're online but can't reach our servers. Some features may be unavailable.",
          variant: "default", // Changed from "warning" to "default"
        });
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsConnectedToApi(false);
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
      setIsConnectedToApi(false);
      toast({
        title: "No internet connection",
        description: "You are currently offline. Some features may be unavailable.",
        variant: "destructive",
      });
    } else {
      // If we're online, check API connection
      checkApiConnection();
    }

    // Set up a periodic check for API connectivity when online
    const intervalId = setInterval(() => {
      if (navigator.onLine) {
        checkApiConnection();
      }
    }, 30000); // Check every 30 seconds

    // Cleanup event listeners and interval
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(intervalId);
    };
  }, [toast, checkApiConnection]);

  return { isOnline, isConnectedToApi, checkApiConnection };
}
