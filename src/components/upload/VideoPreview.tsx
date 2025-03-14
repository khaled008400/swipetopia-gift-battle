
import { useState, useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";

interface VideoPreviewProps {
  src: string;
}

const VideoPreview = ({ src }: VideoPreviewProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(err => {
          console.error("Error playing video:", err);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => setIsPlaying(false);
    
    video.addEventListener("ended", handleEnded);
    return () => {
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  return (
    <div className="relative w-full max-w-[300px] rounded-md overflow-hidden aspect-[9/16] bg-black">
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-contain"
        playsInline
        loop
        muted
      />
      
      <div
        className="absolute inset-0 flex items-center justify-center cursor-pointer"
        onClick={togglePlay}
      >
        {!isPlaying && (
          <div className="w-14 h-14 bg-black/50 rounded-full flex items-center justify-center">
            <Play size={24} className="text-white ml-1" />
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPreview;
