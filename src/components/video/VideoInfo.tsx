
import { ChevronUp } from "lucide-react";
import { useState } from "react";

interface VideoInfoProps {
  description: string;
  isLive?: boolean;
  user: {
    username: string;
    avatar: string;
  };
}

const VideoInfo = ({ description, isLive, user }: VideoInfoProps) => {
  const [showDetails, setShowDetails] = useState(false);
  
  return (
    <div className="flex-1 py-0 my--14 mx-0 px-[16px] my--1">
      <div className="flex items-center gap-2">
        {isLive && (
          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
            LIVE
          </span>
        )}
      </div>
      
      <p className="text-gray-300 text-sm mt-1 line-clamp-1">{description}</p>
      
      {showDetails && (
        <div className="mt-2 animate-fade-in">
          <p className="text-gray-300 text-sm">{description}</p>
        </div>
      )}
      
      <button 
        className="text-gray-400 text-xs flex items-center mt-1" 
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? "Less" : "More"} 
        <ChevronUp 
          className={`ml-1 w-4 h-4 transition-transform ${showDetails ? "rotate-180" : ""}`} 
        />
      </button>
      
      {/* User info */}
      <div className="mt-3 flex items-center my-0 py-0">
        <img 
          src={user.avatar} 
          alt={user.username} 
          className="w-10 h-10 rounded-full border-2 border-app-yellow" 
        />
        <div className="ml-2">
          <p className="text-white text-sm font-bold">@{user.username}</p>
        </div>
        <button className="ml-auto bg-app-yellow text-app-black text-xs font-bold px-3 py-1 rounded-full mx-[8px]">
          Follow
        </button>
      </div>
    </div>
  );
};

export default VideoInfo;
