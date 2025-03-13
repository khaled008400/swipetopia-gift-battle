
import { useRef, useState, useEffect } from "react";
import { Heart, MessageCircle, Share2, Coins, ChevronUp } from "lucide-react";

interface VideoPlayerProps {
  video: {
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
  };
}

const VideoPlayer = ({ video }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.8,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          videoRef.current?.play();
          setIsPlaying(true);
        } else {
          videoRef.current?.pause();
          setIsPlaying(false);
        }
      });
    }, options);

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  const handleVideoPress = () => {
    if (isPlaying) {
      videoRef.current?.pause();
      setIsPlaying(false);
    } else {
      videoRef.current?.play();
      setIsPlaying(true);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <div className="swipe-video-item">
      <video
        ref={videoRef}
        src={video.url}
        className="h-full w-full object-cover"
        loop
        muted
        playsInline
        onClick={handleVideoPress}
      />
      
      <div className="video-overlay flex flex-col">
        <div className="flex justify-between items-end">
          <div className="flex-1">
            <h3 className="text-white font-semibold text-lg">@{video.user.username}</h3>
            <p className="text-gray-300 text-sm line-clamp-1">{video.description}</p>
            {showDetails && (
              <div className="mt-2 animate-fade-in">
                <p className="text-gray-300 text-sm">{video.description}</p>
              </div>
            )}
            <button 
              className="text-gray-400 text-xs flex items-center mt-1"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? "Less" : "More"} <ChevronUp className={`ml-1 w-4 h-4 transition-transform ${showDetails ? "rotate-180" : ""}`} />
            </button>
          </div>
          
          <div className="flex flex-col space-y-4">
            <div className="video-action-button" onClick={handleLike}>
              <div className={`w-10 h-10 rounded-full ${isLiked ? 'bg-red-500' : 'bg-black/50'} flex items-center justify-center`}>
                <Heart className={`h-6 w-6 ${isLiked ? 'text-white fill-current' : 'text-white'}`} />
              </div>
              <span className="text-white text-xs mt-1">{video.likes}</span>
            </div>
            
            <div className="video-action-button">
              <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <span className="text-white text-xs mt-1">{video.comments}</span>
            </div>
            
            <div className="video-action-button">
              <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center">
                <Share2 className="h-6 w-6 text-white" />
              </div>
              <span className="text-white text-xs mt-1">{video.shares}</span>
            </div>
            
            <div className="video-action-button">
              <div className="w-10 h-10 rounded-full bg-app-yellow flex items-center justify-center">
                <Coins className="h-6 w-6 text-app-black" />
              </div>
              <span className="text-white text-xs mt-1">Gift</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute top-10 right-4 z-10">
        <div className="flex items-center bg-black/50 rounded-full px-3 py-1">
          <Coins className="h-4 w-4 text-app-yellow mr-1" />
          <span className="text-white text-xs">1000</span>
        </div>
      </div>
      
      <div className="absolute top-4 left-4 z-10 flex items-center">
        <div className="text-xl font-bold text-white">SWIPETOPIA</div>
      </div>
    </div>
  );
};

export default VideoPlayer;
