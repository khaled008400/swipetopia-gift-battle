
import { useState, useCallback } from "react";
import { useToast } from "./use-toast";

/**
 * Custom hook for handling video loading errors
 */
export function useVideoError() {
  const [videoError, setVideoError] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const [lastErrorTime, setLastErrorTime] = useState(0);
  const { toast } = useToast();

  const handleVideoError = useCallback((videoUrl: string) => {
    console.error("Video failed to load:", videoUrl);
    setVideoError(true);
    
    // Only show toast if we haven't shown one in the last 5 seconds
    const now = Date.now();
    if (now - lastErrorTime > 5000) {
      setLastErrorTime(now);
      toast({
        title: "Video Error",
        description: "Unable to load the video. Please try again later.",
        variant: "destructive",
        duration: 3000,
      });
    }
  }, [toast, lastErrorTime]);

  const handleRetry = useCallback((videoRef: React.RefObject<HTMLVideoElement>) => {
    setLoadAttempts(prev => prev + 1);
    setVideoError(false);
    
    // Force reload the video element
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, []);

  const resetError = useCallback(() => {
    setVideoError(false);
    setLoadAttempts(0);
  }, []);

  return {
    videoError,
    loadAttempts,
    handleVideoError,
    handleRetry,
    resetError,
    setVideoError
  };
}
