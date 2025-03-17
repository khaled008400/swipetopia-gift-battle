
import React from 'react';
import { useParams } from 'react-router-dom';
import { useBattleVideos } from '@/hooks/useBattleVideos';
import BattleHeader from '@/components/battle/BattleHeader';
import BattleDetails from '@/components/battle/BattleDetails';
import BattleVideoPlayer from '@/components/battle/BattleVideoPlayer';
import BattleProgressIndicators from '@/components/battle/BattleProgressIndicators';
import BattleVoteButtons from '@/components/battle/BattleVoteButtons';
import ActionButtons from '@/components/battle/ActionButtons';

const BattlePage = () => {
  const { battleId } = useParams<{ battleId: string }>();
  const { 
    videos, isLoading, error, votingEndsAt, votesRemaining, castVote,
    activeVideoIndex, setActiveVideoIndex, filteredVideos 
  } = useBattleVideos(battleId);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading battle...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen">Error: {error.message}</div>;
  }

  if (!videos || videos.length < 2) {
    return <div className="flex justify-center items-center h-screen">Battle not available</div>;
  }

  return (
    <div className="h-full min-h-screen bg-gradient-to-b from-[#1A1F2C] to-[#000000]">
      <div className="container mx-auto max-w-lg pt-14 pb-20 h-full">
        <BattleHeader />
        
        <div className="relative flex flex-col items-center">
          <div className="w-full">
            <BattleDetails videos={videos} />
          </div>
          
          <div className="relative w-full grid grid-cols-2 gap-2">
            <BattleVideoPlayer video={videos[0]} position="left" />
            <BattleVideoPlayer video={videos[1]} position="right" />
          </div>
          
          <BattleProgressIndicators 
            videos={videos} 
            activeIndex={activeVideoIndex} 
          />
          
          <div className="w-full mt-6">
            <div className="text-center mb-4">
              <div className="text-sm text-gray-400">Voting ends in</div>
              <div className="text-xl font-bold text-white">23h 45m</div>
              <div className="text-sm text-gray-400 mt-1">
                You have {votesRemaining} votes remaining
              </div>
            </div>
            
            <BattleVoteButtons videos={videos} onVote={castVote} />
          </div>
          
          <ActionButtons battleId={battleId} videos={videos} />
        </div>
      </div>
    </div>
  );
};

export default BattlePage;
