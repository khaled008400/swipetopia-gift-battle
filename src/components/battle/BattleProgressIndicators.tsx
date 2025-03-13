
import { BattleVideo } from "@/hooks/useBattleVideos";

interface BattleProgressIndicatorsProps {
  videos: BattleVideo[];
  activeIndex: number;
}

const BattleProgressIndicators = ({ videos, activeIndex }: BattleProgressIndicatorsProps) => {
  return (
    <div className="absolute top-20 right-3 flex flex-col space-y-1 z-10">
      {videos.map((video, index) => (
        <div 
          key={index}
          className={`w-1 h-4 rounded-full ${
            index === activeIndex 
              ? 'bg-app-yellow' 
              : 'bg-gray-500/50'
          } ${
            video.isLive ? 'border border-red-500' : ''
          }`}
        />
      ))}
    </div>
  );
};

export default BattleProgressIndicators;
