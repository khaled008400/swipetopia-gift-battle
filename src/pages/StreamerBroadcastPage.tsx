
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import StreamerBroadcast from '@/components/live/StreamerBroadcast';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuthCheck } from '@/hooks/useAuthCheck';

const StreamerBroadcastPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [streamerName, setStreamerName] = useState('');
  const [loading, setLoading] = useState(true);
  const { AuthDialog } = useAuthCheck();
  
  useEffect(() => {
    const checkAuthorization = async () => {
      if (!user) {
        setIsAuthorized(false);
        setLoading(false);
        return;
      }
      
      try {
        // Check if user has streamer role in profiles table
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        // Check if the user has the 'streamer' role
        const hasStreamerRole = data.role === 'streamer' || 
                               (data.roles && Array.isArray(data.roles) && 
                                data.roles.includes('streamer'));
        
        setIsAuthorized(hasStreamerRole);
        
        // Get username from the profile
        if (data) {
          setStreamerName(data.username || 'Streamer');
        }
      } catch (error) {
        console.error('Error checking authorization:', error);
        setIsAuthorized(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthorization();
  }, [user]);
  
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-app-yellow"></div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-900 to-black">
        <h1 className="text-2xl font-bold text-white mb-4">Authentication Required</h1>
        <p className="text-gray-400 text-center mb-6">
          Please sign in to access the broadcasting studio.
        </p>
        <Button variant="outline" onClick={() => navigate("/login?from=/streamer-broadcast")}>
          Sign In
        </Button>
        <AuthDialog />
      </div>
    );
  }
  
  if (!isAuthorized) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-900 to-black">
        <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
        <p className="text-gray-400 text-center mb-6">
          You need streamer privileges to broadcast live. Please contact support if you believe this is an error.
        </p>
        <Button variant="outline" onClick={() => navigate("/")}>
          Return Home
        </Button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-white mb-6">
          Your Broadcast Studio
        </h1>
        
        <div className="aspect-video overflow-hidden rounded-lg shadow-lg">
          {user && (
            <StreamerBroadcast 
              streamerId={user.id} 
              streamerName={streamerName} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StreamerBroadcastPage;
