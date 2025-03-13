
import { Heart, MessageCircle, Share2, Coins } from "lucide-react";

const ActionButtons = () => {
  return (
    <div className="absolute bottom-20 right-3 flex flex-col space-y-4">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center">
          <Heart className="h-6 w-6 text-white" />
        </div>
        <span className="text-white text-xs mt-1">Like</span>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center">
          <MessageCircle className="h-6 w-6 text-white" />
        </div>
        <span className="text-white text-xs mt-1">Comment</span>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center">
          <Share2 className="h-6 w-6 text-white" />
        </div>
        <span className="text-white text-xs mt-1">Share</span>
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

export default ActionButtons;
