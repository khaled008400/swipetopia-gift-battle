
import { useVideoNavigation } from "@/hooks/useVideoNavigation";
import { useVideoInteractions } from "@/hooks/useVideoInteractions";
import { VIDEOS } from "@/data/videosMock";
import VideoFeed from "@/components/VideoFeed";
import ProgressIndicators from "@/components/video/ProgressIndicators";

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
        onLike={handleLike}
        onSave={handleSave}
        onFollow={handleFollow}
      />
      
      <ProgressIndicators 
        totalVideos={videos.length} 
        activeIndex={activeVideoIndex} 
      />
    </div>
  );
};

export default VideoPage;
