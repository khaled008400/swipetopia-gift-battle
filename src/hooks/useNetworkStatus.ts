
import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConnected } from '@/integrations/supabase/client';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isConnectedToApi, setIsConnectedToApi] = useState(false);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  const checkApiConnection = useCallback(async () => {
    try {
      if (!isSupabaseConnected()) {
        setIsConnectedToApi(false);
        return;
      }
      
      const { data } = await supabase.from('profiles').select('id').limit(1);
      setIsConnectedToApi(true);
    } catch (error) {
      console.error('API connection check failed:', error);
      setIsConnectedToApi(false);
    }
  }, []);
  
  return { isOnline, isConnectedToApi, checkApiConnection };
}
