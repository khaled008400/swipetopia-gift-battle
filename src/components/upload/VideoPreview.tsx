
import { useState, useEffect } from "react";

interface VideoPreviewProps {
  src: string;
}

const VideoPreview = ({ src }: VideoPreviewProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  
  useEffect(() => {
    if (videoElement) {
      if (isPlaying) {
        videoElement.play().catch(err => {
          console.error("Error playing video:", err);
          setIsPlaying(false);
        });
      } else {
        videoElement.pause();
      }
    }
  }, [isPlaying, videoElement]);

  const handleVideoRef = (el: HTMLVideoElement) => {
    setVideoElement(el);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="relative aspect-[9/16] w-full bg-black rounded-lg overflow-hidden">
      <video 
        ref={handleVideoRef}
        src={src} 
        className="w-full h-full object-contain"
        onClick={togglePlay}
        loop
        muted
      />
      <div 
        className="absolute inset-0 flex items-center justify-center cursor-pointer"
        onClick={togglePlay}
      >
        {!isPlaying && (
          <div className="bg-black bg-opacity-50 rounded-full p-3">
            <svg 
              className="w-8 h-8 text-white" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPreview;
