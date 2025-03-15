
import React, { useEffect, useRef, useState } from "react";

export interface VideoPlayerProps {
  videoUrl: string;  // Adding this prop to match usage in VideoFeed
  isActive: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, isActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive && !isPlaying) {
        videoRef.current.play().catch(error => {
          console.error("Error playing video:", error);
        });
        setIsPlaying(true);
      } else if (!isActive && isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isActive, isPlaying]);

  return (
    <div className="h-full w-full">
      <video
        ref={videoRef}
        src={videoUrl}
        className="h-full w-full object-cover"
        loop
        muted
        playsInline
      />
    </div>
  );
};

export default VideoPlayer;
