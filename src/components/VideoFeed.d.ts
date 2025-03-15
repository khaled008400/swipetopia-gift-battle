
import { FC } from 'react';
import { Video } from "../types/video.types";

export interface VideoFeedProps {
  videos: Video[];
  activeVideoIndex: number;
  onVideoView?: (videoId: string) => void;
  isBattlePage?: boolean;
}

declare const VideoFeed: FC<VideoFeedProps>;

export default VideoFeed;
