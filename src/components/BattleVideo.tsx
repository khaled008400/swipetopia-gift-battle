
import { useState } from "react";
import BattleVideoPlayer from "./battle/BattleVideoPlayer";
import BattleHeader from "./battle/BattleHeader";
import ActionButtons from "./battle/ActionButtons";
import BattleVoteButtons from "./battle/BattleVoteButtons";
import BattleDetails from "./battle/BattleDetails";
import { BattleVideo as BattleVideoType } from "@/hooks/useBattleVideos";

interface BattleVideoProps {
  video: BattleVideoType;
  isActive: boolean;
}

const BattleVideo = ({ video, isActive }: BattleVideoProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [votedFor, setVotedFor] = useState<'user1' | 'user2' | null>(null);

  const handleVideoTap = () => {
    setIsPlaying(prev => !prev);
  };

  const handleVote = (user: 'user1' | 'user2') => {
    setVotedFor(user);
  };

  // For battle video, we'll use the same URL but create a split screen effect
  // In a real app, we would have two different video URLs
  return (
    <div className="h-full w-full relative overflow-hidden bg-app-black">
      {/* Split screen for the two battling videos */}
      <div className="h-full w-full flex flex-col">
        <BattleVideoPlayer 
          videoUrl={video.url}
          isActive={isActive}
          onVideoTap={handleVideoTap}
          userName={`${video.user.username}_1`}
          isVoted={votedFor === 'user1'}
        />
        <BattleVideoPlayer 
          videoUrl={video.url}
          isActive={isActive}
          onVideoTap={handleVideoTap}
          userName={`${video.user.username}_2`}
          isVoted={votedFor === 'user2'}
        />
      </div>

      <BattleHeader title={video.description} />
      <ActionButtons />
      <BattleVoteButtons 
        user1Name={`${video.user.username}_1`}
        user2Name={`${video.user.username}_2`}
        votedFor={votedFor}
        onVote={handleVote}
      />
      <BattleDetails 
        title={video.description}
        participants={video.likes} // Using likes as a proxy for participants
        showDetails={showDetails}
        setShowDetails={setShowDetails}
      />
    </div>
  );
};

export default BattleVideo;
