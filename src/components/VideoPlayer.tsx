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
    isLive?: boolean;
  };
  isActive?: boolean;
}
const VideoPlayer = ({
  video,
  isActive = false
}: VideoPlayerProps) => {
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
  return <div className="h-full w-full relative overflow-hidden">
      <video ref={videoRef} src={video.url} className="h-full w-full object-cover" loop muted playsInline onClick={handleVideoPress} />
      
      {/* Video overlay with user info and actions */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        <div className="flex justify-between items-end">
          <div className="flex-1 py-0 my--10">
            <div className="flex items-center gap-2">
              
              {video.isLive && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  LIVE
                </span>}
            </div>
            
            <p className="text-gray-300 text-sm mt-1 line-clamp-1">{video.description}</p>
            
            {showDetails && <div className="mt-2 animate-fade-in">
                <p className="text-gray-300 text-sm">{video.description}</p>
              </div>}
            
            <button className="text-gray-400 text-xs flex items-center mt-1" onClick={() => setShowDetails(!showDetails)}>
              {showDetails ? "Less" : "More"} <ChevronUp className={`ml-1 w-4 h-4 transition-transform ${showDetails ? "rotate-180" : ""}`} />
            </button>
            
            {/* User info */}
            <div className="mt-3 flex items-center">
              <img src={video.user.avatar} alt={video.user.username} className="w-10 h-10 rounded-full border-2 border-app-yellow" />
              <div className="ml-2">
                <p className="text-white text-sm font-bold">@{video.user.username}</p>
              </div>
              <button className="ml-auto bg-app-yellow text-app-black text-xs font-bold px-3 py-1 rounded-full">
                Follow
              </button>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-col space-y-5 ml-4">
            <div className="flex flex-col items-center" onClick={handleLike}>
              <div className={`w-10 h-10 rounded-full ${isLiked ? 'bg-red-500' : 'bg-black/50'} flex items-center justify-center`}>
                <Heart className={`h-6 w-6 ${isLiked ? 'text-white fill-current' : 'text-white'}`} />
              </div>
              <span className="text-white text-xs mt-1">{video.likes}</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <span className="text-white text-xs mt-1">{video.comments}</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center">
                <Share2 className="h-6 w-6 text-white" />
              </div>
              <span className="text-white text-xs mt-1">{video.shares}</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-app-yellow flex items-center justify-center">
                <Coins className="h-6 w-6 text-app-black" />
              </div>
              <span className="text-white text-xs mt-1">Gift</span>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default VideoPlayer;