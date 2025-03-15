
import React, { useEffect, useRef } from 'react';
import { IAgoraRTCRemoteUser, IRemoteVideoTrack, IRemoteAudioTrack } from 'agora-rtc-sdk-ng';
import { useAgoraClient } from '@/hooks/useAgoraClient';
import { Button } from '@/components/ui/button';

interface AgoraVideoStreamProps {
  channelName: string;
  isHost?: boolean;
}

const AgoraVideoStream: React.FC<AgoraVideoStreamProps> = ({ 
  channelName, 
  isHost = false 
}) => {
  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRefs = useRef<Record<string, HTMLDivElement>>({});
  
  const {
    localTracks,
    remoteUsers,
    joined,
    loading,
    error,
    join,
    leave
  } = useAgoraClient({
    channelName,
    role: isHost ? 'host' : 'audience'
  });

  // Play local video track
  useEffect(() => {
    if (localTracks.videoTrack && localVideoRef.current) {
      localTracks.videoTrack.play(localVideoRef.current);
    }
    
    return () => {
      if (localTracks.videoTrack) {
        localTracks.videoTrack.stop();
      }
    };
  }, [localTracks.videoTrack]);

  // Play remote video tracks
  useEffect(() => {
    remoteUsers.forEach(user => {
      if (user.videoTrack && remoteVideoRefs.current[user.uid.toString()]) {
        const container = remoteVideoRefs.current[user.uid.toString()];
        user.videoTrack.play(container);
      }
      
      if (user.audioTrack) {
        user.audioTrack.play();
      }
    });
    
    return () => {
      remoteUsers.forEach(user => {
        if (user.videoTrack) {
          user.videoTrack.stop();
        }
        if (user.audioTrack) {
          user.audioTrack.stop();
        }
      });
    };
  }, [remoteUsers]);

  const handleJoin = () => {
    join();
  };

  const handleLeave = () => {
    leave();
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-red-50 text-red-500 rounded-md">
        <p>Error: {error}</p>
        <Button 
          variant="destructive" 
          onClick={() => join()} 
          className="mt-2"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-app-yellow"></div>
        </div>
      )}
      
      {!joined ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Button onClick={handleJoin} className="bg-app-yellow text-black">
            {isHost ? 'Start Streaming' : 'Join Stream'}
          </Button>
        </div>
      ) : (
        <>
          {/* Stream content */}
          <div className="relative w-full h-full">
            {/* Local video (for host) */}
            {isHost && (
              <div 
                ref={localVideoRef} 
                className="absolute inset-0 z-10 bg-black"
              />
            )}
            
            {/* Remote videos grid */}
            {remoteUsers.length > 0 ? (
              <div className={`w-full h-full grid ${remoteUsers.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-1`}>
                {remoteUsers.map(user => (
                  <div
                    key={user.uid}
                    ref={el => {
                      if (el) remoteVideoRefs.current[user.uid.toString()] = el;
                    }}
                    className="w-full h-full bg-black"
                  />
                ))}
              </div>
            ) : !isHost && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                <p className="text-white text-lg">Waiting for host to start the stream...</p>
              </div>
            )}
          </div>
          
          {/* Stream controls */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center z-20">
            <Button
              onClick={handleLeave}
              variant="destructive"
              className="shadow-lg"
            >
              {isHost ? 'End Stream' : 'Leave Stream'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default AgoraVideoStream;
