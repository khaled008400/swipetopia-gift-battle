
import { useRef, useEffect, useState } from "react";
import VideoErrorDisplay from "../video/VideoErrorDisplay";
import { useVideoError } from "@/hooks/useVideoError";
import { Trophy } from "lucide-react";

interface BattleVideoPlayerProps {
  leftVideo: any;
  rightVideo: any;
  onVote: (videoId: string) => void;
  hasVoted: boolean;
  votedFor?: string;
}

const BattleVideoPlayer = ({ leftVideo, rightVideo, onVote, hasVoted, votedFor }: BattleVideoPlayerProps) => {
  const [activeVideo, setActiveVideo] = useState<'left' | 'right'>('left');
  const leftVideoRef = useRef<HTMLVideoElement>(null);
  const rightVideoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { videoError: leftError, handleVideoError: handleLeftError, handleRetry: retryLeft } = useVideoError();
  const { videoError: rightError, handleVideoError: handleRightError, handleRetry: retryRight } = useVideoError();

  const tryPlayVideo = async (videoRef: React.RefObject<HTMLVideoElement>) => {
    if (!videoRef.current) return;
    
    try {
      setIsLoading(false);
      await videoRef.current.play();
    } catch (err) {
      console.error("Error playing battle video:", err);
      setIsLoading(false);
      
      if (videoRef === leftVideoRef) {
        handleLeftError(leftVideo?.video_url || '');
      } else {
        handleRightError(rightVideo?.video_url || '');
      }
    }
  };

  useEffect(() => {
    // Pause both videos initially
    if (leftVideoRef.current) {
      leftVideoRef.current.pause();
    }
    if (rightVideoRef.current) {
      rightVideoRef.current.pause();
    }
    
    // Play the active video
    if (activeVideo === 'left' && leftVideoRef.current && !leftError) {
      tryPlayVideo(leftVideoRef);
      if (rightVideoRef.current) {
        rightVideoRef.current.pause();
      }
    } else if (activeVideo === 'right' && rightVideoRef.current && !rightError) {
      tryPlayVideo(rightVideoRef);
      if (leftVideoRef.current) {
        leftVideoRef.current.pause();
      }
    }
  }, [activeVideo, leftError, rightError]);

  const toggleVideo = () => {
    setActiveVideo(prev => prev === 'left' ? 'right' : 'left');
  };

  const handleVideoTap = (side: 'left' | 'right') => {
    if (side === activeVideo) {
      // If tapping the active video, just toggle play/pause
      if (side === 'left' && leftVideoRef.current) {
        if (leftVideoRef.current.paused) {
          leftVideoRef.current.play().catch(console.error);
        } else {
          leftVideoRef.current.pause();
        }
      } else if (side === 'right' && rightVideoRef.current) {
        if (rightVideoRef.current.paused) {
          rightVideoRef.current.play().catch(console.error);
        } else {
          rightVideoRef.current.pause();
        }
      }
    } else {
      // If tapping the inactive video, switch to it
      setActiveVideo(side);
    }
  };

  return (
    <div className="relative h-full w-full flex flex-col">
      <div className="absolute top-4 right-4 z-10 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
        <Trophy className="h-4 w-4 mr-1 text-yellow-500" />
        Battle
      </div>
      
      <div className="flex flex-1 h-full">
        {/* Left Video */}
        <div 
          className={`relative w-1/2 h-full ${activeVideo === 'left' ? 'border-l-4 border-primary' : 'opacity-80'}`}
          onClick={() => handleVideoTap('left')}
        >
          {leftError ? (
            <VideoErrorDisplay 
              onRetry={() => retryLeft(leftVideoRef)}
              message="Unable to load left video"
            />
          ) : (
            <>
              {isLoading && activeVideo === 'left' && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              )}
              
              <video
                ref={leftVideoRef}
                src={leftVideo?.video_url || leftVideo?.videos?.video_url}
                className="h-full w-full object-cover"
                loop
                muted
                playsInline
              />
              
              <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full">
                <p className="text-white text-sm font-medium">
                  {leftVideo?.user?.username || leftVideo?.videos?.profiles?.username || "Creator 1"}
                </p>
              </div>
              
              {votedFor === leftVideo?.id && (
                <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm">
                  Your Vote
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Right Video */}
        <div 
          className={`relative w-1/2 h-full ${activeVideo === 'right' ? 'border-r-4 border-secondary' : 'opacity-80'}`}
          onClick={() => handleVideoTap('right')}
        >
          {rightError ? (
            <VideoErrorDisplay 
              onRetry={() => retryRight(rightVideoRef)}
              message="Unable to load right video"
            />
          ) : (
            <>
              {isLoading && activeVideo === 'right' && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
                </div>
              )}
              
              <video
                ref={rightVideoRef}
                src={rightVideo?.video_url || rightVideo?.videos?.video_url}
                className="h-full w-full object-cover"
                loop
                muted
                playsInline
              />
              
              <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full">
                <p className="text-white text-sm font-medium">
                  {rightVideo?.user?.username || rightVideo?.videos?.profiles?.username || "Creator 2"}
                </p>
              </div>
              
              {votedFor === rightVideo?.id && (
                <div className="absolute top-4 right-4 bg-secondary text-white px-3 py-1 rounded-full text-sm">
                  Your Vote
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Swipe indicator */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-xs">
        Tap to switch videos
      </div>
      
      {/* Voting buttons if not in the voting tab */}
      {!hasVoted && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-4 px-4">
          <Button
            className="flex-1 bg-primary hover:bg-primary/90"
            onClick={() => onVote(leftVideo?.id)}
            disabled={!leftVideo}
          >
            Vote Left
          </Button>
          <Button
            className="flex-1 bg-secondary hover:bg-secondary/90"
            onClick={() => onVote(rightVideo?.id)}
            disabled={!rightVideo}
          >
            Vote Right
          </Button>
        </div>
      )}
    </div>
  );
};

export default BattleVideoPlayer;
