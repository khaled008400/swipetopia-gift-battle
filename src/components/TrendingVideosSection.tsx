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
      
      <div className="flex overflow-x-auto no-scrollbar space-x-3">
        {videos.map(video => {})}
      </div>
    </div>;
};
export default TrendingVideosSection;