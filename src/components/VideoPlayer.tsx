
import React, { useEffect, useRef, useState } from "react";

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
  autoPlay = false,
  videoId,
  videoUrl,
  isActive = true // Default to active for non-feed videos
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [hasAttemptedPlay, setHasAttemptedPlay] = useState(false);
  const [playbackError, setPlaybackError] = useState<Error | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  
  // Use src as primary source, fall back to videoUrl if src is not provided
  const videoSource = src || videoUrl || '';

  // Try to play the video when it becomes active
  useEffect(() => {
    if (!videoRef.current || !isActive) return;
    
    const playVideo = async () => {
      if (attemptCount > 3) return; // Don't keep trying indefinitely
      
      try {
        // Set muted attribute to allow autoplay in most browsers
        videoRef.current.muted = true;
        videoRef.current.playsInline = true;
        await videoRef.current.play();
        setIsPlaying(true);
        setPlaybackError(null);
        console.log("Video playing successfully:", videoId || videoSource.substring(0, 30));
      } catch (error) {
        console.error("Error playing video:", error);
        setPlaybackError(error instanceof Error ? error : new Error('Unknown playback error'));
        setAttemptCount(count => count + 1);
        
        // If first attempt failed, try again after a short delay
        if (attemptCount < 2) {
          setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.load();
              setHasAttemptedPlay(false); // Reset to try again
            }
          }, 1000);
        }
      } finally {
        // Mark as attempted
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

  // Reset play attempt when source changes
  useEffect(() => {
    setHasAttemptedPlay(false);
    setPlaybackError(null);
    setAttemptCount(0);
  }, [videoSource]);

  // Handle when video is clicked manually
  const handleVideoClick = () => {
    if (!videoRef.current) return;
    
    if (videoRef.current.paused) {
      videoRef.current.muted = false; // Unmute when user explicitly plays
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

  return (
    <div className="h-full w-full relative">
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
        muted
        playsInline
        onClick={handleVideoClick}
      />
    </div>
  );
};

export default VideoPlayer;
