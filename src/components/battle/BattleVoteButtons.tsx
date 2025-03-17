
import React from 'react';
import { Button } from '@/components/ui/button';
import { BattleVideo } from '@/types/video.types';

interface BattleVoteButtonsProps {
  videos: BattleVideo[];
  onVote: (videoId: string) => Promise<boolean>;
}

const BattleVoteButtons: React.FC<BattleVoteButtonsProps> = ({ videos, onVote }) => {
  if (!videos || videos.length < 2) return null;

  return (
    <div className="grid grid-cols-2 gap-4 px-4">
      <Button 
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3"
        onClick={() => onVote(videos[0].id)}
      >
        Vote {videos[0].creator.username}
      </Button>
      
      <Button
        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3"
        onClick={() => onVote(videos[1].id)}
      >
        Vote {videos[1].creator.username}
      </Button>
    </div>
  );
};

export default BattleVoteButtons;
