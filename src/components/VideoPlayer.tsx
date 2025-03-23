
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  videoId?: string;
  videoUrl?: string;
  isActive?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  src, 
  poster, 
  autoPlay = true,
  videoId,
  videoUrl,
  isActive = true
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [hasAttemptedPlay, setHasAttemptedPlay] = useState(false);
  const [playbackError, setPlaybackError] = useState<Error | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [isMuted, setIsMuted] = useState(true); // Start muted to help with autoplay
  const [isLoading, setIsLoading] = useState(true);
  
  // Use src as primary source, fall back to videoUrl if src is not provided
  const videoSource = src || videoUrl || '';

  // Reset play attempt when source changes
  useEffect(() => {
    setHasAttemptedPlay(false);
    setPlaybackError(null);
    setAttemptCount(0);
    setIsLoading(true);
    
    // Force video reload when source changes
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [videoSource]);

  // Try to play the video when it becomes active
  useEffect(() => {
    if (!videoRef.current || !isActive || !videoSource) return;
    
    const playVideo = async () => {
      if (attemptCount > 3) return; // Don't keep trying indefinitely
      
      try {
        console.log(`Attempting to play video ${videoId || 'unknown'}, attempt ${attemptCount + 1}`);
        
        // Always set muted to help with autoplay (browser policies)
        videoRef.current.muted = true;
        videoRef.current.playsInline = true;
        
        // First make sure video is loaded
        if (videoRef.current.readyState < 2) {
          videoRef.current.load();
        }
        
        await videoRef.current.play();
        setIsPlaying(true);
        setPlaybackError(null);
        setIsLoading(false);
        console.log("Video playing successfully:", videoId || videoSource.substring(0, 30));
      } catch (error) {
        console.error("Error playing video:", error);
        setPlaybackError(error instanceof Error ? error : new Error('Unknown playback error'));
        setAttemptCount(count => count + 1);
        
        // If attempt failed and we haven't tried too many times
        if (attemptCount < 2) {
          setTimeout(() => {
            if (videoRef.current) {
              // Try with different attributes that might help with autoplay
              videoRef.current.muted = true;
              videoRef.current.playsInline = true;
              videoRef.current.load();
              setHasAttemptedPlay(false); // Reset to try again
            }
          }, 500);
        } else {
          setIsLoading(false);
        }
      } finally {
        setHasAttemptedPlay(true);
      }
    };

    // Only auto-play if video is active and we haven't attempted yet or if source changed
    if (isActive && videoRef.current && (!hasAttemptedPlay || videoRef.current.src !== videoSource)) {
      // Short delay to ensure the video element is fully loaded
      const timer = setTimeout(playVideo, 100);
      return () => clearTimeout(timer);
    }
  }, [isActive, videoSource, videoId, hasAttemptedPlay, attemptCount]);

  // Pause when not active
  useEffect(() => {
    if (!isActive && videoRef.current && isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive, isPlaying]);

  // Handle when video is clicked manually
  const handleVideoClick = () => {
    if (!videoRef.current) return;
    
    if (videoRef.current.paused) {
      videoRef.current.muted = false; // Unmute when user explicitly plays
      setIsMuted(false);
      videoRef.current.play().catch(error => {
        console.error("Error playing video after click:", error);
        setPlaybackError(error instanceof Error ? error : new Error('Unknown playback error'));
      });
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Handle video errors
  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error("Video error event:", e);
    const errorCode = videoRef.current?.error?.code;
    const errorMessage = videoRef.current?.error?.message;
    console.error(`Video error code: ${errorCode}, message: ${errorMessage}`);
    
    setPlaybackError(new Error(`Video could not be loaded (${errorCode})`));
    setAttemptCount(prev => prev + 1);
    setIsLoading(false);
    
    // Try to reload if we haven't tried too many times
    if (attemptCount < 2 && videoRef.current) {
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.load();
          setHasAttemptedPlay(false);
        }
      }, 750);
    }
  };
  
  // Handle when video data is loaded
  const handleVideoLoaded = () => {
    console.log("Video data loaded for:", videoId || videoSource.substring(0, 30));
    setIsLoading(false);
  };

  return (
    <div className="h-full w-full relative">
      {/* Loading spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="animate-spin h-8 w-8 border-4 border-app-yellow border-t-transparent rounded-full"></div>
        </div>
      )}
      
      {/* Show error UI when there's a playback error and we've tried multiple times */}
      {playbackError && attemptCount > 2 && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10">
          <div className="text-center p-4">
            <p className="text-red-400 mb-2">Unable to play video</p>
            <button 
              className="bg-app-yellow text-black px-4 py-2 rounded-full text-sm"
              onClick={() => {
                setHasAttemptedPlay(false);
                setPlaybackError(null);
                setAttemptCount(0);
                setIsLoading(true);
                // Try again
                if (videoRef.current) {
                  videoRef.current.load();
                }
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      )}
      
      <video
        ref={videoRef}
        src={videoSource}
        poster={poster}
        className="h-full w-full object-cover"
        loop
        muted={isMuted}
        playsInline
        autoPlay={autoPlay}
        preload="auto"
        onClick={handleVideoClick}
        onError={handleVideoError}
        onLoadedData={handleVideoLoaded}
      />
    </div>
  );
};

export default VideoPlayer;
