
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
  const { videoError, loadAttempts, handleVideoError, handleRetry, resetError, setVideoError } = useVideoError();

  const tryPlayVideo = async () => {
    if (!videoRef.current || !isActive) return;
    
    try {
      setVideoError(false);
      await videoRef.current.play();
    } catch (err) {
      console.error("Error playing battle video:", err);
      handleVideoError(videoUrl);
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
  }, [videoUrl, resetError]);

  return (
    <div className="flex-1 relative overflow-hidden border-b-2 border-app-yellow">
      {videoError ? (
        <VideoErrorDisplay 
          onRetry={loadAttempts < 3 ? () => handleRetry(videoRef) : undefined}
          message={loadAttempts >= 3 ? "Unable to load video after multiple attempts" : undefined}
        />
      ) : (
        <video
          ref={videoRef}
          src={videoUrl}
          className="h-full w-full object-cover"
          loop
          muted
          playsInline
          onClick={onVideoTap}
          onError={() => handleVideoError(videoUrl)}
        />
      )}
      
      {!videoError && (
        <>
          <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 rounded-full">
            <p className="text-white text-xs">@{userName}</p>
          </div>
          {isVoted && (
            <div className="absolute top-2 right-2 bg-app-yellow text-app-black px-2 py-1 rounded-full text-xs font-bold">
              Voted
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BattleVideoPlayer;
