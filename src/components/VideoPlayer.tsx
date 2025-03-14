
import { useRef, useState, useEffect } from "react";
import DoubleTapHandler from "./video/DoubleTapHandler";
import VideoPlaybackController from "./video/VideoPlaybackController";
import { useToast } from "@/hooks/use-toast";
import { useVideoError } from "@/hooks/useVideoError";
import VideoOverlay from "./video/VideoOverlay";
import VideoErrorDisplay from "./video/VideoErrorDisplay";

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
      {/* Video playback controller */}
      <VideoPlaybackController
        videoRef={videoRef}
        isActive={isActive && !videoError}
        onError={() => handleVideoError(video.url)}
        setIsPlaying={setIsPlaying}
      />

      {videoError ? (
        <VideoErrorDisplay 
          isLive={video.isLive} 
          onRetry={loadAttempts < 3 ? () => handleRetry(videoRef) : undefined}
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
            onError={() => handleVideoError(video.url)}
          />
          
          {/* Heart animation on double tap */}
          <DoubleTapHandler 
            showHeart={showHeart} 
            tapPosition={tapPosition} 
          />
        </>
      )}
      
      {/* Video overlay with user info and actions */}
      {!videoError && (
        <VideoOverlay 
          video={video}
          isLiked={video.isLiked || false} 
          isSaved={video.isSaved || false}
          onLike={onLike || (() => {})}
          onSave={onSave || (() => {})}
          onFollow={onFollow || (() => {})}
        />
      )}
    </div>
  );
};

export default VideoPlayer;
