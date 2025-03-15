
import { useRef, useState, useEffect } from "react";
import { Heart, MessageCircle, Share2, Bookmark, Flag, Download, User, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useVideoError } from "@/hooks/useVideoError";
import { Video } from "@/types/video.types";
import { cn } from "@/lib/utils";
import VideoErrorDisplay from "./video/VideoErrorDisplay";

interface VideoPlayerProps {
  video: Video;
  isActive?: boolean;
  onLike?: () => void;
  onSave?: () => void;
  onFollow?: () => void;
  onShare?: () => void;
  onComment?: () => void;
  onReport?: () => void;
  onDownload?: () => void;
}

const VideoPlayer = ({
  video,
  isActive = false,
  onLike,
  onSave,
  onFollow,
  onShare,
  onComment,
  onReport,
  onDownload
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tapPosition, setTapPosition] = useState({ x: 0, y: 0 });
  const [showHeart, setShowHeart] = useState(false);
  const [doubleTapTimer, setDoubleTapTimer] = useState<number | null>(null);
  const { toast } = useToast();
  const { videoError, loadAttempts, handleVideoError, handleRetry, resetError } = useVideoError();

  // Reset error state when video changes
  useEffect(() => {
    resetError();
    setIsLoading(true);
  }, [video.id, resetError]);

  // Handle video playback when active state changes
  useEffect(() => {
    if (isActive && !videoError) {
      const playVideo = async () => {
        try {
          if (videoRef.current) {
            // Make sure the video has loaded metadata before playing
            if (videoRef.current.readyState === 0) {
              await new Promise((resolve) => {
                videoRef.current!.onloadedmetadata = resolve;
              });
            }
            await videoRef.current.play();
            setIsPlaying(true);
            setIsLoading(false);
          }
        } catch (err) {
          console.error("Error auto-playing video:", err);
          handleVideoError(video.url);
          setIsLoading(false);
        }
      };
      
      playVideo();
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
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

  const onRetry = () => {
    if (videoRef.current) {
      resetError();
      setIsLoading(true);
      videoRef.current.load();
      
      // Try playing after a short delay
      setTimeout(() => {
        videoRef.current?.play().catch(err => {
          console.error("Error retrying video:", err);
          handleVideoError(video.url);
          setIsLoading(false);
        });
      }, 500);
    }
  };

  const handleVideoLoad = () => {
    setIsLoading(false);
  };

  // Fixed: Renamed to onVideoError to avoid duplicate declaration
  const onVideoError = () => {
    setIsLoading(false);
    handleVideoError(video.url);
  };

  return (
    <div className="h-full w-full relative overflow-hidden bg-black">
      {videoError ? (
        <VideoErrorDisplay 
          message={loadAttempts >= 3 
            ? "Unable to load this video after multiple attempts" 
            : "This video could not be played"
          }
          onRetry={loadAttempts < 3 ? onRetry : undefined}
        />
      ) : (
        <>
          {isLoading && !videoError && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-app-yellow"></div>
            </div>
          )}
          
          <video 
            ref={videoRef} 
            src={video.url} 
            className="h-full w-full object-cover" 
            loop 
            muted 
            playsInline 
            onClick={handleVideoPress}
            onError={onVideoError}
            onLoadedData={handleVideoLoad}
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
          
          {/* Side interaction buttons */}
          <div className="absolute right-3 bottom-32 flex flex-col items-center space-y-5 z-10">
            <div className="flex flex-col items-center">
              <button
                className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center"
                onClick={onLike}
              >
                <Heart
                  className={cn(
                    "h-6 w-6",
                    video.isLiked ? "fill-red-500 text-red-500" : "text-white"
                  )}
                />
              </button>
              <span className="text-white text-xs mt-1">{video.likes}</span>
            </div>

            <div className="flex flex-col items-center">
              <button
                className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center"
                onClick={onComment}
              >
                <MessageCircle className="h-6 w-6 text-white" />
              </button>
              <span className="text-white text-xs mt-1">{video.comments}</span>
            </div>

            <div className="flex flex-col items-center">
              <button
                className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center"
                onClick={onShare}
              >
                <Share2 className="h-6 w-6 text-white" />
              </button>
              <span className="text-white text-xs mt-1">{video.shares}</span>
            </div>

            <div className="flex flex-col items-center">
              <button
                className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center"
                onClick={onSave}
              >
                <Bookmark 
                  className={cn(
                    "h-6 w-6",
                    video.isSaved ? "fill-yellow-500 text-yellow-500" : "text-white"
                  )}
                />
              </button>
              <span className="text-white text-xs mt-1">Save</span>
            </div>

            {video.allowDownloads && (
              <div className="flex flex-col items-center">
                <button
                  className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center"
                  onClick={onDownload}
                >
                  <Download className="h-6 w-6 text-white" />
                </button>
                <span className="text-white text-xs mt-1">Download</span>
              </div>
            )}

            <div className="flex flex-col items-center">
              <button
                className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center"
                onClick={onReport}
              >
                <Flag className="h-6 w-6 text-white" />
              </button>
              <span className="text-white text-xs mt-1">Report</span>
            </div>
          </div>

          {/* User info and video description */}
          <div className="absolute bottom-0 left-0 right-14 p-4 bg-gradient-to-t from-black/80 to-transparent z-10">
            <div className="flex items-center mb-3">
              <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-white">
                <img src={video.user.avatar} alt={video.user.username} className="h-full w-full object-cover" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-white font-bold">@{video.user.username}</p>
                {video.isLive && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full inline-block mr-2">
                    LIVE
                  </span>
                )}
              </div>
              <button
                onClick={onFollow}
                className={cn(
                  "px-3 py-1 rounded-full text-sm",
                  video.user.isFollowing
                    ? "bg-transparent border border-white text-white"
                    : "bg-white text-black"
                )}
              >
                {video.user.isFollowing ? "Following" : "Follow"}
              </button>
            </div>
            <p className="text-white mb-4 overflow-hidden text-ellipsis">
              {video.description}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default VideoPlayer;
