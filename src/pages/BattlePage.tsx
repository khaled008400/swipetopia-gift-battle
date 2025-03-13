
import { useState, useEffect } from "react";
import { Trophy } from "lucide-react";
import BattleVideo from "@/components/BattleVideo";

// Mock battle data - in a real app, this would come from an API
const BATTLE_VIDEOS = [
  { 
    id: 1, 
    title: "Dance Battle Semi-finals", 
    participants: 8, 
    viewers: 1250, 
    user1: { name: "dancequeen", avatar: "https://i.pravatar.cc/150?img=1" },
    user2: { name: "groovyking", avatar: "https://i.pravatar.cc/150?img=2" },
    videoUrl1: "https://assets.mixkit.co/videos/preview/mixkit-woman-dancing-in-the-club-with-colorful-lights-3739-large.mp4",
    videoUrl2: "https://assets.mixkit.co/videos/preview/mixkit-man-dancing-under-changing-lights-32949-large.mp4"
  },
  { 
    id: 2, 
    title: "Lip Sync Battle", 
    participants: 6, 
    viewers: 875, 
    user1: { name: "lipqueen", avatar: "https://i.pravatar.cc/150?img=3" },
    user2: { name: "syncmaster", avatar: "https://i.pravatar.cc/150?img=4" },
    videoUrl1: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-vlogging-over-a-city-landscape-32746-large.mp4",
    videoUrl2: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-on-video-call-with-smartphone-43796-large.mp4"
  },
  { 
    id: 3, 
    title: "Fashion Showdown", 
    participants: 12, 
    viewers: 2431, 
    user1: { name: "fashionista", avatar: "https://i.pravatar.cc/150?img=5" },
    user2: { name: "styleicon", avatar: "https://i.pravatar.cc/150?img=6" },
    videoUrl1: "https://assets.mixkit.co/videos/preview/mixkit-portrait-of-a-fashion-woman-with-silver-makeup-39875-large.mp4",
    videoUrl2: "https://assets.mixkit.co/videos/preview/mixkit-woman-modeling-in-an-empty-room-by-the-wall-42376-large.mp4"
  },
];

const BattlePage = () => {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  // Handle swipe/scroll to change videos
  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      if (e.deltaY > 0 && activeVideoIndex < BATTLE_VIDEOS.length - 1) {
        setActiveVideoIndex(prev => prev + 1);
      } else if (e.deltaY < 0 && activeVideoIndex > 0) {
        setActiveVideoIndex(prev => prev - 1);
      }
    };

    window.addEventListener('wheel', handleScroll);
    
    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, [activeVideoIndex]);

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
      if (diff > 50 && activeVideoIndex < BATTLE_VIDEOS.length - 1) {
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
  }, [activeVideoIndex]);

  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden bg-app-black relative">
      <div 
        className="h-full flex flex-col transition-transform duration-500 ease-in-out"
        style={{ transform: `translateY(-${activeVideoIndex * 100}%)` }}
      >
        {BATTLE_VIDEOS.map((battle, index) => (
          <div key={battle.id} className="h-full w-full flex-shrink-0">
            <BattleVideo 
              battle={battle} 
              isActive={index === activeVideoIndex}
            />
          </div>
        ))}
      </div>
      
      {/* Progress indicators */}
      <div className="absolute top-20 right-3 flex flex-col space-y-1">
        {BATTLE_VIDEOS.map((_, index) => (
          <div 
            key={index} 
            className={`w-1 h-${index === activeVideoIndex ? '6' : '3'} rounded-full ${index === activeVideoIndex ? 'bg-app-yellow' : 'bg-gray-500'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BattlePage;
