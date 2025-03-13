
import { useState, useEffect } from "react";
import VideoFeed from "@/components/VideoFeed";

// Mock video data - in a real app, this would come from an API
const VIDEOS = [
  {
    id: "1",
    url: "https://assets.mixkit.co/videos/preview/mixkit-woman-dancing-in-the-club-with-colorful-lights-3739-large.mp4",
    user: {
      username: "dancequeen",
      avatar: "https://i.pravatar.cc/150?img=1"
    },
    description: "Dance videos! Who's your favorite? #dance #viral",
    likes: 1243,
    comments: 89,
    shares: 56
  },
  {
    id: "2",
    url: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-vlogging-over-a-city-landscape-32746-large.mp4",
    user: {
      username: "lipqueen",
      avatar: "https://i.pravatar.cc/150?img=3"
    },
    description: "City views and vibes! Rate my vlog 1-10 in the comments #vlog #trending",
    likes: 2467,
    comments: 134,
    shares: 89
  },
  {
    id: "3",
    url: "https://assets.mixkit.co/videos/preview/mixkit-portrait-of-a-fashion-woman-with-silver-makeup-39875-large.mp4",
    user: {
      username: "fashionista",
      avatar: "https://i.pravatar.cc/150?img=5"
    },
    description: "Silver look for tonight's party! What do you think? #fashion #style #makeup",
    likes: 5698,
    comments: 241,
    shares: 178
  },
  {
    id: "4",
    url: "https://assets.mixkit.co/videos/preview/mixkit-woman-modeling-in-an-empty-room-by-the-wall-42376-large.mp4",
    user: {
      username: "styleicon",
      avatar: "https://i.pravatar.cc/150?img=6"
    },
    description: "Minimal vibes today! Less is more #model #fashion #minimal",
    likes: 3254,
    comments: 187,
    shares: 92
  },
  {
    id: "5",
    url: "https://assets.mixkit.co/videos/preview/mixkit-man-dancing-under-changing-lights-32949-large.mp4",
    user: {
      username: "groovyking",
      avatar: "https://i.pravatar.cc/150?img=2"
    },
    description: "Friday night moves! Can you do this? #dance #nightlife #weekend",
    likes: 7429,
    comments: 312,
    shares: 145
  }
];

const BattlePage = () => {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  // Handle swipe/scroll to change videos
  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      if (e.deltaY > 0 && activeVideoIndex < VIDEOS.length - 1) {
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
      if (diff > 50 && activeVideoIndex < VIDEOS.length - 1) {
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
      {/* Video feed component */}
      <VideoFeed videos={VIDEOS} activeVideoIndex={activeVideoIndex} />
      
      {/* Progress indicators */}
      <div className="absolute top-20 right-3 flex flex-col space-y-1 z-10">
        {VIDEOS.map((_, index) => (
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
