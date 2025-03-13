
import { Heart, MessageCircle, Share2, Coins } from "lucide-react";

const ActionButtons = () => {
  return (
    <div className="absolute bottom-24 right-3 flex flex-col space-y-5 z-10">
      <div className="flex flex-col items-center">
        <button className="w-11 h-11 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-black/50 transition-all duration-300">
          <Heart className="h-5 w-5 text-white" />
        </button>
        <span className="text-white text-xs mt-1.5">Like</span>
      </div>
      
      <div className="flex flex-col items-center">
        <button className="w-11 h-11 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-black/50 transition-all duration-300">
          <MessageCircle className="h-5 w-5 text-white" />
        </button>
        <span className="text-white text-xs mt-1.5">Comment</span>
      </div>
      
      <div className="flex flex-col items-center">
        <button className="w-11 h-11 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-black/50 transition-all duration-300">
          <Share2 className="h-5 w-5 text-white" />
        </button>
        <span className="text-white text-xs mt-1.5">Share</span>
      </div>
      
      <div className="flex flex-col items-center">
        <button className="w-11 h-11 rounded-full bg-gradient-to-r from-[#9b87f5] to-[#6E59A5] flex items-center justify-center shadow-lg hover:opacity-90 transition-all duration-300">
          <Coins className="h-5 w-5 text-white" />
        </button>
        <span className="text-white text-xs mt-1.5">Gift</span>
      </div>
    </div>
  );
};

export default ActionButtons;
