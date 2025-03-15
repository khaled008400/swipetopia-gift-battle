
import { useState, useCallback, useRef } from "react";
import { useToast } from "./use-toast";

/**
 * Custom hook for handling video loading errors
 */
export function useVideoError() {
  const [videoError, setVideoError] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const lastErrorTimeRef = useRef<number>(0);
  const { toast } = useToast();

  const handleVideoError = useCallback((videoUrl: string) => {
    console.error("Video failed to load:", videoUrl);
    setVideoError(true);
    setLoadAttempts(prev => prev + 1);
    
    // Only show toast if we haven't shown one in the last 5 seconds
    const now = Date.now();
    if (now - lastErrorTimeRef.current > 5000) {
      lastErrorTimeRef.current = now;
      toast({
        title: "Video Error",
        description: "Unable to load the video. Please try again later.",
        variant: "destructive",
        duration: 3000,
      });
    }
  }, [toast]);

  const handleRetry = useCallback((videoRef: React.RefObject<HTMLVideoElement>) => {
    setLoadAttempts(prev => prev + 1);
    setVideoError(false);
    
    // Force reload the video element
    if (videoRef.current) {
      videoRef.current.load();
      
      // Try to play after a short delay, with progressive backoff
      const delay = loadAttempts === 0 ? 500 : loadAttempts * 1000;
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch(err => {
            console.error("Error on retry play:", err);
          });
        }
      }, Math.min(delay, 3000)); // Cap max delay at 3 seconds
    }
  }, [loadAttempts]);

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
