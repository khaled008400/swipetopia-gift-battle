
import { useEffect } from "react";
import VideoFeed from "@/components/VideoFeed";
import BattleProgressIndicators from "@/components/battle/BattleProgressIndicators";
import { useBattleVideos } from "@/hooks/useBattleVideos";
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

const LiveStreamPage = () => {
  const {
    activeVideoIndex,
    setActiveVideoIndex,
    liveVideosOnly,
    filteredVideos
  } = useBattleVideos(true); // true = live streams only

  // Handle swipe/scroll to change videos
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

  // Handle touch swipe for mobile
  useEffect(() => {
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;

      // Swipe up - go to next video
      if (diff > 50 && activeVideoIndex < filteredVideos.length - 1) {
        setActiveVideoIndex(prev => prev + 1);
      }
      // Swipe down - go to previous video
      else if (diff < -50 && activeVideoIndex > 0) {
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
    <div className="h-[calc(100vh-64px)] overflow-hidden bg-app-black relative">
      {/* Navigation to battles page */}
      <Link to="/battles" className="absolute top-4 right-4 z-30 flex items-center gap-2 bg-black/60 p-2 rounded-full backdrop-blur-sm border border-white/10 transition-all duration-300 hover:bg-black/70">
        <div className="text-white transition-colors duration-300">
          <Zap className="h-5 w-5" />
        </div>
        <span className="text-xs mr-1 text-white transition-colors duration-300">All Videos</span>
      </Link>

      {/* Videos container */}
      <VideoFeed videos={filteredVideos} activeVideoIndex={activeVideoIndex} />
      
      {/* Progress indicators */}
      <BattleProgressIndicators videos={filteredVideos} activeIndex={activeVideoIndex} />

      {/* Header title */}
      <div className="absolute top-4 left-4 z-30">
        <h1 className="text-white font-bold text-lg flex items-center gap-2">
          <Zap className="h-5 w-5 text-app-yellow animate-pulse" />
          Live Streams
        </h1>
      </div>
    </div>
  );
};

export default LiveStreamPage;
