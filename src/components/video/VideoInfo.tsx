
import React from "react";
import { MusicNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import LiveStreamIndicator from "./LiveStreamIndicator";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface VideoInfoProps {
  description: string;
  songName?: string;
  isLive?: boolean;
  user: {
    username: string;
    avatar: string;
    isFollowing?: boolean;
    id?: string;
  };
  isFollowing?: boolean;
  onFollow?: () => void;
}

const VideoInfo: React.FC<VideoInfoProps> = ({
  description,
  songName,
  isLive,
  user,
  isFollowing = false,
  onFollow
}) => {
  const navigate = useNavigate();
  
  // Process hashtags in description
  const renderDescription = () => {
    if (!description) return null;
    
    // Split by spaces and process each part
    return description.split(/(\s+)/).map((part, index) => {
      if (part.startsWith("#")) {
        return (
          <span 
            key={index} 
            className="text-blue-400 font-medium cursor-pointer"
            onClick={() => navigate(`/explore?hashtag=${part.substring(1)}`)}
          >
            {part}
          </span>
        );
      } else if (part.startsWith("@")) {
        return (
          <span 
            key={index} 
            className="text-blue-400 font-medium cursor-pointer"
            onClick={() => navigate(`/profile/${part.substring(1)}`)}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="flex-1 mr-2">
      <div className="flex items-center mb-2">
        <img 
          src={user.avatar} 
          alt={`${user.username}'s avatar`}
          className="w-10 h-10 rounded-full border-2 border-white cursor-pointer"
          onClick={() => navigate(`/profile/${user.username}`)}
        />
        <div className="ml-2 flex-1">
          <div className="flex items-center">
            <span 
              className="font-semibold text-white cursor-pointer"
              onClick={() => navigate(`/profile/${user.username}`)}
            >
              {user.username}
            </span>
            {isLive && (
              <div className="ml-2">
                <LiveStreamIndicator />
              </div>
            )}
          </div>
          
          {onFollow && (
            <Button 
              variant={isFollowing ? "outline" : "default"} 
              size="sm" 
              className={`mt-1 h-7 py-0 px-3 text-xs ${
                isFollowing ? 'text-white border-white/30' : ''
              }`}
              onClick={onFollow}
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>
          )}
        </div>
      </div>
      
      <p className="text-white text-sm mb-2 break-words">{renderDescription()}</p>
      
      {songName && (
        <div className="flex items-center text-sm text-white">
          <MusicNote className="h-3 w-3 mr-1" />
          <span className="truncate">{songName}</span>
        </div>
      )}
    </div>
  );
};

export default VideoInfo;
