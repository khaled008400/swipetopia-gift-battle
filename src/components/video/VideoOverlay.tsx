
import VideoActions from "./VideoActions";
import VideoInfo from "./VideoInfo";

interface VideoOverlayProps {
  video: {
    id?: string;
    description: string;
    likes: number;
    comments: number;
    shares: number;
    isLive?: boolean;
    isLiked?: boolean;
    isSaved?: boolean;
    allowDownloads?: boolean;
    user: {
      username: string;
      avatar: string;
      isFollowing?: boolean;
    };
  };
  isLiked: boolean;
  isSaved: boolean;
  onLike: () => void;
  onSave: () => void;
  onFollow: () => void;
}

const VideoOverlay = ({ 
  video, 
  isLiked, 
  isSaved, 
  onLike, 
  onSave, 
  onFollow 
}: VideoOverlayProps) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 pb-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
      <div className="flex justify-between items-end">
        <VideoInfo 
          description={video.description} 
          isLive={video.isLive} 
          user={video.user}
          isFollowing={video.user.isFollowing}
          onFollow={onFollow}
        />
        
        <VideoActions 
          likes={video.likes} 
          comments={video.comments} 
          shares={video.shares} 
          isLiked={isLiked}
          isSaved={isSaved}
          onLike={onLike}
          onSave={onSave}
          videoId={video.id}
          allowDownloads={video.allowDownloads}
        />
      </div>
    </div>
  );
};

export default VideoOverlay;
