
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
    <div className="h-full w-full relative overflow-hidden">
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
          <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-[#9b87f5]/80 backdrop-blur-sm rounded-full">
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
