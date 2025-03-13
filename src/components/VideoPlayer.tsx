
import { useRef, useState, useEffect } from "react";
import VideoOverlay from "./video/VideoOverlay";
import VideoErrorDisplay from "./video/VideoErrorDisplay";

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
  const [videoError, setVideoError] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);

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
  }, [video.id]);

  const handleVideoPress = () => {
    if (videoError) return;
    
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
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
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
      )}
      
      {/* Video overlay with user info and actions */}
      {!videoError && (
        <VideoOverlay 
          video={video} 
          isLiked={isLiked} 
          onLike={handleLike} 
        />
      )}
    </div>
  );
};

export default VideoPlayer;
