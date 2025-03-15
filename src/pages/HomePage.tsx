
import { useEffect, useState } from "react";
import VideoFeed from "../components/VideoFeed";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const { user } = useAuth();
  
  // Example video data - in a real app, this would come from an API
  const videos = [
    {
      id: "1",
      url: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-waving-on-a-video-call-43892-large.mp4",
      user: {
        username: "fashionista",
        avatar: "/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png"
      },
      description: "Check out my new collection! #fashion #style #trending",
      likes: 1243,
      comments: 89,
      shares: 56
    },
    {
      id: "2",
      url: "https://assets.mixkit.co/videos/preview/mixkit-portrait-of-a-fashion-woman-with-silver-makeup-39875-large.mp4",
      user: {
        username: "makeup_artist",
        avatar: "/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png"
      },
      description: "New makeup tutorial for the weekend party! #makeup #glam",
      likes: 2467,
      comments: 134,
      shares: 89,
      isLive: true
    },
    {
      id: "3",
      url: "https://assets.mixkit.co/videos/preview/mixkit-girl-dancing-happily-in-a-field-at-sunset-1230-large.mp4",
      user: {
        username: "travel_vibes",
        avatar: "/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png"
      },
      description: "Sunset vibes in Bali 🌴 #travel #sunset #bali",
      likes: 5698,
      comments: 241,
      shares: 178
    }
  ];

  // Detect swipe to change videos
  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      if (e.deltaY > 0 && activeVideoIndex < videos.length - 1) {
        setActiveVideoIndex(prev => prev + 1);
      } else if (e.deltaY < 0 && activeVideoIndex > 0) {
        setActiveVideoIndex(prev => prev - 1);
      }
    };

    window.addEventListener('wheel', handleScroll);
    
    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, [activeVideoIndex, videos.length]);

  return (
    <div className="h-full w-full overflow-hidden">
      {/* The VideoFeed is the main background content */}
      <VideoFeed videos={videos} activeVideoIndex={activeVideoIndex} />
    </div>
  );
};

export default HomePage;
