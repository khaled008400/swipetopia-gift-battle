
import { useState, useEffect, useCallback } from 'react';
import AgoraRTC, { IAgoraRTCClient, IAgoraRTCRemoteUser, ICameraVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';

interface AgoraClientOptions {
  channelName: string;
  role?: 'host' | 'audience';
  token?: string;
  uid?: number;
}

// Initialize Agora SDK
AgoraRTC.setLogLevel(4); // Disable logs for production

// Define the interface for the return value
interface UseAgoraClientReturn {
  client: IAgoraRTCClient | null;
  localTracks: {
    videoTrack: ICameraVideoTrack | null;
    audioTrack: IMicrophoneAudioTrack | null;
  };
  remoteUsers: IAgoraRTCRemoteUser[];
  join: (channelName?: string) => Promise<void>;
  leave: () => void;
}

export const useAgoraClient = ({
  channelName,
  role = 'audience',
  token,
  uid,
}: AgoraClientOptions): UseAgoraClientReturn => {
  const appId = import.meta.env.VITE_AGORA_APP_ID || '';
  const [client, setClient] = useState<IAgoraRTCClient | null>(null);
  const [localVideoTrack, setLocalVideoTrack] = useState<ICameraVideoTrack | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);

  useEffect(() => {
    // Initialize the client
    const rtcClient = AgoraRTC.createClient({ mode: 'live', codec: 'vp8' });
    rtcClient.setClientRole(role);

    // Set up event handlers
    rtcClient.on('user-published', async (user, mediaType) => {
      await rtcClient.subscribe(user, mediaType);
      
      // Handle new remote users
      setRemoteUsers(prev => {
        if (prev.findIndex(u => u.uid === user.uid) === -1) {
          return [...prev, user];
        }
        return prev;
      });
      
      // Play the track
      if (mediaType === 'video') {
        const videoPlayerElement = document.getElementById(`player-${user.uid}`);
        if (videoPlayerElement) {
          user.videoTrack?.play(videoPlayerElement);
        }
      }
      
      if (mediaType === 'audio') {
        user.audioTrack?.play();
      }
    });
    
    rtcClient.on('user-unpublished', (user, mediaType) => {
      if (mediaType === 'video') {
        user.videoTrack?.stop();
      }
      if (mediaType === 'audio') {
        user.audioTrack?.stop();
      }
    });
    
    rtcClient.on('user-left', (user) => {
      setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
    });

    setClient(rtcClient);

    // Cleanup
    return () => {
      rtcClient.removeAllListeners();
    };
  }, [role]);

  // Function to join a channel
  const join = useCallback(async (newChannelName?: string) => {
    if (!client) return;
    
    try {
      // Generate a random uid if not provided
      const clientUid = uid || Math.floor(Math.random() * 10000);
      
      // Try to fetch a token from the server if not provided
      let agoraToken = token;
      if (!agoraToken) {
        try {
          const response = await fetch('/api/generate-agora-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              channelName: newChannelName || channelName,
              uid: clientUid,
              role: role === 'host' ? 'publisher' : 'subscriber'
            })
          });
          
          if (response.ok) {
            const data = await response.json();
            agoraToken = data.token;
          }
        } catch (err) {
          console.warn('Error fetching token, trying without token:', err);
        }
      }
      
      // Join the channel
      await client.join(appId, newChannelName || channelName, agoraToken, clientUid);
      
      // Create and publish local tracks if host
      if (role === 'host') {
        const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
        await client.publish([audioTrack, videoTrack]);
        setLocalAudioTrack(audioTrack);
        setLocalVideoTrack(videoTrack);
      }
      
      console.log('Joined channel successfully');
    } catch (error) {
      console.error('Error joining channel:', error);
    }
  }, [client, channelName, role, token, uid, appId]);

  // Function to leave the channel
  const leave = useCallback(async () => {
    if (localAudioTrack) {
      localAudioTrack.close();
      setLocalAudioTrack(null);
    }
    
    if (localVideoTrack) {
      localVideoTrack.close();
      setLocalVideoTrack(null);
    }
    
    if (client) {
      await client.leave();
      setRemoteUsers([]);
    }
  }, [client, localAudioTrack, localVideoTrack]);

  return {
    client,
    localTracks: {
      videoTrack: localVideoTrack,
      audioTrack: localAudioTrack
    },
    remoteUsers,
    join,
    leave
  };
};
