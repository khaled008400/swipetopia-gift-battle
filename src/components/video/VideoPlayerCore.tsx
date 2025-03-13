
import { useRef, useState, useEffect } from "react";

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

  const tryPlayVideo = async () => {
    if (!videoRef.current || !isActive) return;
    
    try {
      await videoRef.current.play();
      setIsPlaying(true);
    } catch (err) {
      console.error("Error playing video:", err);
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

  return (
    <video 
      ref={videoRef} 
      src={videoUrl} 
      className="h-full w-full object-cover" 
      loop 
      muted 
      playsInline 
      onClick={onVideoPress}
      onError={onVideoError}
    />
  );
};

export default VideoPlayerCore;
