
import { CSSProperties } from "react";
import VideoPlayer from "./VideoPlayer";

interface Video {
  id: string;
  url: string;
  user: {
    username: string;
    avatar: string;
  };
  description: string;
  likes: number;
  comments: number;
  shares: number;
  isLive?: boolean;
}

interface VideoFeedProps {
  videos: Video[];
  activeVideoIndex: number;
}

const VideoFeed = ({ videos, activeVideoIndex }: VideoFeedProps) => {
  return (
    <div 
      className="h-full flex flex-col transition-transform duration-500 ease-in-out"
      style={{ transform: `translateY(-${activeVideoIndex * 100}%)` } as CSSProperties}
    >
      {videos.map((video, index) => (
        <div key={video.id} className="h-full w-full flex-shrink-0">
          <VideoPlayer 
            video={video} 
            isActive={index === activeVideoIndex}
          />
        </div>
      ))}
    </div>
  );
};

export default VideoFeed;
