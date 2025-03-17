
import React from 'react';
import { Button } from '@/components/ui/button';
import { BattleVideo } from '@/types/video.types';

export interface BattleVoteButtonsProps {
  videos: BattleVideo[];
  onVote: (videoId: string) => Promise<boolean>;
  user1Name?: string;
  user2Name?: string;
  votedFor?: 'user1' | 'user2' | null;
}

const BattleVoteButtons: React.FC<BattleVoteButtonsProps> = ({ 
  videos, 
  onVote,
  user1Name,
  user2Name,
  votedFor
}) => {
  if (!videos || videos.length < 2) return null;

  // Use the provided names or fallback to creator usernames from videos
  const leftName = user1Name || videos[0]?.creator?.username;
  const rightName = user2Name || videos[1]?.creator?.username;

  return (
    <div className="grid grid-cols-2 gap-4 px-4">
      <Button 
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3"
        onClick={() => onVote(videos[0].id)}
        disabled={votedFor !== null}
      >
        Vote {leftName}
      </Button>
      
      <Button
        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3"
        onClick={() => onVote(videos[1].id)}
        disabled={votedFor !== null}
      >
        Vote {rightName}
      </Button>
    </div>
  );
};

export default BattleVoteButtons;
