
import { useState } from "react";
import { Heart, MessageCircle, Share2, Coins } from "lucide-react";
import VideoComments from "./VideoComments";
import { useToast } from "@/hooks/use-toast";

interface VideoActionsProps {
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  onLike: () => void;
  videoId?: string;
}

const VideoActions = ({ likes, comments, shares, isLiked, onLike, videoId = "1" }: VideoActionsProps) => {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const { toast } = useToast();

  const handleShare = () => {
    // In a real app, this would open a share dialog with various platforms
    if (navigator.share) {
      navigator.share({
        title: 'Check out this video!',
        text: 'I found this amazing video you should watch',
        url: window.location.href,
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support Web Share API
      toast({
        title: "Link copied",
        description: "Video link copied to clipboard!",
        duration: 2000,
      });
      
      // Copy to clipboard
      navigator.clipboard.writeText(window.location.href)
        .catch(err => console.error('Failed to copy:', err));
    }
  };

  return (
    <div className="flex flex-col space-y-5 ml-4">
      <div className="flex flex-col items-center" onClick={onLike}>
        <div className={`w-10 h-10 rounded-full ${isLiked ? 'bg-red-500' : 'bg-black/50'} flex items-center justify-center cursor-pointer transition-colors duration-200`}>
          <Heart className={`h-6 w-6 ${isLiked ? 'text-white fill-current' : 'text-white'}`} />
        </div>
        <span className="text-white text-xs mt-1">{likes}</span>
      </div>
      
      <div className="flex flex-col items-center" onClick={() => setIsCommentsOpen(true)}>
        <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors duration-200">
          <MessageCircle className="h-6 w-6 text-white" />
        </div>
        <span className="text-white text-xs mt-1">{comments}</span>
      </div>
      
      <div className="flex flex-col items-center" onClick={handleShare}>
        <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors duration-200">
          <Share2 className="h-6 w-6 text-white" />
        </div>
        <span className="text-white text-xs mt-1">{shares}</span>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-app-yellow flex items-center justify-center cursor-pointer hover:bg-yellow-400 transition-colors duration-200">
          <Coins className="h-6 w-6 text-app-black" />
        </div>
        <span className="text-white text-xs mt-1">Gift</span>
      </div>

      {/* Comments Dialog */}
      <VideoComments 
        isOpen={isCommentsOpen} 
        onClose={() => setIsCommentsOpen(false)}
        videoId={videoId}
      />
    </div>
  );
};

export default VideoActions;
