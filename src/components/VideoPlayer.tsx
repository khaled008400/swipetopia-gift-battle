
import { useRef, useState, useEffect } from "react";
import VideoOverlay from "./video/VideoOverlay";
import VideoErrorDisplay from "./video/VideoErrorDisplay";
import { useToast } from "@/hooks/use-toast";

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
    isLiked?: boolean;
  };
  isActive?: boolean;
}

const VideoPlayer = ({
  video,
  isActive = false
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(video.isLiked || false);
  const [videoError, setVideoError] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const [doubleTapTimer, setDoubleTapTimer] = useState<number | null>(null);
  const [tapPosition, setTapPosition] = useState({ x: 0, y: 0 });
  const [showHeart, setShowHeart] = useState(false);
  const { toast } = useToast();

  const tryPlayVideo = async () => {
    if (!videoRef.current || !isActive) return;
    
    try {
      setVideoError(false);
      await videoRef.current.play();
      setIsPlaying(true);
    } catch (err) {
      console.error("Error playing video:", err);
      setVideoError(true);
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (isActive && !videoError) {
      tryPlayVideo();
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isActive, videoError]);

  // Reset error state when video changes
  useEffect(() => {
    setVideoError(false);
    setLoadAttempts(0);
    setIsLiked(video.isLiked || false);
  }, [video.id, video.isLiked]);

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
            setVideoError(true);
          });
          setIsPlaying(true);
        }
      }, 300); // 300ms timeout for double tap detection
      
      setDoubleTapTimer(timer);
    }
  };

  const handleDoubleTap = () => {
    // Like/unlike the video
    setIsLiked(prev => !prev);
    
    // Show heart animation
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
    
    toast({
      title: isLiked ? "Removed like" : "Added like",
      description: isLiked ? "You've removed your like from this video" : "You've liked this video",
      duration: 2000,
    });
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    
    toast({
      title: isLiked ? "Removed like" : "Added like",
      description: isLiked ? "You've removed your like from this video" : "You've liked this video",
      duration: 2000,
    });
  };

  const handleComment = () => {
    toast({
      title: "Comments",
      description: "Comment feature will be implemented soon",
      duration: 2000,
    });
  };

  const handleShare = () => {
    toast({
      title: "Share",
      description: "Share feature will be implemented soon",
      duration: 2000,
    });
  };

  const handleVideoError = () => {
    console.error("Video failed to load:", video.url);
    setVideoError(true);
  };

  const handleRetry = () => {
    setLoadAttempts(prev => prev + 1);
    setVideoError(false);
    
    // Force reload the video element
    if (videoRef.current) {
      videoRef.current.load();
      tryPlayVideo();
    }
  };

  return (
    <div className="h-full w-full relative overflow-hidden">
      {videoError ? (
        <VideoErrorDisplay 
          isLive={video.isLive} 
          onRetry={loadAttempts < 3 ? handleRetry : undefined}
          message={loadAttempts >= 3 ? "Unable to load video after multiple attempts" : undefined}
        />
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
            onError={handleVideoError}
          />
          
          {/* Heart animation on double tap */}
          {showHeart && (
            <div 
              className="absolute z-20 animate-scale-in" 
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
        </>
      )}
      
      {/* Video overlay with user info and actions */}
      {!videoError && (
        <VideoOverlay 
          video={{...video, isLiked}}
          isLiked={isLiked} 
          onLike={handleLike}
        />
      )}
    </div>
  );
};

export default VideoPlayer;
