
import { useRef, useState, useEffect } from "react";
import { Heart, MessageCircle, Share2, Bookmark, Flag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useVideoError } from "@/hooks/useVideoError";

interface VideoPlayerProps {
  video: {
    id: string;
    url: string;
    user: {
      username: string;
      avatar: string;
      isFollowing?: boolean;
    };
    description: string;
    likes: number;
    comments: number;
    shares: number;
    isLive?: boolean;
    isLiked?: boolean;
    allowDownloads?: boolean;
    isSaved?: boolean;
  };
  isActive?: boolean;
  onLike?: () => void;
  onSave?: () => void;
  onFollow?: () => void;
}

const VideoPlayer = ({
  video,
  isActive = false,
  onLike,
  onSave,
  onFollow
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tapPosition, setTapPosition] = useState({ x: 0, y: 0 });
  const [showHeart, setShowHeart] = useState(false);
  const [doubleTapTimer, setDoubleTapTimer] = useState<number | null>(null);
  const { toast } = useToast();
  const { videoError, loadAttempts, handleVideoError, handleRetry, resetError } = useVideoError();

  // Reset error state when video changes
  useEffect(() => {
    resetError();
  }, [video.id, resetError]);

  // Handle video playback when active state changes
  useEffect(() => {
    if (isActive && !videoError) {
      videoRef.current?.play().catch(err => {
        console.error("Error auto-playing video:", err);
        handleVideoError(video.url);
      });
      setIsPlaying(true);
    } else {
      videoRef.current?.pause();
      setIsPlaying(false);
    }
  }, [isActive, videoError, video.url, handleVideoError]);

  const handleVideoPress = (e: React.MouseEvent<HTMLVideoElement, MouseEvent>) => {
    if (videoError) return;
    
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    setTapPosition({ x, y });

    // Check for double tap
    if (doubleTapTimer) {
      // Double tap occurred
      clearTimeout(doubleTapTimer);
      setDoubleTapTimer(null);
      handleDoubleTap();
    } else {
      // First tap, wait for potential second tap
      const timer = window.setTimeout(() => {
        // Single tap after timeout
        setDoubleTapTimer(null);
        
        // Toggle play/pause on single tap
        if (isPlaying) {
          videoRef.current?.pause();
          setIsPlaying(false);
        } else {
          videoRef.current?.play().catch(err => {
            console.error("Error on manual play:", err);
            handleVideoError(video.url);
          });
          setIsPlaying(true);
        }
      }, 300); // 300ms timeout for double tap detection
      
      setDoubleTapTimer(timer);
    }
  };

  const handleDoubleTap = () => {
    // Like/unlike the video
    if (onLike) {
      onLike();
    }
    
    // Show heart animation
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  };

  return (
    <div className="h-full w-full relative overflow-hidden">
      {videoError ? (
        <div className="h-full w-full flex items-center justify-center bg-black">
          <div className="text-center p-4">
            <p className="text-white text-lg mb-3">
              {loadAttempts >= 3 
                ? "Unable to load video after multiple attempts" 
                : "Error loading video"}
            </p>
            
            {loadAttempts < 3 && (
              <button 
                onClick={() => {
                  if (videoRef.current) {
                    resetError();
                    videoRef.current.load();
                    videoRef.current.play().catch(err => {
                      console.error("Error retrying video:", err);
                      handleVideoError(video.url);
                    });
                  }
                }}
                className="bg-white text-black px-4 py-2 rounded-full font-medium"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <video 
            ref={videoRef} 
            src={video.url} 
            className="h-full w-full object-cover" 
            loop 
            muted 
            playsInline 
            onClick={handleVideoPress}
            onError={() => handleVideoError(video.url)}
          />
          
          {/* Double tap heart animation */}
          {showHeart && (
            <div 
              className="absolute z-20" 
              style={{ 
                top: tapPosition.y - 40, 
                left: tapPosition.x - 40,
                animation: "scale-in 0.5s ease-out forwards, fade-out 0.5s ease-out 0.3s forwards" 
              }}
            >
              <div className="text-red-500 opacity-80">
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </div>
            </div>
          )}
          
          {/* Simplified video controls and info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 pb-16 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <div className="flex justify-between items-end">
              {/* Video info and user section */}
              <div className="flex-1">
                {video.isLive && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full mb-2 inline-block">
                    LIVE
                  </span>
                )}
                
                <p className="text-white text-sm mb-3">{video.description}</p>
                
                <div className="flex items-center">
                  <img 
                    src={video.user.avatar} 
                    alt={video.user.username} 
                    className="w-10 h-10 rounded-full border-2 border-white" 
                  />
                  <div className="ml-2">
                    <p className="text-white text-sm font-bold">@{video.user.username}</p>
                  </div>
                  <button 
                    onClick={onFollow}
                    className={`ml-3 px-3 py-1 rounded-full text-xs ${
                      video.user.isFollowing 
                        ? "bg-transparent border border-white text-white" 
                        : "bg-white text-black"
                    }`}
                  >
                    {video.user.isFollowing ? "Following" : "Follow"}
                  </button>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex flex-col items-center space-y-4 ml-4">
                <div className="flex flex-col items-center">
                  <button 
                    onClick={onLike}
                    className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center"
                  >
                    <Heart 
                      className={`h-6 w-6 ${video.isLiked ? "fill-red-500 text-red-500" : "text-white"}`} 
                    />
                  </button>
                  <span className="text-white text-xs mt-1">{video.likes}</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <button 
                    className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center"
                  >
                    <MessageCircle className="h-6 w-6 text-white" />
                  </button>
                  <span className="text-white text-xs mt-1">{video.comments}</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <button 
                    className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center"
                  >
                    <Share2 className="h-6 w-6 text-white" />
                  </button>
                  <span className="text-white text-xs mt-1">{video.shares}</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <button 
                    onClick={onSave}
                    className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center"
                  >
                    <Bookmark className={`h-6 w-6 ${video.isSaved ? "fill-yellow-500 text-yellow-500" : "text-white"}`} />
                  </button>
                  <span className="text-white text-xs mt-1">Save</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <button 
                    className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center"
                  >
                    <Flag className="h-6 w-6 text-white" />
                  </button>
                  <span className="text-white text-xs mt-1">Report</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VideoPlayer;
