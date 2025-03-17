
import { FC } from 'react';

export interface VideoPlayerProps {
  videoUrl: string;
  autoPlay?: boolean;
}

declare const VideoPlayer: FC<VideoPlayerProps>;

export default VideoPlayer;
