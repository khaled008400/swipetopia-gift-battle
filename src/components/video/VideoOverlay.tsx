
import VideoActions from "./VideoActions";
import VideoInfo from "./VideoInfo";

interface VideoOverlayProps {
  video: {
    description: string;
    likes: number;
    comments: number;
    shares: number;
    isLive?: boolean;
    user: {
      username: string;
      avatar: string;
    };
  };
  isLiked: boolean;
  onLike: () => void;
}

const VideoOverlay = ({ video, isLiked, onLike }: VideoOverlayProps) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 pb-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
      <div className="flex justify-between items-end">
        <VideoInfo 
          description={video.description} 
          isLive={video.isLive} 
          user={video.user} 
        />
        
        <VideoActions 
          likes={video.likes} 
          comments={video.comments} 
          shares={video.shares} 
          isLiked={isLiked}
          onLike={onLike}
        />
      </div>
    </div>
  );
};

export default VideoOverlay;
