
import { BattleVideo as BattleVideoType } from "@/hooks/useBattleVideos";
import BattleVideo from "./BattleVideo";
import VideoPlayer from "./VideoPlayer";

interface VideoFeedProps {
  videos?: BattleVideoType[];
  activeVideoIndex?: number;
  isBattlePage?: boolean;
}

const VideoFeed = ({ 
  videos = [], 
  activeVideoIndex = 0, 
  isBattlePage = false 
}: VideoFeedProps) => {
  if (videos.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <p className="text-white text-center">No videos available</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      {videos.map((video, index) => (
        <div
          key={video.id}
          className={`absolute top-0 left-0 h-full w-full transition-opacity duration-300 ${
            index === activeVideoIndex ? "opacity-100 z-10" : "opacity-0 -z-10"
          }`}
        >
          {isBattlePage ? (
            <BattleVideo 
              video={video} 
              isActive={index === activeVideoIndex} 
            />
          ) : (
            <VideoPlayer 
              video={video} 
              isActive={index === activeVideoIndex} 
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default VideoFeed;
