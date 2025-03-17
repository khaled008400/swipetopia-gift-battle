import { useEffect, useState } from "react";
import PopularLiveSection from "../components/PopularLiveSection";
import TrendingVideosSection from "../components/TrendingVideosSection";
import UserVideosCarousel from "../components/UserVideosCarousel";
import VideoFeed from "../components/VideoFeed";
import { useAuth } from "../context/AuthContext";
import { Video } from "@/types/video.types";

const Index = () => {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const { user } = useAuth();
  
  // Example video data - in a real app, this would come from an API
  const videos: Video[] = [
    {
      id: "1",
      title: "Fashion collection",
      description: "Check out my new collection! #fashion #style #trending",
      video_url: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-waving-on-a-video-call-43892-large.mp4",
      thumbnail_url: "",
      user_id: "user1",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      view_count: 5000,
      likes_count: 1243,
      comments_count: 89,
      shares_count: 56,
      is_live: false,
      is_private: false,
      duration: 120,
      category: "fashion",
      url: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-waving-on-a-video-call-43892-large.mp4",
      likes: 1243,
      comments: 89,
      shares: 56,
      user: {
        username: "fashionista",
        avatar: "/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png"
      }
    },
    {
      id: "2",
      title: "Makeup tutorial",
      description: "New makeup tutorial for the weekend party! #makeup #glam",
      video_url: "https://assets.mixkit.co/videos/preview/mixkit-portrait-of-a-fashion-woman-with-silver-makeup-39875-large.mp4",
      thumbnail_url: "",
      user_id: "user2",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      view_count: 8000,
      likes_count: 2467,
      comments_count: 134,
      shares_count: 89,
      is_live: true,
      is_private: false,
      duration: 180,
      category: "beauty",
      url: "https://assets.mixkit.co/videos/preview/mixkit-portrait-of-a-fashion-woman-with-silver-makeup-39875-large.mp4",
      likes: 2467,
      comments: 134,
      shares: 89,
      isLive: true,
      user: {
        username: "makeup_artist",
        avatar: "/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png"
      }
    },
    {
      id: "3",
      title: "Bali Travel",
      description: "Sunset vibes in Bali 🌴 #travel #sunset #bali",
      video_url: "https://assets.mixkit.co/videos/preview/mixkit-girl-dancing-happily-in-a-field-at-sunset-1230-large.mp4",
      thumbnail_url: "",
      user_id: "user3",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      view_count: 12000,
      likes_count: 5698,
      comments_count: 241,
      shares_count: 178,
      is_live: false,
      is_private: false,
      duration: 150,
      category: "travel",
      url: "https://assets.mixkit.co/videos/preview/mixkit-girl-dancing-happily-in-a-field-at-sunset-1230-large.mp4",
      likes: 5698,
      comments: 241,
      shares: 178,
      user: {
        username: "travel_vibes",
        avatar: "/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png"
      }
    }
  ];

  // User-created videos for swappable section, with following info
  const userCreatedVideos = [
    {
      id: "4",
      title: "Woman running",
      thumbnail: "https://images.unsplash.com/photo-1580477667995-2b94f01c9516",
      username: "runner_girl",
      isFollowing: true
    },
    {
      id: "5",
      title: "Man dancing",
      thumbnail: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7",
      username: "dance_king",
      isFollowing: false
    },
    {
      id: "6",
      title: "Woman vlogging",
      thumbnail: "https://images.unsplash.com/photo-1488161628813-04466f872be2",
      username: "travel_vlogger",
      isFollowing: true
    },
    {
      id: "7",
      title: "Man cooking",
      thumbnail: "https://images.unsplash.com/photo-1556910103-1c02745aae4d",
      username: "chef_master",
      isFollowing: true
    }
  ];

  // Popular live creators
  const liveCreators = [
    { id: "1", avatar: "/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png", name: "John" },
    { id: "2", avatar: "/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png", name: "Emma" },
    { id: "3", avatar: "/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png", name: "Maria" },
    { id: "4", avatar: "/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png", name: "Sam" },
    { id: "5", avatar: "/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png", name: "Alex" },
  ];

  // Trending videos
  const trendingVideos = [
    { id: "1", thumbnail: "https://images.unsplash.com/photo-1618886614638-80e3c103d31a", username: "fashionista" },
    { id: "2", thumbnail: "https://images.unsplash.com/photo-1618886614638-80e3c103d31a", username: "styleguru" },
    { id: "3", thumbnail: "https://images.unsplash.com/photo-1618886614638-80e3c103d31a", username: "trending" },
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
      {/* Component-based layout - these components are positioned absolutely */}
      <PopularLiveSection creators={liveCreators} />
      <TrendingVideosSection videos={trendingVideos} />
      <UserVideosCarousel videos={userCreatedVideos} title="Following" />
      
      {/* The VideoFeed is the main background content with z-index below the UI components */}
      <VideoFeed videos={videos} activeVideoIndex={activeVideoIndex} />
    </div>
  );
};

export default Index;
