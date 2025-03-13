
import { useState } from "react";
import BattleVideoPlayer from "./battle/BattleVideoPlayer";
import BattleHeader from "./battle/BattleHeader";
import ActionButtons from "./battle/ActionButtons";
import BattleVoteButtons from "./battle/BattleVoteButtons";
import BattleDetails from "./battle/BattleDetails";

interface User {
  name: string;
  avatar: string;
}

interface BattleVideoProps {
  battle: {
    id: number;
    title: string;
    participants: number;
    viewers?: number;
    user1: User;
    user2: User;
    videoUrl1?: string;
    videoUrl2?: string;
  };
  isActive: boolean;
}

const BattleVideo = ({ battle, isActive }: BattleVideoProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [votedFor, setVotedFor] = useState<'user1' | 'user2' | null>(null);

  const handleVideoTap = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  };

  const handleVote = (user: 'user1' | 'user2') => {
    setVotedFor(user);
  };

  // Placeholder video URLs if none provided
  const videoUrl1 = battle.videoUrl1 || "https://assets.mixkit.co/videos/preview/mixkit-young-woman-waving-on-a-video-call-43892-large.mp4";
  const videoUrl2 = battle.videoUrl2 || "https://assets.mixkit.co/videos/preview/mixkit-man-dancing-under-changing-lights-32949-large.mp4";

  return (
    <div className="h-full w-full relative overflow-hidden bg-app-black">
      {/* Split screen for the two battling videos */}
      <div className="h-full w-full flex flex-col">
        <BattleVideoPlayer 
          videoUrl={videoUrl1}
          isActive={isActive}
          onVideoTap={handleVideoTap}
          userName={battle.user1.name}
          isVoted={votedFor === 'user1'}
        />
        <BattleVideoPlayer 
          videoUrl={videoUrl2}
          isActive={isActive}
          onVideoTap={handleVideoTap}
          userName={battle.user2.name}
          isVoted={votedFor === 'user2'}
        />
      </div>

      <BattleHeader title={battle.title} />
      <ActionButtons />
      <BattleVoteButtons 
        user1Name={battle.user1.name}
        user2Name={battle.user2.name}
        votedFor={votedFor}
        onVote={handleVote}
      />
      <BattleDetails 
        title={battle.title}
        participants={battle.participants}
        showDetails={showDetails}
        setShowDetails={setShowDetails}
      />
    </div>
  );
};

export default BattleVideo;
