
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

const VideoActions = ({
  likes,
  comments,
  shares,
  isLiked,
  onLike,
  videoId = "1"
}: VideoActionsProps) => {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [showTipOptions, setShowTipOptions] = useState(false);
  const { toast } = useToast();

  const handleLikeClick = () => {
    onLike();
  };

  const handleCommentClick = () => {
    setIsCommentsOpen(true);
  };

  const handleShare = () => {
    // In a real app, this would open a share dialog with various platforms
    if (navigator.share) {
      navigator.share({
        title: 'Check out this video!',
        text: 'I found this amazing video you should watch',
        url: window.location.href
      }).then(() => console.log('Successful share')).catch(error => console.log('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support Web Share API
      toast({
        title: "Link copied",
        description: "Video link copied to clipboard!",
        duration: 2000
      });

      // Copy to clipboard
      navigator.clipboard.writeText(window.location.href).catch(err => console.error('Failed to copy:', err));
    }
  };

  const handleTipClick = () => {
    // Toggle tip options panel
    setShowTipOptions(!showTipOptions);
    
    if (!showTipOptions) {
      toast({
        title: "Tip options opened",
        description: "Choose an amount to send to the creator",
        duration: 2000
      });
    }
  };

  const sendTip = (amount: number) => {
    // In a real app, this would connect to a payment provider
    toast({
      title: "Thank you!",
      description: `You sent a ${amount} coin tip to the creator!`,
      duration: 3000,
    });
    setShowTipOptions(false);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex flex-col items-center">
        <button 
          onClick={handleLikeClick}
          className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center"
        >
          <Heart 
            className={`h-6 w-6 ${isLiked ? "fill-red-500 text-red-500" : "text-white"}`} 
          />
        </button>
        <span className="text-white text-xs mt-1">{likes}</span>
      </div>
      
      <div className="flex flex-col items-center">
        <button 
          onClick={handleCommentClick}
          className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </button>
        <span className="text-white text-xs mt-1">{comments}</span>
      </div>
      
      <div className="flex flex-col items-center">
        <button 
          onClick={handleShare}
          className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center"
        >
          <Share2 className="h-6 w-6 text-white" />
        </button>
        <span className="text-white text-xs mt-1">{shares}</span>
      </div>
      
      <div className="flex flex-col items-center relative">
        <button 
          onClick={handleTipClick}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-[#9b87f5] to-[#D946EF] flex items-center justify-center"
        >
          <Coins className="h-6 w-6 text-white" />
        </button>
        <span className="text-white text-xs mt-1">Tip</span>
        
        {/* Tip amount options */}
        {showTipOptions && (
          <div className="absolute bottom-16 right-0 bg-black/80 backdrop-blur-md rounded-lg p-3 w-32 shadow-lg animate-in fade-in slide-in-from-bottom-5 z-50">
            <div className="flex flex-col space-y-2">
              <button 
                onClick={() => sendTip(5)} 
                className="bg-gradient-to-r from-[#9b87f5]/80 to-[#D946EF]/80 px-3 py-1.5 rounded-md text-white hover:from-[#9b87f5] hover:to-[#D946EF] transition-all"
              >
                5 Coins
              </button>
              <button 
                onClick={() => sendTip(10)} 
                className="bg-gradient-to-r from-[#9b87f5]/80 to-[#D946EF]/80 px-3 py-1.5 rounded-md text-white hover:from-[#9b87f5] hover:to-[#D946EF] transition-all"
              >
                10 Coins
              </button>
              <button 
                onClick={() => sendTip(50)} 
                className="bg-gradient-to-r from-[#9b87f5]/80 to-[#D946EF]/80 px-3 py-1.5 rounded-md text-white hover:from-[#9b87f5] hover:to-[#D946EF] transition-all"
              >
                50 Coins
              </button>
              <button 
                onClick={() => sendTip(100)} 
                className="bg-gradient-to-r from-[#9b87f5] to-[#D946EF] px-3 py-1.5 rounded-md text-white font-medium"
              >
                100 Coins 🔥
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Comments dialog */}
      {isCommentsOpen && (
        <VideoComments 
          isOpen={isCommentsOpen} 
          onClose={() => setIsCommentsOpen(false)} 
          videoId={videoId}
        />
      )}
    </div>
  );
};

export default VideoActions;
