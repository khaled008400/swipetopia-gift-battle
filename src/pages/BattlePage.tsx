import { useState, useEffect } from "react";
import VideoPlayer from "@/components/VideoPlayer";

// Mock battle data - in a real app, this would come from an API
const BATTLES = [{
  id: "1",
  url: "https://assets.mixkit.co/videos/preview/mixkit-woman-dancing-in-the-club-with-colorful-lights-3739-large.mp4",
  user: {
    username: "dancequeen",
    avatar: "https://i.pravatar.cc/150?img=1"
  },
  description: "Dance Battle Finals 🏆 #dance #competition #finals",
  likes: 1432,
  comments: 87,
  shares: 34
}, {
  id: "2",
  url: "https://assets.mixkit.co/videos/preview/mixkit-man-dancing-under-changing-lights-32949-large.mp4",
  user: {
    username: "groovyking",
    avatar: "https://i.pravatar.cc/150?img=2"
  },
  description: "My entry for the dance battle! Vote if you like it 🔥 #dancebattle #hiphop",
  likes: 2651,
  comments: 132,
  shares: 76
}, {
  id: "3",
  url: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-vlogging-over-a-city-landscape-32746-large.mp4",
  user: {
    username: "lipqueen",
    avatar: "https://i.pravatar.cc/150?img=3"
  },
  description: "Freestyle Rap Challenge - Round 1 🎤 #rap #freestyle #competition",
  likes: 3219,
  comments: 201,
  shares: 97
}, {
  id: "4",
  url: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-waving-on-a-video-call-43892-large.mp4",
  user: {
    username: "lyricalgenius",
    avatar: "https://i.pravatar.cc/150?img=4"
  },
  description: "Responding to @lipqueen's challenge. Let's go! 🔥 #rapbattle #bars",
  likes: 2876,
  comments: 143,
  shares: 87
}, {
  id: "5",
  url: "https://assets.mixkit.co/videos/preview/mixkit-portrait-of-a-fashion-woman-with-silver-makeup-39875-large.mp4",
  user: {
    username: "fashionista",
    avatar: "https://i.pravatar.cc/150?img=5"
  },
  description: "Fashion Face-Off Entry 👗 #fashion #style #competition",
  likes: 4532,
  comments: 234,
  shares: 123
}, {
  id: "6",
  url: "https://assets.mixkit.co/videos/preview/mixkit-woman-modeling-in-an-empty-room-by-the-wall-42376-large.mp4",
  user: {
    username: "styleicon",
    avatar: "https://i.pravatar.cc/150?img=6"
  },
  description: "My fashion battle submission - vintage inspired 💫 #fashionbattle #vintage",
  likes: 3965,
  comments: 187,
  shares: 105
}];
const BattlePage = () => {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  // Handle swipe/scroll to change videos
  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      if (e.deltaY > 0 && activeVideoIndex < BATTLES.length - 1) {
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
      if (diff > 50 && activeVideoIndex < BATTLES.length - 1) {
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
  return <div className="h-[calc(100vh-64px)] overflow-hidden bg-app-black relative">
      {/* Videos container */}
      <div className="h-full flex flex-col transition-transform duration-500 ease-in-out" style={{
      transform: `translateY(-${activeVideoIndex * 100}%)`
    }}>
        {BATTLES.map((video, index) => <div key={video.id} className="h-full w-full flex-shrink-0">
            <VideoPlayer video={video} isActive={index === activeVideoIndex} />
          </div>)}
      </div>
      
      {/* Progress indicators */}
      <div className="absolute top-20 right-3 flex flex-col space-y-1 z-10">
        {BATTLES.map((_, index) => {})}
      </div>
    </div>;
};
export default BattlePage;