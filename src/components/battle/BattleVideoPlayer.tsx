
import React from 'react';
import { BattleVideo } from '@/types/video.types';
import VideoPlayerAdapter from '@/components/VideoPlayerAdapter';

interface BattleVideoPlayerProps {
  video: BattleVideo;
  position: 'left' | 'right';
}

const BattleVideoPlayer: React.FC<BattleVideoPlayerProps> = ({ video, position }) => {
  return (
    <div className="relative aspect-[9/16] max-h-[60vh]">
      <VideoPlayerAdapter
        videoId={video.id}
        src={video.videoUrl}
        poster={video.thumbnailUrl}
        autoPlay={position === 'left'}
      />
      {video.isLive && (
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
          LIVE {video.viewerCount > 0 && `• ${video.viewerCount} watching`}
        </div>
      )}
    </div>
  );
};

export default BattleVideoPlayer;
