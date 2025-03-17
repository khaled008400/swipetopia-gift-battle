
import React, { useEffect, useRef, useState } from "react";

export interface VideoPlayerProps {
  videoUrl: string;
  isActive?: boolean;
  autoPlay?: boolean;
  poster?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  videoUrl, 
  isActive = true, 
  autoPlay = false,
  poster
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      if ((isActive || autoPlay) && !isPlaying) {
        videoRef.current.play().catch(error => {
          console.error("Error playing video:", error);
        });
        setIsPlaying(true);
      } else if (!isActive && isPlaying && !autoPlay) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isActive, isPlaying, autoPlay]);

  return (
    <div className="h-full w-full">
      <video
        ref={videoRef}
        src={videoUrl}
        poster={poster}
        className="h-full w-full object-cover"
        loop
        muted
        playsInline
      />
    </div>
  );
};

export default VideoPlayer;
