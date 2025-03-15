
import { useEffect, useState, useRef } from 'react';
import AgoraRTC, { 
  IAgoraRTCClient, 
  IAgoraRTCRemoteUser, 
  ICameraVideoTrack, 
  IMicrophoneAudioTrack 
} from 'agora-rtc-sdk-ng';

export interface AgoraToken {
  token: string;
  uid: number;
  appId: string;
}

interface UseAgoraClientProps {
  channelName: string;
  role?: 'host' | 'audience';
}

export function useAgoraClient({ channelName, role = 'audience' }: UseAgoraClientProps) {
  const [localTracks, setLocalTracks] = useState<{
    videoTrack: ICameraVideoTrack | null;
    audioTrack: IMicrophoneAudioTrack | null;
  }>({
    videoTrack: null,
    audioTrack: null,
  });
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const client = useRef<IAgoraRTCClient>(
    AgoraRTC.createClient({ mode: 'live', codec: 'h264' })
  );
  
  // Function to fetch token from Supabase Edge function
  const fetchToken = async () => {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { data, error } = await supabase.functions.invoke('generate-agora-token', {
        body: { 
          channelName, 
          role: role === 'host' ? 'publisher' : 'subscriber' 
        }
      });
      
      if (error) throw new Error(error.message);
      return data as AgoraToken;
    } catch (err) {
      console.error('Error fetching Agora token:', err);
      setError('Failed to get streaming token');
      throw err;
    }
  };

  // Function to join a channel
  const join = async () => {
    if (joined) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch token
      const tokenData = await fetchToken();
      const { token, uid, appId } = tokenData;
      
      // Set client role
      await client.current.setClientRole(role === 'host' ? 'host' : 'audience');
      
      // Join the channel
      await client.current.join(appId, channelName, token, uid);
      
      // If host, create and publish local tracks
      if (role === 'host') {
        const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
        
        await client.current.publish([audioTrack, videoTrack]);
        
        setLocalTracks({
          videoTrack,
          audioTrack,
        });
      }
      
      setJoined(true);
    } catch (err) {
      console.error('Error joining channel:', err);
      setError('Failed to join streaming channel');
    } finally {
      setLoading(false);
    }
  };

  // Function to leave the channel
  const leave = async () => {
    if (!joined) return;
    
    try {
      // Unpublish and close local tracks
      if (localTracks.videoTrack) {
        await client.current.unpublish(localTracks.videoTrack);
        localTracks.videoTrack.close();
      }
      
      if (localTracks.audioTrack) {
        await client.current.unpublish(localTracks.audioTrack);
        localTracks.audioTrack.close();
      }
      
      // Leave the channel
      await client.current.leave();
      
      setLocalTracks({
        videoTrack: null,
        audioTrack: null,
      });
      setJoined(false);
    } catch (err) {
      console.error('Error leaving channel:', err);
    }
  };

  // Setup event listeners
  useEffect(() => {
    if (!client.current) return;
    
    const handleUserPublished = async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
      await client.current.subscribe(user, mediaType);
      
      // Update remote users state
      setRemoteUsers(prev => {
        const exists = prev.find(u => u.uid === user.uid);
        if (exists) return [...prev];
        return [...prev, user];
      });
    };
    
    const handleUserUnpublished = (user: IAgoraRTCRemoteUser) => {
      // Update remote users state
      setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
    };
    
    client.current.on('user-published', handleUserPublished);
    client.current.on('user-unpublished', handleUserUnpublished);
    
    return () => {
      client.current.off('user-published', handleUserPublished);
      client.current.off('user-unpublished', handleUserUnpublished);
    };
  }, []);

  // Clean up when unmounted
  useEffect(() => {
    return () => {
      if (joined) {
        leave();
      }
    };
  }, [joined]);

  return {
    client: client.current,
    localTracks,
    remoteUsers,
    joined,
    loading,
    error,
    join,
    leave,
  };
}
