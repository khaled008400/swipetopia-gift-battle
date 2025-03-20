import { Zap } from "lucide-react";
interface TrendingVideo {
  id: string;
  thumbnail: string;
  username: string;
}
interface TrendingVideosSectionProps {
  videos: TrendingVideo[];
}
const TrendingVideosSection = ({
  videos
}: TrendingVideosSectionProps) => {
  return <div className="absolute top-32 left-0 right-0 px-4 z-20">
      <div className="flex items-center mb-2">
        
        
      </div>
      <div className="flex overflow-x-auto no-scrollbar space-x-3">
        {videos.map(video => <div key={video.id} className="relative min-w-28 h-40 rounded-xl overflow-hidden">
            <img src={video.thumbnail} alt={video.username} className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
              <span className="text-white text-xs">@{video.username}</span>
            </div>
          </div>)}
      </div>
    </div>;
};
export default TrendingVideosSection;