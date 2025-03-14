
import { useEffect, useState, useRef } from "react";
import VideoFeed from "@/components/VideoFeed";
import BattleProgressIndicators from "@/components/battle/BattleProgressIndicators";
import { useBattleVideos } from "@/hooks/useBattleVideos";
import VideoActions from "@/components/video/VideoActions";
import { Link } from "react-router-dom";
import { ArrowLeft, Users, Video, Mic, MicOff, Camera, CameraOff, PhoneOff } from "lucide-react";
import BattleModeSelector from "@/components/live/BattleModeSelector";
import ActiveStreamers from "@/components/live/ActiveStreamers";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import LiveStreamService, { StreamUser, RoomInfo } from "@/services/livestream.service";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import VideoErrorDisplay from "@/components/video/VideoErrorDisplay";

type BattleMode = 'normal' | '1v1' | '2v2';

const STREAMER_VIDEO_MAPPING: Record<string, string[]> = {
  "1": ["1", "3"],
  // dancequeen videos
  "2": ["3", "5"],
  // lipqueen videos
  "3": ["6", "2"],
  // styleicon videos
  "4": ["2", "4"],
  // beatmaker videos 
  "5": ["5", "1"] // gamerpro videos
};

const LiveStreamPage = () => {
  const [battleMode, setBattleMode] = useState<BattleMode>('normal');
  const [selectedStreamerId, setSelectedStreamerId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isJoiningStream, setIsJoiningStream] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [viewerCount, setViewerCount] = useState(0);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  
  const { toast } = useToast();
  const { user } = useAuth();
  
  const {
    activeVideoIndex,
    setActiveVideoIndex,
    filteredVideos,
    setStreamerFilter
  } = useBattleVideos(true); // true = live streams only

  const handleStreamerSelect = async (streamerId: string) => {
    if (isStreaming) {
      toast({
        title: "End your stream first",
        description: "You need to end your own stream before watching others",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedStreamerId(streamerId);
    const streamerVideoIds = STREAMER_VIDEO_MAPPING[streamerId] || [];
    setStreamerFilter(streamerVideoIds);
    setActiveVideoIndex(0);
    
    // Join the live stream if available
    setIsJoiningStream(true);
    try {
      if (!LiveStreamService.isInitialized()) {
        await LiveStreamService.initialize();
      }
      
      // Construct room ID based on streamer ID
      const roomID = `room-${streamerId}`;
      
      if (user) {
        const streamUser: StreamUser = {
          userID: user.id || 'guest-' + Math.floor(Math.random() * 10000),
          userName: user.username || 'Guest',
          avatar: user.avatar
        };
        
        // Generate token from backend
        const token = await LiveStreamService.generateToken(streamUser.userID, roomID, 1); // 1 = viewer role
        
        // Login to the room
        await LiveStreamService.loginRoom(roomID, streamUser, token);
        
        // Watch the stream
        await LiveStreamService.watchLiveStream(roomID, `stream-${streamerId}`);
        
        setCurrentRoom(roomID);
        
        toast({
          title: "Joined Live Stream",
          description: "You're now watching this live stream",
          duration: 2000
        });
      }
    } catch (error) {
      console.error("Failed to join live stream:", error);
      setStreamError("Could not join the live stream. Please try again later.");
      toast({
        title: "Failed to join stream",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsJoiningStream(false);
    }
  };

  const startLiveStream = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "You need to sign in to start a live stream",
        variant: "destructive"
      });
      return;
    }
    
    try {
      if (!LiveStreamService.isInitialized()) {
        await LiveStreamService.initialize();
      }
      
      const streamUser: StreamUser = {
        userID: user.id,
        userName: user.username || 'Streamer',
        avatar: user.avatar
      };
      
      // Create a room with user ID as the room ID
      const roomID = `room-${user.id}`;
      
      // Generate token from backend
      const token = await LiveStreamService.generateToken(streamUser.userID, roomID, 2); // 2 = host role
      
      // Login to the room
      await LiveStreamService.loginRoom(roomID, streamUser, token);
      
      // Start streaming
      const roomInfo: RoomInfo = {
        roomID,
        roomName: `${streamUser.userName}'s Stream`,
        hostUserID: streamUser.userID,
        streamID: `stream-${user.id}`,
        startTime: Date.now()
      };
      
      await LiveStreamService.startLiveStream(roomInfo, streamUser);
      
      setIsStreaming(true);
      setCurrentRoom(roomID);
      setSelectedStreamerId(null);
      
      toast({
        title: "Live stream started",
        description: "You are now live! Others can see your stream.",
        duration: 3000
      });
    } catch (error) {
      console.error("Failed to start live stream:", error);
      setStreamError("Could not start the live stream. Please try again later.");
      toast({
        title: "Failed to start stream",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    }
  };

  const endLiveStream = async () => {
    if (!isStreaming || !currentRoom) return;
    
    try {
      await LiveStreamService.stopLiveStream(`stream-${user?.id}`);
      await LiveStreamService.leaveRoom(currentRoom);
      
      setIsStreaming(false);
      setCurrentRoom(null);
      
      toast({
        title: "Live stream ended",
        description: "Your live stream has ended successfully.",
        duration: 2000
      });
    } catch (error) {
      console.error("Failed to end live stream:", error);
      toast({
        title: "Error",
        description: "Failed to end the live stream properly.",
        variant: "destructive"
      });
    }
  };

  const leaveStream = async () => {
    if (!currentRoom || isStreaming) return;
    
    try {
      await LiveStreamService.stopWatchingStream(`stream-${selectedStreamerId}`);
      await LiveStreamService.leaveRoom(currentRoom);
      
      setSelectedStreamerId(null);
      setCurrentRoom(null);
      
      toast({
        title: "Left stream",
        description: "You have left the live stream.",
        duration: 2000
      });
    } catch (error) {
      console.error("Failed to leave stream:", error);
      toast({
        title: "Error",
        description: "Failed to leave the stream properly.",
        variant: "destructive"
      });
    }
  };

  const toggleMic = async () => {
    if (!isStreaming) return;
    
    try {
      // Toggle microphone
      if (micEnabled) {
        // Mute microphone
        await LiveStreamService.engine.muteMicrophone();
      } else {
        // Unmute microphone
        await LiveStreamService.engine.unmuteMicrophone();
      }
      
      setMicEnabled(!micEnabled);
      
      toast({
        title: micEnabled ? "Microphone muted" : "Microphone unmuted",
        duration: 1000
      });
    } catch (error) {
      console.error("Failed to toggle microphone:", error);
      toast({
        title: "Error",
        description: "Failed to toggle microphone.",
        variant: "destructive"
      });
    }
  };

  const toggleCamera = async () => {
    if (!isStreaming) return;
    
    try {
      // Toggle camera
      if (cameraEnabled) {
        // Disable camera
        await LiveStreamService.engine.enableCamera(false);
      } else {
        // Enable camera
        await LiveStreamService.engine.enableCamera(true);
      }
      
      setCameraEnabled(!cameraEnabled);
      
      toast({
        title: cameraEnabled ? "Camera disabled" : "Camera enabled",
        duration: 1000
      });
    } catch (error) {
      console.error("Failed to toggle camera:", error);
      toast({
        title: "Error",
        description: "Failed to toggle camera.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    // Simulate random viewer count updates while streaming
    if (isStreaming) {
      const interval = setInterval(() => {
        setViewerCount(prev => Math.floor(Math.random() * 20) + prev);
      }, 10000);
      
      return () => clearInterval(interval);
    }
  }, [isStreaming]);

  useEffect(() => {
    // Set up event listeners for ZegoCloud SDK
    if (LiveStreamService.isInitialized() && LiveStreamService.engine) {
      const engine = LiveStreamService.engine;
      
      // Handle user state update (e.g., new users joining)
      engine.on('roomUserUpdate', (roomID, updateType, userList) => {
        console.log(`Room ${roomID} user update: ${updateType}`, userList);
        if (updateType === 'ADD') {
          setViewerCount(prev => prev + userList.length);
        } else {
          setViewerCount(prev => Math.max(0, prev - userList.length));
        }
      });
      
      // Handle stream state update
      engine.on('roomStreamUpdate', (roomID, updateType, streamList) => {
        console.log(`Room ${roomID} stream update: ${updateType}`, streamList);
      });
    }
    
    return () => {
      // Clean up on component unmount
      if (LiveStreamService.isInitialized() && currentRoom) {
        LiveStreamService.leaveRoom(currentRoom).catch(console.error);
        LiveStreamService.destroy().catch(console.error);
      }
    };
  }, [currentRoom]);

  const handleScroll = (e: WheelEvent) => {
    if (selectedStreamerId || isStreaming) return; // Don't scroll if watching or streaming
    
    if (e.deltaY > 0 && activeVideoIndex < filteredVideos.length - 1) {
      setActiveVideoIndex(prev => prev + 1);
    } else if (e.deltaY < 0 && activeVideoIndex > 0) {
      setActiveVideoIndex(prev => prev - 1);
    }
  };

  useEffect(() => {
    window.addEventListener('wheel', handleScroll);
    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, [activeVideoIndex, filteredVideos.length, setActiveVideoIndex, selectedStreamerId, isStreaming]);

  useEffect(() => {
    let touchStartY = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      if (selectedStreamerId || isStreaming) return; // Don't scroll if watching or streaming
      touchStartY = e.touches[0].clientY;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      if (selectedStreamerId || isStreaming) return; // Don't scroll if watching or streaming
      
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;
      
      if (diff > 50 && activeVideoIndex < filteredVideos.length - 1) {
        setActiveVideoIndex(prev => prev + 1);
      } else if (diff < -50 && activeVideoIndex > 0) {
        setActiveVideoIndex(prev => prev - 1);
      }
    };
    
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeVideoIndex, filteredVideos.length, setActiveVideoIndex, selectedStreamerId, isStreaming]);

  // Render the live stream interface
  const renderLiveInterface = () => {
    if (isStreaming) {
      return (
        <div className="h-full flex flex-col relative">
          {/* Local video */}
          <div className="flex-1 bg-black relative">
            <video 
              id="local-video" 
              ref={localVideoRef} 
              autoPlay 
              playsInline 
              muted 
              className="h-full w-full object-cover"
            />
            
            {/* Stream info overlay */}
            <div className="absolute top-4 left-4 z-30 flex items-center bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">
              <Badge variant="destructive" className="mr-2">LIVE</Badge>
              <span className="text-white">{user?.username || 'You'}</span>
            </div>
            
            <div className="absolute top-4 right-4 z-30 flex items-center bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">
              <Users className="h-4 w-4 text-red-500 mr-2" />
              <span className="text-white">{viewerCount}</span>
            </div>
            
            {/* Stream controls */}
            <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center space-x-4">
              <Button 
                variant="outline" 
                size="icon" 
                className={`rounded-full ${micEnabled ? 'bg-white/20' : 'bg-red-500/70'}`}
                onClick={toggleMic}
              >
                {micEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </Button>
              
              <Button 
                variant="outline" 
                size="icon" 
                className={`rounded-full ${cameraEnabled ? 'bg-white/20' : 'bg-red-500/70'}`}
                onClick={toggleCamera}
              >
                {cameraEnabled ? <Camera className="h-5 w-5" /> : <CameraOff className="h-5 w-5" />}
              </Button>
              
              <Button 
                variant="destructive" 
                size="icon" 
                className="rounded-full"
                onClick={endLiveStream}
              >
                <PhoneOff className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      );
    } else if (selectedStreamerId) {
      return (
        <div className="h-full flex flex-col relative">
          {/* Remote video */}
          <div className="flex-1 bg-black relative">
            <video 
              id="remote-video" 
              ref={remoteVideoRef} 
              autoPlay 
              playsInline 
              className="h-full w-full object-cover"
            />
            
            {streamError && (
              <VideoErrorDisplay 
                isLive={true} 
                message={streamError}
                onRetry={() => handleStreamerSelect(selectedStreamerId)}
              />
            )}
            
            {/* Stream info overlay */}
            <div className="absolute top-4 left-4 z-30 flex items-center bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">
              <Badge variant="destructive" className="mr-2">LIVE</Badge>
              <span className="text-white">
                {STREAMER_VIDEO_MAPPING[selectedStreamerId] ? 
                  `@${filteredVideos[0]?.user?.username || 'Streamer'}` : 
                  'Streamer'}
              </span>
            </div>
            
            <div className="absolute top-4 right-4 z-30 flex items-center bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">
              <Users className="h-4 w-4 text-red-500 mr-2" />
              <span className="text-white">{viewerCount || Math.floor(Math.random() * 1000) + 100}</span>
            </div>
            
            {/* Leave stream button */}
            <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center">
              <Button 
                variant="destructive"
                onClick={leaveStream}
              >
                <PhoneOff className="h-4 w-4 mr-2" />
                Leave Stream
              </Button>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <>
        {battleMode === 'normal' ? 
          <VideoFeed videos={filteredVideos} activeVideoIndex={activeVideoIndex} /> : 
          <LiveBattleFeed videos={filteredVideos} activeVideoIndex={activeVideoIndex} mode={battleMode} />
        }
        
        <BattleProgressIndicators videos={filteredVideos} activeIndex={activeVideoIndex} />
        
        {filteredVideos[activeVideoIndex] && (
          <div className="absolute bottom-20 right-3 z-30">
            <VideoActions 
              likes={filteredVideos[activeVideoIndex].likes} 
              comments={filteredVideos[activeVideoIndex].comments} 
              shares={filteredVideos[activeVideoIndex].shares} 
              isLiked={filteredVideos[activeVideoIndex].isLiked || false} 
              onLike={() => {
                console.log('Video liked:', filteredVideos[activeVideoIndex]);
              }} 
            />
          </div>
        )}
      </>
    );
  };

  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden bg-gradient-to-b from-[#1A1F2C] to-black relative">
      {renderLiveInterface()}
      
      <div className="absolute top-4 left-4 z-30 flex items-center">
        <Link to="/">
          <ArrowLeft className="h-6 w-6 text-white" />
        </Link>
      </div>

      {!isStreaming && (
        <ActiveStreamers 
          onStreamerSelect={handleStreamerSelect} 
          selectedStreamerId={selectedStreamerId} 
        />
      )}

      {!isStreaming && !selectedStreamerId && (
        <div className="absolute top-28 right-4 z-30">
          <BattleModeSelector currentMode={battleMode} onModeChange={setBattleMode} />
        </div>
      )}
      
      {!isStreaming && !selectedStreamerId && (
        <div className="absolute bottom-24 left-4 z-30">
          <Button 
            variant="default" 
            className="bg-red-600 hover:bg-red-700"
            onClick={startLiveStream}
          >
            <Video className="h-4 w-4 mr-2" />
            Go Live
          </Button>
        </div>
      )}

      {(filteredVideos.length === 0 && !isStreaming && !selectedStreamerId) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h2 className="text-white text-xl font-bold mb-2">No Live Streams</h2>
          <p className="text-gray-400 text-center px-8">
            There are no live streams at the moment. Please check back later or select a streamer.
          </p>
          <Button 
            variant="default" 
            className="bg-red-600 hover:bg-red-700 mt-4"
            onClick={startLiveStream}
          >
            <Video className="h-4 w-4 mr-2" />
            Start Your Own Stream
          </Button>
        </div>
      )}
    </div>
  );
};

const LiveBattleFeed = ({
  videos,
  activeVideoIndex,
  mode
}: {
  videos: any[];
  activeVideoIndex: number;
  mode: BattleMode;
}) => {
  const activeVideo = videos[activeVideoIndex];
  if (!activeVideo) return null;
  
  return (
    <div className="h-full w-full relative">
      {mode === '1v1' ? (
        <div className="h-full w-full flex flex-col">
          <div className="h-1/2 w-full relative border-b-2 border-white/20">
            <div className="absolute top-2 left-2 z-10 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full text-white text-xs">
              {activeVideo.user.username}_1
            </div>
            <video src={activeVideo.url} className="h-full w-full object-cover" autoPlay loop muted playsInline />
          </div>
          <div className="h-1/2 w-full relative">
            <div className="absolute top-2 left-2 z-10 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full text-white text-xs">
              {activeVideo.user.username}_2
            </div>
            <video src={videos[(activeVideoIndex + 1) % videos.length].url} className="h-full w-full object-cover" autoPlay loop muted playsInline />
          </div>
        </div>
      ) : (
        <div className="h-full w-full grid grid-cols-2 grid-rows-2 gap-1">
          <div className="relative">
            <div className="absolute top-2 left-2 z-10 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full text-white text-xs">
              Team A - {activeVideo.user.username}
            </div>
            <video src={activeVideo.url} className="h-full w-full object-cover" autoPlay loop muted playsInline />
          </div>
          
          <div className="relative">
            <div className="absolute top-2 left-2 z-10 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full text-white text-xs">
              Team A - Partner
            </div>
            <video src={videos[(activeVideoIndex + 1) % videos.length].url} className="h-full w-full object-cover" autoPlay loop muted playsInline />
          </div>
          
          <div className="relative">
            <div className="absolute top-2 left-2 z-10 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full text-white text-xs">
              Team B - Challenger
            </div>
            <video src={videos[(activeVideoIndex + 2) % videos.length].url} className="h-full w-full object-cover" autoPlay loop muted playsInline />
          </div>
          
          <div className="relative">
            <div className="absolute top-2 left-2 z-10 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full text-white text-xs">
              Team B - Partner
            </div>
            <video src={videos[(activeVideoIndex + 3) % videos.length].url} className="h-full w-full object-cover" autoPlay loop muted playsInline />
          </div>
        </div>
      )}
      
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
        <div className="bg-black/40 backdrop-blur-md p-3 rounded-full">
          <span className="text-white font-bold animate-pulse">
            LIVE BATTLE
          </span>
        </div>
      </div>
      
      {mode !== 'normal' && (
        <div className="absolute bottom-24 left-0 right-0 px-4 z-20 flex justify-center">
          <div className="flex space-x-4">
            <button className="bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-xl border border-white/20">
              Vote {mode === '1v1' ? activeVideo.user.username + '_1' : 'Team A'}
            </button>
            <button className="bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-xl border border-white/20">
              Vote {mode === '1v1' ? activeVideo.user.username + '_2' : 'Team B'}
            </button>
          </div>
        </div>
      )}
      
      <div className="absolute top-14 right-4 z-20">
        <div className="flex items-center bg-black/40 backdrop-blur-md px-2 py-1 rounded-full">
          <Users className="h-4 w-4 text-red-500 mr-1" />
          <span className="text-white text-xs">{Math.floor(Math.random() * 1000) + 100}</span>
        </div>
      </div>
    </div>
  );
};

export default LiveStreamPage;
