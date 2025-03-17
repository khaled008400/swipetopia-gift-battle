
import React from 'react';
import { Button } from '@/components/ui/button';
import { BattleVideo } from '@/types/video.types';

interface BattleVoteButtonsProps {
  videos: BattleVideo[];
  votesRemaining: number;
  onVote: (videoId: string) => Promise<boolean>;
}

const BattleVoteButtons: React.FC<BattleVoteButtonsProps> = ({ 
  videos, 
  votesRemaining,
  onVote 
}) => {
  if (!videos || videos.length < 2) return null;
  
  return (
    <div className="space-y-4 my-6">
      <div className="text-center">
        <h3 className="text-white font-bold">Cast Your Vote</h3>
        <p className="text-gray-400 text-sm">You have {votesRemaining} votes remaining</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {videos.map((video) => (
          <Button
            key={video.id}
            variant="outline"
            className="py-6 border-2 border-app-yellow hover:bg-app-yellow/20 disabled:opacity-50"
            disabled={votesRemaining <= 0}
            onClick={() => onVote(video.id)}
          >
            <div className="flex flex-col items-center">
              <span className="font-bold mb-1">{video.creator.username}</span>
              <span className="text-xs">Click to Vote</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default BattleVoteButtons;
