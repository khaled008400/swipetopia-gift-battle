
import { useState } from "react";
import BattleVideoPlayer from "./battle/BattleVideoPlayer";
import BattleHeader from "./battle/BattleHeader";
import ActionButtons from "./battle/ActionButtons";
import BattleVoteButtons from "./battle/BattleVoteButtons";
import BattleDetails from "./battle/BattleDetails";
import { BattleVideo as BattleVideoType, Video } from "@/types/video.types";

interface BattleVideoProps {
  video: Video;
  isActive: boolean;
}

const BattleVideo = ({ video, isActive }: BattleVideoProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [votedFor, setVotedFor] = useState<'user1' | 'user2' | null>(null);

  const handleVideoTap = () => {
    setIsPlaying(prev => !prev);
  };

  const handleVote = async (user: string): Promise<boolean> => {
    if (user === 'user1' || user === 'user2') {
      setVotedFor(user as 'user1' | 'user2');
      return true;
    }
    return false;
  };

  // Create mock videos for battle display
  const mockVideos: BattleVideoType[] = [
    {
      id: '1',
      title: video.title || 'Video 1',
      videoUrl: video.video_url || video.url || '',
      thumbnailUrl: video.thumbnail_url || '',
      creator: {
        id: video.user_id || '1',
        username: video.user?.username || video.profiles?.username || 'User 1',
        avatar: video.user?.avatar || video.creator?.avatar || 'https://example.com/avatar1.jpg'
      },
      votes: video.likes_count || video.likes || 0,
      isLive: video.is_live || false,
      viewerCount: 100
    },
    {
      id: '2',
      title: video.title || 'Video 2',
      videoUrl: video.video_url || video.url || '',
      thumbnailUrl: video.thumbnail_url || '',
      creator: {
        id: video.user_id || '2',
        username: (video.user?.username || video.profiles?.username || 'User 2') + '_2',
        avatar: video.user?.avatar || video.creator?.avatar || 'https://example.com/avatar2.jpg'
      },
      votes: video.likes_count || video.likes || 0,
      isLive: video.is_live || false,
      viewerCount: 100
    }
  ];

  return (
    <div className="h-full w-full relative overflow-hidden bg-gradient-to-b from-[#1A1F2C] to-[#000000]">
      {/* Main video player */}
      <BattleVideoPlayer 
        video={{url: video.video_url || video.url}}
        isActive={isActive}
        onVideoTap={handleVideoTap}
        userName={video.user?.username || video.profiles?.username}
        isVoted={votedFor !== null}
      />

      {/* UI Overlays */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="h-full w-full bg-gradient-to-t from-black/70 via-transparent to-black/40" />
      </div>

      <BattleHeader title={video.description} />
      <ActionButtons videos={mockVideos} />
      <BattleVoteButtons 
        videos={mockVideos}
        onVote={handleVote}
        user1Name={mockVideos[0].creator.username}
        user2Name={mockVideos[1].creator.username}
        votedFor={votedFor}
      />
      <BattleDetails 
        videos={mockVideos}
        title={video.description}
        participants={video.likes_count || video.likes || 0}
        showDetails={showDetails}
        setShowDetails={setShowDetails}
      />
    </div>
  );
};

export default BattleVideo;
