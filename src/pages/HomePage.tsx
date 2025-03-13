
import { useState, useRef, useEffect } from "react";
import VideoPlayer from "../components/VideoPlayer";

// Updated with better quality video and realistic user data
const MOCK_VIDEOS = [
  {
    id: "1",
    url: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-waving-happily-at-the-camera-42613-large.mp4",
    user: {
      username: "fashionista",
      avatar: "/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png"
    },
    description: "Check out this amazing new outfit! #fashion #style #trending",
    likes: 1245,
    comments: 42,
    shares: 15,
    isLive: false
  },
  {
    id: "2",
    url: "https://assets.mixkit.co/videos/preview/mixkit-portrait-of-a-fashion-woman-with-silver-makeup-39875-large.mp4",
    user: {
      username: "beautyguru",
      avatar: "/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png"
    },
    description: "New makeup tutorial! This silver look is perfect for parties #makeup #beauty",
    likes: 3782,
    comments: 128,
    shares: 84,
    isLive: true
  },
  {
    id: "3",
    url: "https://assets.mixkit.co/videos/preview/mixkit-woman-dancing-happily-indoors-1226-large.mp4",
    user: {
      username: "dancequeen",
      avatar: "/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png"
    },
    description: "Trying out this new dance routine! What do you think? #dance #viral #fun",
    likes: 5921,
    comments: 230,
    shares: 103,
    isLive: false
  }
];

const HomePage = () => {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle swipe gesture for videos
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollTop = containerRef.current.scrollTop;
        const videoHeight = containerRef.current.clientHeight;
        const index = Math.round(scrollTop / videoHeight);
        setActiveVideoIndex(index);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory no-scrollbar"
    >
      {MOCK_VIDEOS.map((video, index) => (
        <div 
          key={video.id} 
          className="snap-start h-screen"
        >
          <VideoPlayer 
            video={video} 
            isActive={index === activeVideoIndex} 
          />
        </div>
      ))}
    </div>
  );
};

export default HomePage;
