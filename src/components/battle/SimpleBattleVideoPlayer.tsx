
import { useRef, useEffect, useState } from "react";
import VideoErrorDisplay from "../video/VideoErrorDisplay";
import { useVideoError } from "@/hooks/useVideoError";

interface BattleVideoPlayerProps {
  url: string;
  isActive: boolean;
  onVideoTap: () => void;
  userName: string;
  isVoted: boolean;
}

const SimpleBattleVideoPlayer = ({ url, isActive, onVideoTap, userName, isVoted }: BattleVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { videoError, handleVideoError, handleRetry } = useVideoError();

  const tryPlayVideo = async () => {
    if (!videoRef.current) return;
    
    try {
      setIsLoading(false);
      await videoRef.current.play();
    } catch (err) {
      console.error("Error playing battle video:", err);
      setIsLoading(false);
      handleVideoError(url);
    }
  };

  useEffect(() => {
    if (isActive && videoRef.current && !videoError) {
      tryPlayVideo();
    } else if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [isActive, videoError, url]);

  const handleVideoPress = () => {
    if (!videoError) {
      onVideoTap();
    }
  };

  return (
    <div className="relative h-full w-full">
      {videoError ? (
        <VideoErrorDisplay 
          onRetry={() => handleRetry(videoRef)}
          message="Unable to load video"
        />
      ) : (
        <>
          {isLoading && isActive && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}
          
          <video
            ref={videoRef}
            src={url}
            className="h-full w-full object-cover"
            loop
            muted
            playsInline
            onClick={handleVideoPress}
          />
          
          <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full">
            <p className="text-white text-sm font-medium">
              {userName}
            </p>
          </div>
          
          {isVoted && (
            <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm">
              Voted
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SimpleBattleVideoPlayer;
