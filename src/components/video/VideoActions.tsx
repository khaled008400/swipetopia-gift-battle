
import { Heart, MessageCircle, Share2, Coins } from "lucide-react";

interface VideoActionsProps {
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  onLike: () => void;
}

const VideoActions = ({ likes, comments, shares, isLiked, onLike }: VideoActionsProps) => {
  return (
    <div className="flex flex-col space-y-5 ml-4">
      <div className="flex flex-col items-center" onClick={onLike}>
        <div className={`w-10 h-10 rounded-full ${isLiked ? 'bg-red-500' : 'bg-black/50'} flex items-center justify-center`}>
          <Heart className={`h-6 w-6 ${isLiked ? 'text-white fill-current' : 'text-white'}`} />
        </div>
        <span className="text-white text-xs mt-1">{likes}</span>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center">
          <MessageCircle className="h-6 w-6 text-white" />
        </div>
        <span className="text-white text-xs mt-1">{comments}</span>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center">
          <Share2 className="h-6 w-6 text-white" />
        </div>
        <span className="text-white text-xs mt-1">{shares}</span>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-app-yellow flex items-center justify-center">
          <Coins className="h-6 w-6 text-app-black" />
        </div>
        <span className="text-white text-xs mt-1">Gift</span>
      </div>
    </div>
  );
};

export default VideoActions;
