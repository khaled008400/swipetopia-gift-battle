
import { useState, useEffect } from "react";
import BattleVideo from "@/components/BattleVideo";

// Mock battle data - in a real app, this would come from an API
const BATTLES = [
  {
    id: 1,
    title: "Dance Battle Finals",
    participants: 24,
    user1: {
      name: "dancequeen",
      avatar: "https://i.pravatar.cc/150?img=1"
    },
    user2: {
      name: "groovyking",
      avatar: "https://i.pravatar.cc/150?img=2"
    },
    videoUrl1: "https://assets.mixkit.co/videos/preview/mixkit-woman-dancing-in-the-club-with-colorful-lights-3739-large.mp4",
    videoUrl2: "https://assets.mixkit.co/videos/preview/mixkit-man-dancing-under-changing-lights-32949-large.mp4"
  },
  {
    id: 2,
    title: "Freestyle Rap Challenge",
    participants: 18,
    user1: {
      name: "lipqueen",
      avatar: "https://i.pravatar.cc/150?img=3"
    },
    user2: {
      name: "lyricalgenius",
      avatar: "https://i.pravatar.cc/150?img=4"
    },
    videoUrl1: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-vlogging-over-a-city-landscape-32746-large.mp4",
    videoUrl2: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-waving-on-a-video-call-43892-large.mp4"
  },
  {
    id: 3,
    title: "Fashion Face-Off",
    participants: 32,
    user1: {
      name: "fashionista",
      avatar: "https://i.pravatar.cc/150?img=5"
    },
    user2: {
      name: "styleicon",
      avatar: "https://i.pravatar.cc/150?img=6"
    },
    videoUrl1: "https://assets.mixkit.co/videos/preview/mixkit-portrait-of-a-fashion-woman-with-silver-makeup-39875-large.mp4",
    videoUrl2: "https://assets.mixkit.co/videos/preview/mixkit-woman-modeling-in-an-empty-room-by-the-wall-42376-large.mp4"
  }
];

const BattlePage = () => {
  const [activeBattleIndex, setActiveBattleIndex] = useState(0);

  // Handle swipe/scroll to change videos
  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      if (e.deltaY > 0 && activeBattleIndex < BATTLES.length - 1) {
        setActiveBattleIndex(prev => prev + 1);
      } else if (e.deltaY < 0 && activeBattleIndex > 0) {
        setActiveBattleIndex(prev => prev - 1);
      }
    };

    window.addEventListener('wheel', handleScroll);
    
    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, [activeBattleIndex]);

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
      if (diff > 50 && activeBattleIndex < BATTLES.length - 1) {
        setActiveBattleIndex(prev => prev + 1);
      } 
      // Swipe down - go to previous video
      else if (diff < -50 && activeBattleIndex > 0) {
        setActiveBattleIndex(prev => prev - 1);
      }
    };
    
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeBattleIndex]);

  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden bg-app-black relative">
      {/* Battle videos using our new component structure */}
      <div 
        className="h-full flex flex-col transition-transform duration-500 ease-in-out"
        style={{ transform: `translateY(-${activeBattleIndex * 100}%)` }}
      >
        {BATTLES.map((battle, index) => (
          <div key={battle.id} className="h-full w-full flex-shrink-0">
            <BattleVideo 
              battle={battle}
              isActive={index === activeBattleIndex}
            />
          </div>
        ))}
      </div>
      
      {/* Progress indicators */}
      <div className="absolute top-20 right-3 flex flex-col space-y-1 z-10">
        {BATTLES.map((_, index) => (
          <div 
            key={index} 
            className={`w-1 h-${index === activeBattleIndex ? '6' : '3'} rounded-full ${index === activeBattleIndex ? 'bg-app-yellow' : 'bg-gray-500'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BattlePage;
