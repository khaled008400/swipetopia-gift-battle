
import { FC } from 'react';

export interface VideoPlayerProps {
  videoUrl: string;
  autoPlay?: boolean;
  poster?: string; // Add poster property
}

declare const VideoPlayer: FC<VideoPlayerProps>;

export default VideoPlayer;
