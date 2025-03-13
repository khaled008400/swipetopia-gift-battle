
import { BattleVideo } from "@/hooks/useBattleVideos";

interface BattleProgressIndicatorsProps {
  videos: BattleVideo[];
  activeIndex: number;
}

const BattleProgressIndicators = ({ videos, activeIndex }: BattleProgressIndicatorsProps) => {
  return (
    <div className="absolute top-20 right-3 flex flex-col space-y-2 z-10">
      {videos.map((video, index) => (
        <div 
          key={index}
          className={`h-5 w-1.5 rounded-full transition-all duration-300 ${
            index === activeIndex 
              ? 'bg-gradient-to-b from-[#9b87f5] to-[#D946EF] h-6' 
              : 'bg-white/30'
          } ${
            video.isLive ? 'border border-[#F97316] shadow-[0_0_4px_rgba(249,115,22,0.6)]' : ''
          }`}
        />
      ))}
    </div>
  );
};

export default BattleProgressIndicators;
