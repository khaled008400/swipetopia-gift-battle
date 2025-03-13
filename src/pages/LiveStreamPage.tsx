
import { useEffect, useState } from "react";
import VideoFeed from "@/components/VideoFeed";
import BattleProgressIndicators from "@/components/battle/BattleProgressIndicators";
import { useBattleVideos } from "@/hooks/useBattleVideos";
import VideoActions from "@/components/video/VideoActions";
import { Link } from "react-router-dom";
import { ArrowLeft, Users } from "lucide-react";
import BattleModeSelector from "@/components/live/BattleModeSelector";
import ActiveStreamers from "@/components/live/ActiveStreamers";
import { useToast } from "@/hooks/use-toast";

type BattleMode = 'normal' | '1v1' | '2v2';

const STREAMER_VIDEO_MAPPING: Record<string, string[]> = {
  "1": ["1", "3"], // dancequeen videos
  "2": ["3", "5"], // lipqueen videos
  "3": ["6", "2"], // styleicon videos
  "4": ["2", "4"], // beatmaker videos 
  "5": ["5", "1"]  // gamerpro videos
};

const LiveStreamPage = () => {
  const [battleMode, setBattleMode] = useState<BattleMode>('normal');
  const [selectedStreamerId, setSelectedStreamerId] = useState<string | null>(null);
  const { toast } = useToast();
  
  const {
    activeVideoIndex,
    setActiveVideoIndex,
    filteredVideos,
    setStreamerFilter
  } = useBattleVideos(true); // true = live streams only

  const handleStreamerSelect = (streamerId: string) => {
    setSelectedStreamerId(streamerId);
    
    const streamerVideoIds = STREAMER_VIDEO_MAPPING[streamerId] || [];
    setStreamerFilter(streamerVideoIds);
    
    setActiveVideoIndex(0);
    
    toast({
      title: "Joined Live Stream",
      description: "You're now watching this live stream",
      duration: 2000,
    });
  };

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      if (e.deltaY > 0 && activeVideoIndex < filteredVideos.length - 1) {
        setActiveVideoIndex(prev => prev + 1);
      } else if (e.deltaY < 0 && activeVideoIndex > 0) {
        setActiveVideoIndex(prev => prev - 1);
      }
    };
    window.addEventListener('wheel', handleScroll);
    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, [activeVideoIndex, filteredVideos.length, setActiveVideoIndex]);

  useEffect(() => {
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
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
  }, [activeVideoIndex, filteredVideos.length, setActiveVideoIndex]);
  
  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden bg-gradient-to-b from-[#1A1F2C] to-black relative">
      {battleMode === 'normal' ? (
        <VideoFeed videos={filteredVideos} activeVideoIndex={activeVideoIndex} />
      ) : (
        <LiveBattleFeed videos={filteredVideos} activeVideoIndex={activeVideoIndex} mode={battleMode} />
      )}
      
      <BattleProgressIndicators videos={filteredVideos} activeIndex={activeVideoIndex} />

      <div className="absolute top-4 left-4 z-30 flex items-center">
        <Link to="/">
          <button className="mr-3 p-2 bg-black/40 backdrop-blur-md rounded-full border border-white/20 shadow-lg">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
        </Link>
        <h1 className="text-white font-bold text-lg bg-gradient-to-r from-[#FE2C55] to-[#FF6C85] bg-clip-text text-transparent">
          Live Stream
        </h1>
      </div>

      <ActiveStreamers 
        onStreamerSelect={handleStreamerSelect}
        selectedStreamerId={selectedStreamerId}
      />

      <div className="absolute top-28 right-4 z-30">
        <BattleModeSelector currentMode={battleMode} onModeChange={setBattleMode} />
      </div>
      
      <div className="absolute bottom-20 right-3 z-30">
        {filteredVideos[activeVideoIndex] && (
          <VideoActions 
            likes={filteredVideos[activeVideoIndex].likes} 
            comments={filteredVideos[activeVideoIndex].comments} 
            shares={filteredVideos[activeVideoIndex].shares}
            isLiked={filteredVideos[activeVideoIndex].isLiked || false}
            onLike={() => {
              console.log('Video liked:', filteredVideos[activeVideoIndex]);
            }}
          />
        )}
      </div>

      {filteredVideos.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h2 className="text-white text-xl font-bold mb-2">No Live Streams</h2>
          <p className="text-gray-400 text-center px-8">
            There are no live streams at the moment. Please check back later or select a streamer.
          </p>
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
  videos: any[], 
  activeVideoIndex: number, 
  mode: BattleMode 
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
            <video
              src={activeVideo.url}
              className="h-full w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
          <div className="h-1/2 w-full relative">
            <div className="absolute top-2 left-2 z-10 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full text-white text-xs">
              {activeVideo.user.username}_2
            </div>
            <video
              src={videos[(activeVideoIndex + 1) % videos.length].url}
              className="h-full w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
        </div>
      ) : (
        <div className="h-full w-full grid grid-cols-2 grid-rows-2 gap-1">
          <div className="relative">
            <div className="absolute top-2 left-2 z-10 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full text-white text-xs">
              Team A - {activeVideo.user.username}
            </div>
            <video
              src={activeVideo.url}
              className="h-full w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
          
          <div className="relative">
            <div className="absolute top-2 left-2 z-10 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full text-white text-xs">
              Team A - Partner
            </div>
            <video
              src={videos[(activeVideoIndex + 1) % videos.length].url}
              className="h-full w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
          
          <div className="relative">
            <div className="absolute top-2 left-2 z-10 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full text-white text-xs">
              Team B - Challenger
            </div>
            <video
              src={videos[(activeVideoIndex + 2) % videos.length].url}
              className="h-full w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
          
          <div className="relative">
            <div className="absolute top-2 left-2 z-10 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full text-white text-xs">
              Team B - Partner
            </div>
            <video
              src={videos[(activeVideoIndex + 3) % videos.length].url}
              className="h-full w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
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
