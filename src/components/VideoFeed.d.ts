
import { FC } from 'react';
import { Video } from "../types/video.types";

export interface VideoFeedProps {
  videos: Video[];
  activeIndex: number;
  onVideoChange?: (index: number) => void;
  onVideoView?: (videoId: string) => void;
  isBattlePage?: boolean;
  videoUrl?: string;
  isActive?: boolean;
}

declare const VideoFeed: FC<VideoFeedProps>;

export default VideoFeed;
