
import { useEffect } from "react";
import VideoFeed from "@/components/VideoFeed";
import BattleProgressIndicators from "@/components/battle/BattleProgressIndicators";
import { useBattleVideos } from "@/hooks/useBattleVideos";
import VideoActions from "@/components/video/VideoActions";
import { ArrowLeft } from "lucide-react";
import BattleHeader from "@/components/battle/BattleHeader";

const BattlePage = () => {
  const {
    activeVideoIndex,
    setActiveVideoIndex,
    filteredVideos
  } = useBattleVideos(false); // false = regular videos only

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
    <div className="h-[calc(100vh-64px)] overflow-hidden bg-gradient-to-b from-[#1A1F2C] to-black relative">
      {/* Videos container */}
      <VideoFeed videos={filteredVideos} activeVideoIndex={activeVideoIndex} isBattlePage={true} />
      
      {/* Battle header with title */}
      {filteredVideos[activeVideoIndex] && (
        <BattleHeader title={filteredVideos[activeVideoIndex].description} />
      )}
      
      {/* Progress indicators */}
      <BattleProgressIndicators videos={filteredVideos} activeIndex={activeVideoIndex} />

      {/* Back button and page title */}
      <div className="absolute top-4 left-4 z-30 flex items-center">
        <button className="mr-3 p-2 bg-black/40 backdrop-blur-md rounded-full border border-white/20 shadow-lg">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-white font-bold text-lg bg-gradient-to-r from-[#9b87f5] to-[#D946EF] bg-clip-text text-transparent">
          Battle Videos
        </h1>
      </div>
      
      {/* Video actions */}
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
    </div>
  );
};

export default BattlePage;
