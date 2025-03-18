
import React from 'react';
import { Button } from '@/components/ui/button';
import { BattleVideo } from '@/types/video.types';

export interface BattleVideoPlayerProps {
  leftVideo?: BattleVideo | null;
  rightVideo?: BattleVideo | null;
  onVote?: (videoId: string) => void;
  hasVoted?: boolean;
  votedFor?: string;
  url?: string;
  isActive?: boolean;
  onVideoTap?: () => void;
  userName?: string;
  isVoted?: boolean;
}

const BattleVideoPlayer: React.FC<BattleVideoPlayerProps> = ({
  leftVideo,
  rightVideo,
  onVote,
  hasVoted,
  votedFor,
  url,
  isActive,
  onVideoTap,
  userName,
  isVoted
}) => {
  if (url) {
    return (
      <div className="relative h-full w-full" onClick={onVideoTap}>
        <video
          src={url}
          className="h-full w-full object-cover"
          autoPlay={isActive}
          loop
          muted
          playsInline
        />
        {userName && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <div className="bg-black/50 px-4 py-2 rounded text-white">
              {userName}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 h-full gap-1">
      {leftVideo && (
        <div className={`relative ${votedFor === leftVideo.id ? 'border-2 border-primary' : ''}`}>
          <video
            src={leftVideo.url || leftVideo.video_url}
            className="h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            {!hasVoted && onVote && (
              <Button 
                onClick={() => onVote(leftVideo.id)}
                className="bg-primary text-white"
              >
                Vote
              </Button>
            )}
          </div>
        </div>
      )}
      
      {rightVideo && (
        <div className={`relative ${votedFor === rightVideo.id ? 'border-2 border-primary' : ''}`}>
          <video
            src={rightVideo.url || rightVideo.video_url}
            className="h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            {!hasVoted && onVote && (
              <Button 
                onClick={() => onVote(rightVideo.id)}
                className="bg-primary text-white"
              >
                Vote
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BattleVideoPlayer;
