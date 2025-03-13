
import { Zap, Users } from "lucide-react";

interface LiveStreamIndicatorProps {
  viewerCount: number;
}

const LiveStreamIndicator = ({ viewerCount }: LiveStreamIndicatorProps) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center bg-[#FE2C55]/80 backdrop-blur-sm px-2 py-1 rounded-full">
        <Zap className="h-3.5 w-3.5 text-white mr-1 animate-pulse" />
        <span className="text-white text-xs font-medium">LIVE</span>
      </div>
      
      <div className="flex items-center bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
        <Users className="h-3.5 w-3.5 text-white mr-1" />
        <span className="text-white text-xs">{viewerCount}</span>
      </div>
    </div>
  );
};

export default LiveStreamIndicator;
