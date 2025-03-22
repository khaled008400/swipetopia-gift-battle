
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
  
  // Use src as primary source, fall back to videoUrl if src is not provided
  const videoSource = src || videoUrl || '';

  useEffect(() => {
    const playVideo = async () => {
      if (!videoRef.current || !isActive || hasAttemptedPlay) return;
      
      try {
        // Set muted attribute to allow autoplay in most browsers
        videoRef.current.muted = true;
        await videoRef.current.play();
        setIsPlaying(true);
        setHasAttemptedPlay(true);
        console.log("Video playing successfully:", videoId || videoSource.substring(0, 30));
      } catch (error) {
        console.error("Error playing video:", error);
        // Still mark as attempted to avoid repeated failed attempts
        setHasAttemptedPlay(true);
      }
    };

    if (isActive && videoRef.current) {
      // Short delay to ensure the video element is fully loaded
      setTimeout(playVideo, 100);
    }
  }, [isActive, videoSource, videoId, hasAttemptedPlay]);

  useEffect(() => {
    if (!isActive && videoRef.current && isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive, isPlaying]);

  // Reset play attempt when source changes
  useEffect(() => {
    setHasAttemptedPlay(false);
  }, [videoSource]);

  // Handle when video is clicked manually
  const handleVideoClick = () => {
    if (!videoRef.current) return;
    
    if (videoRef.current.paused) {
      videoRef.current.play().catch(error => {
        console.error("Error playing video after click:", error);
      });
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="h-full w-full">
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
