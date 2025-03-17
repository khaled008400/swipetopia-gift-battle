
import React from 'react';

export interface BattleVideoPlayerProps {
  video: {
    videoUrl?: string;
    url?: string;
  };
  position?: 'left' | 'right';
  onVideoTap?: () => void;
  isActive?: boolean;
  userName?: string;
  isVoted?: boolean;
}

const BattleVideoPlayer: React.FC<BattleVideoPlayerProps> = ({ 
  video, 
  position = 'left',
  onVideoTap,
  isActive = false,
  userName,
  isVoted
}) => {
  const videoSrc = video?.url || video?.videoUrl;
  
  return (
    <div className={`relative h-[300px] overflow-hidden rounded-lg ${position === 'left' ? 'mr-1' : 'ml-1'}`}>
      <video
        src={videoSrc}
        className="h-full w-full object-cover"
        playsInline
        loop
        muted
        autoPlay={isActive}
        onClick={onVideoTap}
      />
      {userName && (
        <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-sm">
          {userName}
        </div>
      )}
      {isVoted && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="bg-white text-black px-4 py-2 rounded-full font-bold">
            Voted
          </div>
        </div>
      )}
    </div>
  );
};

export default BattleVideoPlayer;
