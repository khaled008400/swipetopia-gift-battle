
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import VideoPlayer from "@/components/VideoPlayer";
import { Heart, MessageCircle, Share2 } from "lucide-react";

interface Video {
  id: string;
  url: string;
  user: {
    username: string;
    avatar: string;
  };
  description: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked?: boolean;
}

const VIDEOS: Video[] = [
  {
    id: "1",
    url: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    user: {
      username: "dancequeen",
      avatar: "https://i.pravatar.cc/150?img=1"
    },
    description: "Dance Battle Finals 🏆 #dance #competition #finals",
    likes: 1432,
    comments: 87,
    shares: 34,
    isLiked: false
  },
  {
    id: "2",
    url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    user: {
      username: "groovyking",
      avatar: "https://i.pravatar.cc/150?img=2"
    },
    description: "My entry for the dance battle! Vote if you like it 🔥 #dancebattle #hiphop",
    likes: 2651,
    comments: 132,
    shares: 76,
    isLiked: false
  },
  {
    id: "3",
    url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    user: {
      username: "lipqueen",
      avatar: "https://i.pravatar.cc/150?img=3"
    },
    description: "Freestyle Rap Challenge - Round 1 🎤 #rap #freestyle #competition",
    likes: 3219,
    comments: 201,
    shares: 97,
    isLiked: false
  },
  {
    id: "4",
    url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    user: {
      username: "lyricalgenius",
      avatar: "https://i.pravatar.cc/150?img=4"
    },
    description: "Responding to @lipqueen's challenge. Let's go! 🔥 #rapbattle #bars",
    likes: 2876,
    comments: 143,
    shares: 87,
    isLiked: false
  },
  {
    id: "5",
    url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    user: {
      username: "fashionista",
      avatar: "https://i.pravatar.cc/150?img=5"
    },
    description: "Fashion Face-Off Entry 👗 #fashion #style #competition",
    likes: 4532,
    comments: 234,
    shares: 123,
    isLiked: false
  },
];

const VideoPage = () => {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [videos, setVideos] = useState<Video[]>(VIDEOS);
  const { toast } = useToast();

  // Handle swipe/scroll to change videos
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

  const handleLike = () => {
    const updatedVideos = [...videos];
    const video = updatedVideos[activeVideoIndex];
    video.isLiked = !video.isLiked;
    video.likes = video.isLiked ? video.likes + 1 : video.likes - 1;
    setVideos(updatedVideos);
    
    toast({
      title: video.isLiked ? "Added like" : "Removed like",
      description: video.isLiked ? "You've liked this video" : "You've removed your like from this video",
      duration: 2000,
    });
  };

  // Video progress indicators
  const renderProgressIndicators = () => {
    return (
      <div className="absolute top-4 left-0 right-0 z-20 flex justify-center gap-1">
        {videos.map((_, index) => (
          <div 
            key={index}
            className={`h-1 rounded-full ${
              index === activeVideoIndex ? "bg-white w-6" : "bg-white/30 w-4"
            } transition-all duration-200`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden bg-black relative">
      {/* Videos */}
      <div className="h-full w-full">
        {videos.map((video, index) => (
          <div
            key={video.id}
            className={`absolute top-0 left-0 h-full w-full transition-opacity duration-300 ${
              index === activeVideoIndex ? "opacity-100 z-10" : "opacity-0 -z-10"
            }`}
          >
            <video
              src={video.url}
              className="h-full w-full object-cover"
              autoPlay={index === activeVideoIndex}
              loop
              muted
              playsInline
            />
            
            {/* Video overlay with user info */}
            <div className="absolute bottom-24 left-4 z-20 max-w-[70%]">
              <h3 className="text-white font-bold text-lg">{video.user.username}</h3>
              <p className="text-white text-sm mt-1">{video.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Progress indicators */}
      {renderProgressIndicators()}
      
      {/* Action buttons */}
      <div className="absolute bottom-24 right-4 z-20 flex flex-col items-center gap-6">
        <button 
          onClick={handleLike}
          className="flex flex-col items-center"
        >
          <div className={`p-2 rounded-full ${videos[activeVideoIndex]?.isLiked ? 'text-red-500' : 'text-white'}`}>
            <Heart className="w-7 h-7" fill={videos[activeVideoIndex]?.isLiked ? "currentColor" : "none"} />
          </div>
          <span className="text-white text-xs mt-1">{videos[activeVideoIndex]?.likes}</span>
        </button>
        
        <button className="flex flex-col items-center">
          <div className="p-2 rounded-full text-white">
            <MessageCircle className="w-7 h-7" />
          </div>
          <span className="text-white text-xs mt-1">{videos[activeVideoIndex]?.comments}</span>
        </button>
        
        <button className="flex flex-col items-center">
          <div className="p-2 rounded-full text-white">
            <Share2 className="w-7 h-7" />
          </div>
          <span className="text-white text-xs mt-1">{videos[activeVideoIndex]?.shares}</span>
        </button>
      </div>
    </div>
  );
};

export default VideoPage;
