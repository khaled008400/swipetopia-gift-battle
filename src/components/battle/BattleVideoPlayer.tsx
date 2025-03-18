
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Heart, MessageSquare, Share, MoreHorizontal } from 'lucide-react';

interface BattleVideoPlayerProps {
  url: string; // Changed from videoUrl to url
  isActive: boolean;
  onVideoTap: () => void;
  userName: string;
  isVoted: boolean;
}

const BattleVideoPlayer: React.FC<BattleVideoPlayerProps> = ({
  url,
  isActive,
  onVideoTap,
  userName,
  isVoted
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleCanPlay = () => {
      setIsVideoLoaded(true);
    };

    videoElement.addEventListener('canplay', handleCanPlay);

    return () => {
      videoElement.removeEventListener('canplay', handleCanPlay);
    };
  }, []);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (isActive) {
      if (videoElement.paused) {
        const playPromise = videoElement.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error('Play error:', error);
          });
        }
      }
    } else {
      videoElement.pause();
    }
  }, [isActive]);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <div className="relative w-full h-full" onClick={onVideoTap}>
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        loop
        muted={isMuted}
        playsInline
        src={url}
      />

      {/* Loading indicator (only shown before video is loaded) */}
      {!isVideoLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Interaction buttons */}
      <div className="absolute bottom-20 right-4 flex flex-col items-center space-y-6 z-10">
        {/* Sound toggle button */}
        <button
          onClick={toggleMute}
          className="flex flex-col items-center justify-center text-white"
        >
          <div className="w-10 h-10 bg-black/30 rounded-full flex items-center justify-center mb-1">
            {isMuted ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </div>
        </button>

        {/* Like button */}
        <button
          onClick={toggleLike}
          className="flex flex-col items-center justify-center text-white"
          disabled={isVoted}
        >
          <div 
            className={`w-10 h-10 bg-black/30 rounded-full flex items-center justify-center mb-1 ${
              isLiked ? 'text-red-500' : 'text-white'
            } ${isVoted ? 'opacity-50' : ''}`}
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
          </div>
          <span className="text-xs">Like</span>
        </button>

        {/* Comment button */}
        <button
          className="flex flex-col items-center justify-center text-white"
        >
          <div className="w-10 h-10 bg-black/30 rounded-full flex items-center justify-center mb-1">
            <MessageSquare className="h-5 w-5" />
          </div>
          <span className="text-xs">Comments</span>
        </button>

        {/* Share button */}
        <button
          className="flex flex-col items-center justify-center text-white"
        >
          <div className="w-10 h-10 bg-black/30 rounded-full flex items-center justify-center mb-1">
            <Share className="h-5 w-5" />
          </div>
          <span className="text-xs">Share</span>
        </button>

        {/* More options button */}
        <button
          className="flex flex-col items-center justify-center text-white"
        >
          <div className="w-10 h-10 bg-black/30 rounded-full flex items-center justify-center mb-1">
            <MoreHorizontal className="h-5 w-5" />
          </div>
          <span className="text-xs">More</span>
        </button>
      </div>

      {/* Watermark */}
      <div className="absolute bottom-20 left-4 z-10">
        <div className="bg-black/60 px-3 py-1 rounded-full">
          <span className="text-white text-sm font-medium">@{userName}</span>
        </div>
      </div>
    </div>
  );
};

export default BattleVideoPlayer;
