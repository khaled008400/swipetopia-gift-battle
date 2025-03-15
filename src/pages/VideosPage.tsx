
import { useState, useEffect } from "react";
import VideoFeed from "@/components/VideoFeed";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import VideoActions from "@/components/video/VideoActions";
import { VideoService } from "@/services/video.service";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

// Use more reliable video sources
const RELIABLE_VIDEOS = [
  "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", 
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
];

const VideosPage = () => {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch videos when component mounts or when navigating to this page
  const fetchVideos = async () => {
    try {
      setIsLoading(true);
      const feedVideos = await VideoService.getFeedVideos();
      
      // Ensure we have valid videos with proper URLs
      if (feedVideos?.length > 0) {
        console.log("Fetched videos:", feedVideos);
        setVideos(feedVideos);
      } else {
        // Fallback to example videos with reliable sources
        console.log("Using fallback videos due to empty response");
        setVideos(exampleVideos);
        toast({
          title: "Using example videos",
          description: "Using reliable example videos for demonstration.",
          variant: "default",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
      // Fallback to example videos with reliable sources
      setVideos(exampleVideos);
      toast({
        title: "Using fallback videos",
        description: "Could not load videos from server. Using example videos instead.",
        variant: "default",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Set up an event listener to refresh videos when navigating to this page
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && window.location.pathname === '/videos') {
        fetchVideos();
      }
    };

    // Initial fetch
    fetchVideos();

    // Add listener for visibility changes (when returning to this tab)
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Listen for route changes
    const handleRouteChange = () => {
      if (window.location.pathname === '/videos') {
        fetchVideos();
      }
    };
    
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [toast]);

  // Handle scroll to change videos - only when on the video page itself
  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      // Only control scroll for video navigation in the videos page view
      if (window.location.pathname === '/videos') {
        if (e.deltaY > 0 && activeVideoIndex < videos.length - 1) {
          setActiveVideoIndex(prev => prev + 1);
        } else if (e.deltaY < 0 && activeVideoIndex > 0) {
          setActiveVideoIndex(prev => prev - 1);
        }
      }
    };

    window.addEventListener('wheel', handleScroll);
    
    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, [activeVideoIndex, videos.length]);

  // Handle touch swipe for mobile - only when on the video page itself
  useEffect(() => {
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;

      // Only control touch for video navigation in the videos page view
      if (window.location.pathname === '/videos') {
        // Swipe up - go to next video
        if (diff > 50 && activeVideoIndex < videos.length - 1) {
          setActiveVideoIndex(prev => prev + 1);
        }
        // Swipe down - go to previous video
        else if (diff < -50 && activeVideoIndex > 0) {
          setActiveVideoIndex(prev => prev - 1);
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeVideoIndex, videos.length]);

  // Example video data with reliable sources
  const exampleVideos = [
    {
      id: "1",
      url: RELIABLE_VIDEOS[0],
      user: {
        id: "user1",
        username: "fashionista",
        avatar: "/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png",
        isFollowing: false
      },
      description: "Check out my new collection! #fashion #style #trending",
      likes: 1243,
      comments: 89,
      shares: 56,
      allowDownloads: true,
      isPublic: true,
      isSaved: false,
      isLiked: false
    },
    {
      id: "2",
      url: RELIABLE_VIDEOS[1],
      user: {
        id: "user2",
        username: "makeup_artist",
        avatar: "/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png",
        isFollowing: true
      },
      description: "New makeup tutorial for the weekend party! #makeup #glam",
      likes: 2467,
      comments: 134,
      shares: 89,
      allowDownloads: false,
      isPublic: true,
      isSaved: true,
      isLiked: true
    },
    {
      id: "3",
      url: RELIABLE_VIDEOS[2],
      user: {
        id: "user3",
        username: "travel_vibes",
        avatar: "/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png",
        isFollowing: false
      },
      description: "Sunset vibes in Bali 🌴 #travel #sunset #bali",
      likes: 5698,
      comments: 241,
      shares: 178,
      allowDownloads: true,
      isPublic: true,
      isSaved: false,
      isLiked: false
    }
  ];

  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden bg-gradient-to-b from-[#1A1F2C] to-black relative">
      {/* Videos container */}
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-app-yellow"></div>
        </div>
      ) : (
        <VideoFeed videos={videos.length > 0 ? videos : exampleVideos} activeVideoIndex={activeVideoIndex} />
      )}
      
      {/* Back button and page title */}
      <div className="absolute top-4 left-4 z-30 flex items-center">
        <Link to="/">
          <button className="mr-3 p-2 bg-black/40 backdrop-blur-md rounded-full border border-white/20 shadow-lg">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
        </Link>
        <h1 className="text-white font-bold text-lg">
          Videos
        </h1>
      </div>
      
      {/* Video actions */}
      <div className="absolute bottom-20 right-3 z-30">
        {videos[activeVideoIndex] && (
          <VideoActions 
            likes={videos[activeVideoIndex].likes} 
            comments={videos[activeVideoIndex].comments} 
            shares={videos[activeVideoIndex].shares}
            isLiked={videos[activeVideoIndex].isLiked || false}
            onLike={() => {
              console.log('Video liked:', videos[activeVideoIndex]);
              // Create a new array with updated liked status
              const updatedVideos = [...videos];
              updatedVideos[activeVideoIndex] = {
                ...updatedVideos[activeVideoIndex],
                isLiked: !updatedVideos[activeVideoIndex].isLiked,
                likes: updatedVideos[activeVideoIndex].isLiked 
                  ? updatedVideos[activeVideoIndex].likes - 1 
                  : updatedVideos[activeVideoIndex].likes + 1
              };
              setVideos(updatedVideos);
            }}
            videoId={videos[activeVideoIndex].id}
            allowDownloads={videos[activeVideoIndex].allowDownloads}
            isSaved={videos[activeVideoIndex].isSaved || false}
            onSave={() => {
              // Create a new array with updated saved status
              const updatedVideos = [...videos];
              updatedVideos[activeVideoIndex] = {
                ...updatedVideos[activeVideoIndex],
                isSaved: !updatedVideos[activeVideoIndex].isSaved
              };
              setVideos(updatedVideos);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default VideosPage;
