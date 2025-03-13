
import { useRef, useState, useEffect } from "react";
import { Heart, MessageCircle, Share2, Coins, ChevronUp, VideoIcon, Home, Zap, User } from "lucide-react";

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
    isLive?: boolean;
  };
  isActive?: boolean;
}

const VideoPlayer = ({ video, isActive = false }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (isActive) {
      videoRef.current?.play();
      setIsPlaying(true);
    } else {
      videoRef.current?.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

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
      
      {/* Status bar */}
      <div className="absolute top-0 left-0 right-0 p-2 flex justify-between items-center z-10">
        <div className="text-xl font-bold text-white">9:41</div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-white rounded-full"></div>
          <div className="w-4 h-4 bg-white rounded-full"></div>
          <div className="w-4 h-4 bg-white rounded-full"></div>
        </div>
      </div>
      
      <div className="video-overlay flex flex-col mb-16">
        <div className="flex justify-between items-end">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-white font-semibold text-lg">@{video.user.username}</h3>
              {video.isLive && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                  <VideoIcon className="h-3 w-3" /> LIVE
                </span>
              )}
            </div>
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
            
            {/* Following button */}
            <div className="mt-2">
              <button className="bg-app-yellow text-app-black text-xs font-bold px-3 py-1 rounded-full">
                Follow
              </button>
            </div>
            
            {/* User stats */}
            <div className="mt-2 flex items-center">
              <img 
                src={video.user.avatar} 
                alt={video.user.username} 
                className="w-10 h-10 rounded-full border-2 border-app-yellow"
              />
              <div className="ml-2">
                <p className="text-white text-sm font-bold">New Fashion Store</p>
                <p className="text-gray-300 text-xs">890 People Online Now</p>
              </div>
            </div>
            
            <div className="mt-2">
              <p className="text-white text-xs">
                It is a long established fact that a reader will be distracted by the readable content during...
              </p>
            </div>
            
            {/* Viewer count */}
            <div className="mt-2 bg-black/50 rounded-full px-2 py-1 inline-flex items-center">
              <p className="text-white text-xs">
                <span className="text-app-yellow font-bold">1,200,023</span> viewers
              </p>
            </div>
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
      
      {/* Remove this bottom navigation section which was duplicating the main BottomNavigation component */}
    </div>
  );
};

export default VideoPlayer;
