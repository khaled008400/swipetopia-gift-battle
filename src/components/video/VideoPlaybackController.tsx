
import { useRef, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

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
  const [playAttempts, setPlayAttempts] = useState(0);
  const { toast } = useToast();
  
  const tryPlayVideo = async () => {
    if (!videoRef.current || !isActive) return;
    
    try {
      await videoRef.current.play();
      setIsPlaying(true);
      // Reset play attempts on successful play
      setPlayAttempts(0);
    } catch (err) {
      console.error("Error playing video:", err);
      setPlayAttempts(prev => prev + 1);
      
      // After multiple attempts, show an error toast
      if (playAttempts >= 2) {
        onError();
        setIsPlaying(false);
        toast({
          title: "Playback error",
          description: "There was a problem playing this video. Try again later.",
          variant: "destructive",
        });
      } else {
        // Try again with a delay
        setTimeout(() => {
          if (isActive && videoRef.current) {
            videoRef.current.load();
            videoRef.current.play().catch(() => onError());
          }
        }, 1000);
      }
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

  // Reset play attempts when video changes
  useEffect(() => {
    setPlayAttempts(0);
  }, [videoRef.current?.src]);

  return null; // This is a controller component with no UI
};

export default VideoPlaybackController;
