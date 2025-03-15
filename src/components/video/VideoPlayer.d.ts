
import { FC } from 'react';

export interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  videoId?: string; // Add videoId property to fix the errors
}

declare const VideoPlayer: FC<VideoPlayerProps>;

export default VideoPlayer;
