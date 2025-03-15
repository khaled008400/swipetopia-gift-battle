
import { FC } from 'react';

export interface VideoPlayerProps {
  videoUrl: string;
  isActive: boolean;
}

declare const VideoPlayer: FC<VideoPlayerProps>;

export default VideoPlayer;
