
import { ChevronUp, UserPlus, UserCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface VideoInfoProps {
  description: string;
  isLive?: boolean;
  user: {
    username: string;
    avatar: string;
    isFollowing?: boolean;
  };
  isFollowing?: boolean;
  onFollow: () => void;
}

const VideoInfo = ({ description, isLive, user, isFollowing, onFollow }: VideoInfoProps) => {
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
      
      {/* User info with follow button */}
      <div className="mt-3 flex items-center my-0 py-0">
        <img 
          src={user.avatar} 
          alt={user.username} 
          className="w-10 h-10 rounded-full border-2 border-app-yellow" 
        />
        <div className="ml-2">
          <p className="text-white text-sm font-bold">@{user.username}</p>
        </div>
        <Button 
          onClick={onFollow}
          variant={isFollowing ? "outline" : "default"} 
          size="sm"
          className={`ml-3 gap-1 rounded-full px-3 py-1 text-xs ${
            isFollowing 
              ? "border-app-yellow text-app-yellow bg-transparent hover:bg-app-yellow/10" 
              : "bg-app-yellow text-app-black hover:bg-app-yellow/90"
          }`}
        >
          {isFollowing ? (
            <>
              <UserCheck className="h-3 w-3" />
              Following
            </>
          ) : (
            <>
              <UserPlus className="h-3 w-3" />
              Follow
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default VideoInfo;
