
import { Zap } from "lucide-react";

interface TrendingVideo {
  id: string;
  thumbnail: string;
  username: string;
}

interface TrendingVideosSectionProps {
  videos?: TrendingVideo[];
}

const TrendingVideosSection = ({ videos = [] }: TrendingVideosSectionProps) => {
  if (videos.length === 0) {
    return (
      <div className="absolute top-32 left-0 right-0 px-4 z-20">
        <div className="flex items-center mb-2">
          <Zap className="w-4 h-4 text-white mr-1" />
          <h3 className="text-white font-medium">Trending Videos</h3>
        </div>
        <div className="p-4 text-center text-gray-400">
          No trending videos available
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-32 left-0 right-0 px-4 z-20">
      <div className="flex items-center mb-2">
        <Zap className="w-4 h-4 text-white mr-1" />
        <h3 className="text-white font-medium">Trending Videos</h3>
      </div>
      <div className="flex overflow-x-auto no-scrollbar space-x-3">
        {videos.map((video) => (
          <div key={video.id} className="relative min-w-28 h-40 rounded-xl overflow-hidden">
            <img 
              src={video.thumbnail} 
              alt={video.username} 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
              <span className="text-white text-xs">@{video.username}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingVideosSection;
