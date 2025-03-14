
import { useVideoNavigation } from "@/hooks/useVideoNavigation";
import { useVideoInteractions } from "@/hooks/useVideoInteractions";
import { VIDEOS } from "@/data/videosMock";
import VideoPlayer from "@/components/VideoPlayer";
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
      <div className="h-full w-full">
        {videos.map((video, index) => (
          <div
            key={video.id}
            className={`absolute top-0 left-0 h-full w-full transition-opacity duration-300 ${
              index === activeVideoIndex ? "opacity-100 z-10" : "opacity-0 -z-10"
            }`}
          >
            <VideoPlayer 
              video={video} 
              isActive={index === activeVideoIndex}
              onLike={() => handleLike()}
              onSave={() => handleSave()}
              onFollow={() => handleFollow()}
            />
          </div>
        ))}
      </div>
      
      <ProgressIndicators 
        totalVideos={videos.length} 
        activeIndex={activeVideoIndex} 
      />
    </div>
  );
};

export default VideoPage;
