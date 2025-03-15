
import { Zap } from "lucide-react";
import { Link } from "react-router-dom";

interface TrendingVideo {
  id: string;
  thumbnail: string;
  username: string;
  title?: string;
  viewCount?: number;
}

interface TrendingVideosSectionProps {
  videos: TrendingVideo[];
}

export const TrendingVideosSection = ({ videos }: TrendingVideosSectionProps) => {
  if (videos.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-6">
      <div className="flex items-center mb-2">
        <Zap className="w-5 h-5 text-app-yellow mr-1" />
        <h3 className="text-lg font-medium">Trending Videos</h3>
      </div>
      <div className="flex overflow-x-auto no-scrollbar space-x-3">
        {videos.map((video) => (
          <Link 
            to={`/watch/${video.id}`} 
            key={video.id} 
            className="relative min-w-28 h-40 rounded-xl overflow-hidden flex-shrink-0"
          >
            <img 
              src={video.thumbnail} 
              alt={video.title || video.username} 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent">
              <span className="text-white text-xs block font-medium truncate">@{video.username}</span>
              {video.viewCount !== undefined && (
                <span className="text-gray-300 text-xs flex items-center">
                  <Zap className="w-3 h-3 mr-0.5" /> {video.viewCount} views
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
