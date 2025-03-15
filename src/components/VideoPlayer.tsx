
import React, { useRef, useState, useEffect } from 'react';

export interface VideoPlayerProps {
  videoId: string;
  autoPlay?: boolean;
  loop?: boolean;
  controls?: boolean;
  src?: string;
  poster?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoId,
  autoPlay = true,
  loop = true,
  controls = true,
  src,
  poster
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  
  // Toggle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  useEffect(() => {
    const videoElement = videoRef.current;
    
    if (!videoElement) return;
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    
    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);
    
    return () => {
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
    };
  }, []);
  
  return (
    <div className="relative w-full h-full bg-black">
      <video
        ref={videoRef}
        id={`video-${videoId}`}
        className="w-full h-full object-contain"
        autoPlay={autoPlay}
        loop={loop}
        controls={controls}
        playsInline
        poster={poster}
        src={src}
      />
      {!controls && (
        <div 
          className="absolute inset-0 cursor-pointer"
          onClick={togglePlay}
        />
      )}
    </div>
  );
};

export default VideoPlayer;
