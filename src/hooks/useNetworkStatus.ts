
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import api from '@/services/api';
import { isSupabaseConnected } from '@/integrations/supabase/client';

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isConnectedToApi, setIsConnectedToApi] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      checkApiConnection();
      toast({
        title: "You're back online",
        description: "Your connection has been restored",
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsConnectedToApi(false);
      toast({
        title: "You're offline",
        description: "Please check your connection",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  const checkApiConnection = useCallback(async () => {
    if (!isOnline) {
      setIsConnectedToApi(false);
      return;
    }

    try {
      // In development, if Supabase is not connected, skip this check
      if (import.meta.env.DEV && !isSupabaseConnected()) {
        setIsConnectedToApi(true);
        return;
      }

      // Ping the API to see if it's reachable
      const response = await fetch(`${api.defaults.baseURL}/ping`, {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache',
      });
      
      setIsConnectedToApi(true);
    } catch (error) {
      console.error("API connection check failed:", error);
      setIsConnectedToApi(false);
    }
  }, [isOnline]);

  useEffect(() => {
    // Check API connection on initial load
    if (isOnline) {
      checkApiConnection();
    }
  }, [checkApiConnection, isOnline]);

  return { isOnline, isConnectedToApi, checkApiConnection };
};
