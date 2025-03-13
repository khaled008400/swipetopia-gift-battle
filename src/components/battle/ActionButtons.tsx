
import { Heart, MessageCircle, Share2, Coins } from "lucide-react";

const ActionButtons = () => {
  return (
    <div className="absolute bottom-24 right-3 flex flex-col space-y-5 z-10">
      <div className="flex flex-col items-center">
        <button className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-black/60 transition-all duration-300 shadow-lg">
          <Heart className="h-5 w-5 text-white" />
        </button>
        <span className="text-white text-xs mt-1.5 font-medium">Like</span>
      </div>
      
      <div className="flex flex-col items-center">
        <button className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-black/60 transition-all duration-300 shadow-lg">
          <MessageCircle className="h-5 w-5 text-white" />
        </button>
        <span className="text-white text-xs mt-1.5 font-medium">Comment</span>
      </div>
      
      <div className="flex flex-col items-center">
        <button className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-black/60 transition-all duration-300 shadow-lg">
          <Share2 className="h-5 w-5 text-white" />
        </button>
        <span className="text-white text-xs mt-1.5 font-medium">Share</span>
      </div>
      
      <div className="flex flex-col items-center">
        <button className="w-12 h-12 rounded-full bg-gradient-to-r from-[#9b87f5] to-[#D946EF] flex items-center justify-center shadow-lg hover:opacity-90 transition-all duration-300">
          <Coins className="h-5 w-5 text-white" />
        </button>
        <span className="text-white text-xs mt-1.5 font-medium">Gift</span>
      </div>
    </div>
  );
};

export default ActionButtons;
