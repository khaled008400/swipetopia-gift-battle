
import { useRef, useState, useEffect } from "react";

interface VideoPlaybackControllerProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isActive: boolean;
  onError: () => void;
  setIsPlaying: (isPlaying: boolean) => void;
}

const VideoPlaybackController = ({ 
  videoRef, 
  isActive, 
  onError, 
  setIsPlaying 
}: VideoPlaybackControllerProps) => {
  
  const tryPlayVideo = async () => {
    if (!videoRef.current || !isActive) return;
    
    try {
      await videoRef.current.play();
      setIsPlaying(true);
    } catch (err) {
      console.error("Error playing video:", err);
      onError();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (isActive) {
      tryPlayVideo();
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isActive]);

  return null; // This is a controller component with no UI
};

export default VideoPlaybackController;
