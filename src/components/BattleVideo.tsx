
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

  return (
    <div className="h-full w-full relative overflow-hidden bg-gradient-to-b from-[#1A1F2C] to-[#000000]">
      {/* Main video player */}
      <BattleVideoPlayer 
        videoUrl={video.url}
        isActive={isActive}
        onVideoTap={handleVideoTap}
        userName={video.user.username}
        isVoted={votedFor !== null}
      />

      {/* UI Overlays */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="h-full w-full bg-gradient-to-t from-black/60 via-transparent to-black/40" />
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
        participants={video.likes}
        showDetails={showDetails}
        setShowDetails={setShowDetails}
      />
    </div>
  );
};

export default BattleVideo;
