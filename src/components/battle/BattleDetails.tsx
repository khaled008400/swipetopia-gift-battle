
import React from 'react';
import { BattleVideo } from '@/types/video.types';

interface BattleDetailsProps {
  videos: BattleVideo[];
}

const BattleDetails: React.FC<BattleDetailsProps> = ({ videos }) => {
  if (!videos || videos.length < 2) return null;
  
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex-1 text-center">
        <h3 className="text-white font-bold text-lg truncate">{videos[0].creator.username}</h3>
        <div className="flex justify-center mt-1">
          <span className="text-sm text-gray-400">{videos[0].votes} votes</span>
        </div>
      </div>
      
      <div className="text-center px-4">
        <span className="text-white text-xl font-bold">VS</span>
      </div>
      
      <div className="flex-1 text-center">
        <h3 className="text-white font-bold text-lg truncate">{videos[1].creator.username}</h3>
        <div className="flex justify-center mt-1">
          <span className="text-sm text-gray-400">{videos[1].votes} votes</span>
        </div>
      </div>
    </div>
  );
};

export default BattleDetails;
