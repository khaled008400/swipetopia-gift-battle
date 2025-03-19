
import VideoActions from "./VideoActions";
import VideoInfo from "./VideoInfo";
import { Heart, MessageCircle, Share, Gift } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import GiftSelector from "./GiftSelector";

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
      id?: string; // Add id for user actions
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
  const [showGiftSelector, setShowGiftSelector] = useState(false);

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
        
        <div className="flex flex-col items-center space-y-4">
          <Button 
            onClick={onLike} 
            variant="ghost" 
            size="icon" 
            className="rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50 transition-all"
          >
            <Heart 
              className={`h-6 w-6 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} 
            />
            <span className="text-white text-xs mt-1">{video.likes}</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50 transition-all"
          >
            <MessageCircle className="h-6 w-6 text-white" />
            <span className="text-white text-xs mt-1">{video.comments}</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50 transition-all"
          >
            <Share className="h-6 w-6 text-white" />
            <span className="text-white text-xs mt-1">{video.shares}</span>
          </Button>
          
          <Button 
            onClick={() => setShowGiftSelector(!showGiftSelector)} 
            variant="ghost" 
            size="icon" 
            className="rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50 transition-all"
          >
            <Gift className="h-6 w-6 text-white" />
            <span className="text-white text-xs mt-1">Gift</span>
          </Button>
          
          {showGiftSelector && (
            <GiftSelector 
              videoId={video.id} 
              creatorId={video.user.username}
            />
          )}
          
          <VideoActions 
            videoId={video.id} 
            likes={video.likes}
            comments={video.comments}
            shares={video.shares}
            isLiked={isLiked}
            isSaved={isSaved}
            onLike={onLike}
            onSave={onSave}
            allowDownloads={video.allowDownloads}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoOverlay;
