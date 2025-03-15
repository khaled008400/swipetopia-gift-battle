
import { useRef, useState, useEffect } from "react";
import VideoErrorDisplay from "./VideoErrorDisplay";

interface VideoPlayerCoreProps {
  videoUrl: string;
  isActive: boolean;
  onVideoPress: (e: React.MouseEvent<HTMLVideoElement, MouseEvent>) => void;
  onVideoError: () => void;
}

const VideoPlayerCore = ({ 
  videoUrl, 
  isActive, 
  onVideoPress, 
  onVideoError 
}: VideoPlayerCoreProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);

  const tryPlayVideo = async () => {
    if (!videoRef.current || !isActive || loadError) return;
    
    try {
      await videoRef.current.play();
      setIsPlaying(true);
    } catch (err) {
      console.error("Error playing video:", err);
      setIsPlaying(false);
      
      // Only increment attempts if it's a media error, not a user interaction error
      if (videoRef.current?.error) {
        setLoadAttempts(prev => prev + 1);
        if (loadAttempts >= 2) {
          setLoadError(true);
          onVideoError();
        }
      }
    }
  };

  const handleRetry = () => {
    if (videoRef.current) {
      setLoadError(false);
      videoRef.current.load();
      tryPlayVideo();
    }
  };

  const handleError = () => {
    console.error("Video error event triggered for:", videoUrl);
    setLoadAttempts(prev => prev + 1);
    
    if (loadAttempts >= 2) {
      setLoadError(true);
      onVideoError();
    } else {
      // Attempt to reload the video
      if (videoRef.current) {
        videoRef.current.load();
      }
    }
  };

  useEffect(() => {
    // Reset error state when video URL changes
    setLoadError(false);
    setLoadAttempts(0);
  }, [videoUrl]);

  useEffect(() => {
    if (isActive && !loadError) {
      tryPlayVideo();
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isActive, loadError]);

  return (
    <>
      {loadError ? (
        <VideoErrorDisplay 
          message="This video could not be loaded" 
          onRetry={handleRetry} 
        />
      ) : (
        <video 
          ref={videoRef} 
          src={videoUrl} 
          className="h-full w-full object-cover" 
          loop 
          muted 
          playsInline 
          onClick={onVideoPress}
          onError={handleError}
        />
      )}
    </>
  );
};

export default VideoPlayerCore;
