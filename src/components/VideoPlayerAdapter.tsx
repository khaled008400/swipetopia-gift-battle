
import React from 'react';
import VideoPlayer from '@/components/VideoPlayer';

interface VideoPlayerAdapterProps {
  videoId?: string;
  src: string;
  poster?: string;
  autoPlay?: boolean;
}

// This adapter component handles the videoId prop and passes only the supported props
// to the original VideoPlayer component
const VideoPlayerAdapter: React.FC<VideoPlayerAdapterProps> = ({
  videoId, // Accept but don't pass to VideoPlayer
  src,
  poster,
  autoPlay
}) => {
  return (
    <VideoPlayer
      src={src}
      poster={poster}
      autoPlay={autoPlay}
    />
  );
};

export default VideoPlayerAdapter;
