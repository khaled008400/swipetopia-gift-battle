
import React, { useEffect, useRef } from 'react';
import { useAgoraClient } from '@/hooks/useAgoraClient';

export interface AgoraVideoStreamProps {
  streamId: string;
  channelName?: string;
  token?: string; 
  role?: 'audience' | 'host';
}

const AgoraVideoStream: React.FC<AgoraVideoStreamProps> = ({ 
  streamId,
  channelName,
  token,
  role = 'audience'
}) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const { client, localTracks, remoteUsers, join, leave } = useAgoraClient();

  // Use the streamId as channel name if not provided
  const channel = channelName || `stream-${streamId}`;

  useEffect(() => {
    if (videoRef.current) {
      if (role === 'host' && localTracks?.videoTrack) {
        localTracks.videoTrack.play(videoRef.current);
      }
    }
    
    // Join the channel when component mounts
    join(channel, token);
    
    // Leave the channel when component unmounts
    return () => {
      leave();
    };
  }, [join, leave, channel, token, role, localTracks]);

  return (
    <div className="relative w-full h-full bg-black">
      {role === 'host' ? (
        <div ref={videoRef} className="w-full h-full" />
      ) : (
        <div className="w-full h-full">
          {remoteUsers.length > 0 ? (
            remoteUsers.map(user => (
              <div key={user.uid} id={`player-${user.uid}`} className="w-full h-full" />
            ))
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              <p>Waiting for the stream to start...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AgoraVideoStream;
