
import { useState, useRef, useEffect } from "react";
import { Heart, MessageCircle, Share2, Coins, ChevronUp, Trophy } from "lucide-react";
import { Button } from "./ui/button";

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
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [votedFor, setVotedFor] = useState<'user1' | 'user2' | null>(null);

  useEffect(() => {
    if (isActive) {
      // If videos exist, play them
      if (video1Ref.current) {
        video1Ref.current.play();
      }
      if (video2Ref.current) {
        video2Ref.current.play();
      }
      setIsPlaying(true);
    } else {
      // Pause videos when not active
      if (video1Ref.current) {
        video1Ref.current.pause();
      }
      if (video2Ref.current) {
        video2Ref.current.pause();
      }
      setIsPlaying(false);
    }
  }, [isActive]);

  const handleVideoTap = () => {
    if (isPlaying) {
      video1Ref.current?.pause();
      video2Ref.current?.pause();
      setIsPlaying(false);
    } else {
      video1Ref.current?.play();
      video2Ref.current?.play();
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
        <div className="flex-1 relative overflow-hidden border-b-2 border-app-yellow">
          <video
            ref={video1Ref}
            src={videoUrl1}
            className="h-full w-full object-cover"
            loop
            muted
            playsInline
            onClick={handleVideoTap}
          />
          <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 rounded-full">
            <p className="text-white text-xs">@{battle.user1.name}</p>
          </div>
          {votedFor === 'user1' && (
            <div className="absolute top-2 right-2 bg-app-yellow text-app-black px-2 py-1 rounded-full text-xs font-bold">
              Voted
            </div>
          )}
        </div>
        <div className="flex-1 relative overflow-hidden border-t-2 border-app-yellow">
          <video
            ref={video2Ref}
            src={videoUrl2}
            className="h-full w-full object-cover"
            loop
            muted
            playsInline
            onClick={handleVideoTap}
          />
          <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 rounded-full">
            <p className="text-white text-xs">@{battle.user2.name}</p>
          </div>
          {votedFor === 'user2' && (
            <div className="absolute top-2 right-2 bg-app-yellow text-app-black px-2 py-1 rounded-full text-xs font-bold">
              Voted
            </div>
          )}
        </div>
      </div>

      {/* Battle info overlay */}
      <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center">
          <Trophy className="w-5 h-5 text-app-yellow mr-2" />
          <h3 className="text-white font-bold text-lg">{battle.title}</h3>
          <div className="ml-auto flex items-center text-red-500 text-xs">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></div>
            LIVE
          </div>
        </div>
        
        {battle.viewers && (
          <div className="mt-1 text-xs text-gray-300">
            {battle.viewers.toLocaleString()} watching now
          </div>
        )}
      </div>

      {/* Action buttons overlay */}
      <div className="absolute bottom-20 right-3 flex flex-col space-y-4">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <span className="text-white text-xs mt-1">Like</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center">
            <MessageCircle className="h-6 w-6 text-white" />
          </div>
          <span className="text-white text-xs mt-1">Comment</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center">
            <Share2 className="h-6 w-6 text-white" />
          </div>
          <span className="text-white text-xs mt-1">Share</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-app-yellow flex items-center justify-center">
            <Coins className="h-6 w-6 text-app-black" />
          </div>
          <span className="text-white text-xs mt-1">Gift</span>
        </div>
      </div>

      {/* Vote buttons */}
      <div className="absolute bottom-4 left-0 right-0 px-4">
        <div className="flex space-x-3">
          <Button 
            className={`flex-1 ${votedFor === 'user1' ? 'bg-app-yellow text-app-black' : 'bg-app-gray-dark text-white'}`}
            onClick={() => handleVote('user1')}
          >
            Vote {battle.user1.name}
          </Button>
          <Button 
            className={`flex-1 ${votedFor === 'user2' ? 'bg-app-yellow text-app-black' : 'bg-app-gray-dark text-white'}`}
            onClick={() => handleVote('user2')}
          >
            Vote {battle.user2.name}
          </Button>
        </div>
      </div>

      {/* Show battle details */}
      <button 
        className="absolute bottom-20 left-4 text-gray-400 text-xs flex items-center"
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? "Less" : "More"} <ChevronUp className={`ml-1 w-4 h-4 transition-transform ${showDetails ? "rotate-180" : ""}`} />
      </button>
      
      {showDetails && (
        <div className="absolute bottom-24 left-4 right-16 bg-black/70 p-3 rounded-lg animate-fade-in">
          <p className="text-white text-sm">{battle.title}</p>
          <p className="text-gray-300 text-xs mt-1">{battle.participants} participants • Live now</p>
        </div>
      )}
    </div>
  );
};

export default BattleVideo;
