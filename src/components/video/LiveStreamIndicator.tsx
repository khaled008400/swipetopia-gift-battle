
import React from 'react';
import { Eye } from 'lucide-react';

export interface LiveStreamIndicatorProps {
  viewerCount: number;
}

const LiveStreamIndicator: React.FC<LiveStreamIndicatorProps> = ({ viewerCount }) => {
  return (
    <div className="flex items-center">
      <div className="flex items-center bg-red-600 text-white text-xs px-2 py-0.5 rounded-full mr-2">
        <span className="font-semibold">LIVE</span>
      </div>
      <div className="flex items-center text-white text-xs">
        <Eye className="h-3 w-3 mr-1" />
        <span>{viewerCount >= 1000 ? `${(viewerCount / 1000).toFixed(1)}K` : viewerCount}</span>
      </div>
    </div>
  );
};

export default LiveStreamIndicator;
