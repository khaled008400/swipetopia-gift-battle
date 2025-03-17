
import { FC } from 'react';

export interface VideoPlayerProps {
  src: string;
  autoPlay?: boolean;
}

declare const VideoPlayer: FC<VideoPlayerProps>;

export default VideoPlayer;
