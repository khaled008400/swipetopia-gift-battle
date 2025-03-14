
import { useState, useEffect } from "react";
import VideoFeed from "@/components/VideoFeed";
import { ArrowLeft, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import VideoActions from "@/components/video/VideoActions";
import { VideoService } from "@/services/video.service";
import VideoUploadModal from "@/components/upload/VideoUploadModal";

const VideosPage = () => {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        const feedVideos = await VideoService.getFeedVideos();
        setVideos(feedVideos || []);
      } catch (error) {
        console.error("Error fetching videos:", error);
        // Fallback to example videos if API fails
        setVideos(exampleVideos);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Handle scroll to change videos
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
      if (diff > 50 && activeVideoIndex < videos.length - 1) {
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
  }, [activeVideoIndex, videos.length]);

  const handleVideoUpload = (videoId: string) => {
    console.log("New video uploaded:", videoId);
    setShowUploadModal(false);
    
    // In a real app, we would fetch the new video and add it to the feed
    // For this demo, we'll just show a success message
  };

  // Example video data - in a real app, this would come from an API
  const exampleVideos = [
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
      shares: 56,
      allowDownloads: true,
      isPublic: true
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
      allowDownloads: false,
      isPublic: true
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
      shares: 178,
      allowDownloads: true,
      isPublic: true
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
      
      {/* Upload button */}
      <div className="absolute top-4 right-4 z-30">
        <button 
          onClick={() => setShowUploadModal(true)}
          className="p-2 bg-app-yellow rounded-full shadow-lg"
        >
          <Plus className="w-5 h-5 text-black" />
        </button>
      </div>
      
      {/* Video actions */}
      <div className="absolute bottom-20 right-3 z-30">
        {videos[activeVideoIndex] && (
          <VideoActions 
            likes={videos[activeVideoIndex].likes} 
            comments={videos[activeVideoIndex].comments} 
            shares={videos[activeVideoIndex].shares}
            isLiked={false}
            onLike={() => {
              console.log('Video liked:', videos[activeVideoIndex]);
            }}
            videoId={videos[activeVideoIndex].id}
            allowDownloads={videos[activeVideoIndex].allowDownloads}
          />
        )}
      </div>

      {/* Upload Modal */}
      <VideoUploadModal 
        isOpen={showUploadModal} 
        onClose={() => setShowUploadModal(false)} 
        onSuccess={handleVideoUpload}
      />
    </div>
  );
};

export default VideosPage;
