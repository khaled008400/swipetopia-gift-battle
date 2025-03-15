
import { Video } from "@/types/video.types";
import { BattleVideo as BattleVideoType } from "@/hooks/useBattleVideos";
import BattleVideo from "./BattleVideo";
import VideoPlayer from "./VideoPlayer";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface VideoFeedProps {
  videos: any[]; // Make more generic to accept both BattleVideoType and Video
  activeVideoIndex: number;
  isBattlePage?: boolean;
  onLike?: () => void;
  onSave?: () => void;
  onFollow?: () => void;
  onShare?: () => void;
  onComment?: () => void;
  onReport?: () => void;
  onDownload?: () => void;
}

const VideoFeed = ({ 
  videos, 
  activeVideoIndex, 
  isBattlePage = false,
  onLike,
  onSave,
  onFollow,
  onShare,
  onComment,
  onReport,
  onDownload
}: VideoFeedProps) => {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { toast } = useToast();

  // After initial render, show a toast if there are no videos
  useEffect(() => {
    if (isInitialLoad && videos.length === 0) {
      toast({
        title: "No videos available",
        description: "There are currently no videos to display.",
        variant: "default",
        duration: 3000,
      });
    }
    setIsInitialLoad(false);
  }, [isInitialLoad, videos.length, toast]);

  if (videos.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center p-4">
          <p className="text-xl font-semibold mb-2">No videos available</p>
          <p className="text-gray-400">Check back later for new content</p>
        </div>
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
              onLike={onLike}
              onSave={onSave}
              onFollow={onFollow}
              onShare={onShare}
              onComment={onComment}
              onReport={onReport}
              onDownload={onDownload}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default VideoFeed;
