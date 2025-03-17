
import { useRef, useEffect, useState } from "react";
import VideoErrorDisplay from "../video/VideoErrorDisplay";
import { useVideoError } from "@/hooks/useVideoError";

interface BattleVideoPlayerProps {
  videoUrl: string;
  isActive: boolean;
  onVideoTap: () => void;
  userName: string;
  isVoted?: boolean;
}

const BattleVideoPlayer = ({ videoUrl, isActive, onVideoTap, userName, isVoted }: BattleVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { videoError, loadAttempts, handleVideoError, handleRetry, resetError, setVideoError } = useVideoError();

  const tryPlayVideo = async () => {
    if (!videoRef.current || !isActive) return;
    
    try {
      setVideoError(false);
      await videoRef.current.play();
      setIsLoading(false);
    } catch (err) {
      console.error("Error playing battle video:", err);
      handleVideoError(videoUrl);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isActive && !videoError) {
      tryPlayVideo();
    } else if (!isActive && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isActive, videoError, videoUrl]);

  // Reset error state when video changes
  useEffect(() => {
    resetError();
    setIsLoading(true);
  }, [videoUrl, resetError]);

  const onVideoLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="h-full w-full relative overflow-hidden">
      {videoError ? (
        <VideoErrorDisplay 
          onRetry={loadAttempts < 3 ? () => handleRetry(videoRef) : undefined}
          message={loadAttempts >= 3 ? "Unable to load video after multiple attempts" : undefined}
        />
      ) : (
        <>
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-app-yellow"></div>
            </div>
          )}
          
          <video
            ref={videoRef}
            src={videoUrl}
            className="h-full w-full object-cover"
            loop
            muted
            playsInline
            onClick={onVideoTap}
            onError={() => handleVideoError(videoUrl)}
            onLoadedData={onVideoLoad}
          />
        </>
      )}
      
      {!videoError && (
        <>
          <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-gradient-to-r from-[#9b87f5]/80 to-[#D946EF]/80 backdrop-blur-sm rounded-full shadow-lg">
            <p className="text-white text-sm font-medium">@{userName}</p>
          </div>
          {isVoted && (
            <div className="absolute top-4 right-4 bg-gradient-to-r from-[#9b87f5] to-[#D946EF] text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
              Voted
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BattleVideoPlayer;
