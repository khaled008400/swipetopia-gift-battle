
import { FC } from 'react';

export interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  videoId?: string;
  videoUrl?: string;
  isActive?: boolean;
}

declare const VideoPlayer: FC<VideoPlayerProps>;

export default VideoPlayer;
