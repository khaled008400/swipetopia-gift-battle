
import { Video } from "@/types/video.types";
import VideoFeed from "@/components/VideoFeed";
import ProgressIndicators from "@/components/video/ProgressIndicators";
import { useVideoNavigation } from "@/hooks/useVideoNavigation";
import { useVideoInteractions } from "@/hooks/useVideoInteractions";
import { VIDEOS } from "@/data/videosMock";

const VideoPage = () => {
  const { activeVideoIndex, videos, setVideos } = useVideoNavigation(VIDEOS);
  const { handleLike, handleSave, handleFollow } = useVideoInteractions(
    videos, 
    activeVideoIndex, 
    setVideos
  );

  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden bg-black relative">
      <VideoFeed
        videos={videos}
        activeVideoIndex={activeVideoIndex}
      />
      
      <ProgressIndicators 
        totalVideos={videos.length} 
        activeIndex={activeVideoIndex} 
      />
    </div>
  );
};

export default VideoPage;
