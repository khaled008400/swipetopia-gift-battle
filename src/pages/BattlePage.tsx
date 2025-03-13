
import { useState, useEffect } from "react";
import VideoPlayer from "@/components/VideoPlayer";
import { Switch } from "@/components/ui/switch";
import { Cast } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Updated to more reliable video sources
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
  shares: 34,
  isLive: true
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
  shares: 76,
  isLive: false
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
  shares: 97,
  isLive: true
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
  shares: 87,
  isLive: false
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
  shares: 123,
  isLive: false
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
  shares: 105,
  isLive: true
}];

const BattlePage = () => {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [liveOnly, setLiveOnly] = useState(false);
  const { toast } = useToast();

  // Function to generate a mixed feed of videos where a live video appears approximately every 10 videos
  const generateMixedFeed = () => {
    if (liveOnly) {
      return BATTLES.filter(video => video.isLive);
    }
    
    // For demonstration, since we have a small dataset, we'll just sort them to ensure 
    // live videos are distributed (we'd use a more sophisticated algorithm with real data)
    const liveVideos = BATTLES.filter(video => video.isLive);
    const nonLiveVideos = BATTLES.filter(video => !video.isLive);
    
    // Sort all videos to get a varied mix
    const allVideos = [...BATTLES].sort((a, b) => {
      // This ensures live videos are more evenly distributed
      if (a.isLive && !b.isLive) return 1;
      if (!a.isLive && b.isLive) return -1;
      return 0;
    });
    
    return allVideos;
  };
  
  // Get filtered videos based on current settings
  const filteredVideos = generateMixedFeed();

  // Reset active index when filter changes to avoid out of bounds
  useEffect(() => {
    setActiveVideoIndex(0);
    if (liveOnly) {
      toast({
        title: "Live streams only",
        description: "Showing only live streams",
        duration: 2000,
      });
    } else {
      toast({
        title: "Mixed feed",
        description: "Showing a mix of videos and live streams",
        duration: 2000,
      });
    }
  }, [liveOnly, toast]);

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
  }, [activeVideoIndex, filteredVideos.length]);

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
  }, [activeVideoIndex, filteredVideos.length]);

  // Toggle live streams only
  const handleToggleLive = () => {
    setLiveOnly(!liveOnly);
  };

  return <div className="h-[calc(100vh-64px)] overflow-hidden bg-app-black relative">
      {/* Live toggle button */}
      <div className="absolute top-4 right-4 z-30 flex items-center gap-2 bg-black/60 p-2 rounded-full">
        <Cast className="h-5 w-5 text-white" />
        <span className="text-white text-xs mr-1">Live only</span>
        <Switch 
          checked={liveOnly} 
          onCheckedChange={handleToggleLive} 
          className="data-[state=checked]:bg-app-yellow" 
        />
      </div>

      {/* Videos container */}
      <div 
        className="h-full flex flex-col transition-transform duration-500 ease-in-out" 
        style={{
          transform: `translateY(-${activeVideoIndex * 100}%)`
        }}
      >
        {filteredVideos.map((video, index) => (
          <div key={video.id} className="h-full w-full flex-shrink-0">
            <VideoPlayer video={video} isActive={index === activeVideoIndex} />
          </div>
        ))}
      </div>
      
      {/* Progress indicators */}
      <div className="absolute top-20 right-3 flex flex-col space-y-1 z-10">
        {filteredVideos.map((video, index) => (
          <div 
            key={index}
            className={`w-1 h-4 rounded-full ${
              index === activeVideoIndex 
                ? 'bg-app-yellow' 
                : 'bg-gray-500/50'
            } ${
              video.isLive ? 'border border-red-500' : ''
            }`}
          />
        ))}
      </div>
    </div>;
};

export default BattlePage;
