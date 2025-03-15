
import { useVideoNavigation } from "@/hooks/useVideoNavigation";
import { useVideoInteractions } from "@/hooks/useVideoInteractions";
import { VIDEOS } from "@/data/videosMock";
import VideoFeed from "@/components/VideoFeed";
import ProgressIndicators from "@/components/video/ProgressIndicators";
import { useToast } from "@/hooks/use-toast";
import { Video } from "@/types/video.types";
import VideoService from "@/services/video.service";

const VideoPage = () => {
  const { activeVideoIndex, videos, setVideos } = useVideoNavigation(VIDEOS);
  const { toast } = useToast();
  const { 
    handleLike, 
    handleSave, 
    handleFollow 
  } = useVideoInteractions(videos, activeVideoIndex, setVideos);

  const handleShare = () => {
    const video = videos[activeVideoIndex];
    // In a real app, we would use the Web Share API or handle share urls
    toast({
      title: "Shared!",
      description: `You shared ${video.user.username}'s video`,
      duration: 2000,
    });
  };

  const handleComment = () => {
    const video = videos[activeVideoIndex];
    toast({
      title: "Comments",
      description: "Comment functionality would open here",
      duration: 2000,
    });
  };

  const handleReport = () => {
    const video = videos[activeVideoIndex];
    toast({
      title: "Report video",
      description: "Report functionality would open here",
      duration: 2000,
    });
  };

  const handleDownload = () => {
    const video = videos[activeVideoIndex];
    if (!video.allowDownloads) {
      toast({
        title: "Download not allowed",
        description: "The creator doesn't allow downloads for this video",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }
    
    // In a real app, we would call a service to download the video
    VideoService.downloadVideo(video.id)
      .then(() => {
        toast({
          title: "Download started",
          description: "Your video is being downloaded",
          duration: 2000,
        });
      })
      .catch(error => {
        console.error("Error downloading video:", error);
        toast({
          title: "Download failed",
          description: "There was an error downloading this video",
          variant: "destructive",
          duration: 2000,
        });
      });
  };

  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden bg-black relative">
      <VideoFeed 
        videos={videos}
        activeVideoIndex={activeVideoIndex}
        onLike={handleLike}
        onSave={handleSave}
        onFollow={handleFollow}
        onShare={handleShare}
        onComment={handleComment}
        onReport={handleReport}
        onDownload={handleDownload}
      />
      
      <ProgressIndicators 
        totalVideos={videos.length} 
        activeIndex={activeVideoIndex} 
      />
    </div>
  );
};

export default VideoPage;
