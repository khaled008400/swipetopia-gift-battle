
import React from 'react';
import { useParams } from 'react-router-dom';
import { BattleHeader } from '@/components/battle/BattleHeader';
import { BattleDetails } from '@/components/battle/BattleDetails';
import { BattleVideoPlayer } from '@/components/battle/BattleVideoPlayer';
import { BattleProgressIndicators } from '@/components/battle/BattleProgressIndicators';
import { BattleVoteButtons } from '@/components/battle/BattleVoteButtons';
import { ActionButtons } from '@/components/battle/ActionButtons';
import { useBattleVideos } from '@/hooks/useBattleVideos';
import { Loader2 } from 'lucide-react';
import { BattleVideo } from '@/types/video.types';

const BattlePage: React.FC = () => {
  const { battleId } = useParams<{ battleId: string }>();
  const { videos, isLoading, error, votingEndsAt, votesRemaining, castVote } = useBattleVideos(battleId);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-app-yellow" />
      </div>
    );
  }

  // Handle error state
  if (error || !videos || videos.length !== 2) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <div className="text-red-500 text-xl font-semibold mb-2">Error loading battle</div>
        <p className="text-gray-300">{error?.message || "Battle could not be loaded or doesn't have exactly 2 videos"}</p>
      </div>
    );
  }

  // Cast videos as BattleVideo type
  const battleVideos = videos as BattleVideo[];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Battle Header */}
      <BattleHeader votingEndsAt={votingEndsAt} />
      
      {/* Battle Content */}
      <div className="flex-grow p-4">
        <div className="max-w-4xl mx-auto">
          {/* Battle Details */}
          <BattleDetails videos={battleVideos} />
          
          {/* Video Players */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <BattleVideoPlayer video={battleVideos[0]} position="left" />
            <BattleVideoPlayer video={battleVideos[1]} position="right" />
          </div>
          
          {/* Progress Indicators */}
          <BattleProgressIndicators videos={battleVideos} />
          
          {/* Voting Interface */}
          <BattleVoteButtons 
            videos={battleVideos}
            votesRemaining={votesRemaining}
            onVote={castVote}
          />
          
          {/* Action Buttons */}
          <ActionButtons battleId={battleId} videos={battleVideos} />
        </div>
      </div>
    </div>
  );
};

export default BattlePage;
