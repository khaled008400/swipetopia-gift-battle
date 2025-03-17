
import React from 'react';
import { BattleVideo } from '@/types/video.types';

export interface BattleDetailsProps {
  videos?: BattleVideo[];
  title?: string;
  participants?: number;
  showDetails?: boolean;
  setShowDetails?: React.Dispatch<React.SetStateAction<boolean>>;
}

const BattleDetails: React.FC<BattleDetailsProps> = ({ 
  videos, 
  title,
  participants,
  showDetails,
  setShowDetails
}) => {
  return (
    <div className="px-4 py-2">
      {title && (
        <h1 className="text-xl font-bold text-white mb-1">{title}</h1>
      )}
      
      {videos && videos.length >= 2 && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="flex -space-x-2">
              <img 
                src={videos[0].creator.avatar}
                alt={videos[0].creator.username}
                className="w-6 h-6 rounded-full border border-white"
              />
              <img 
                src={videos[1].creator.avatar}
                alt={videos[1].creator.username}
                className="w-6 h-6 rounded-full border border-white"
              />
            </div>
            <span className="ml-2 text-white text-sm">
              {videos[0].creator.username} vs {videos[1].creator.username}
            </span>
          </div>
          
          {participants !== undefined && (
            <span className="text-gray-300 text-xs">
              {participants.toLocaleString()} participants
            </span>
          )}
        </div>
      )}
      
      {showDetails && setShowDetails && (
        <div className="bg-black/30 rounded-lg p-3 mt-2">
          <button 
            className="text-white text-xs underline"
            onClick={() => setShowDetails(false)}
          >
            Hide details
          </button>
          <p className="text-gray-300 text-sm mt-2">
            This is a battle where creators compete for votes.
            You can vote for your favorite video to help them win!
          </p>
        </div>
      )}
    </div>
  );
};

export default BattleDetails;
