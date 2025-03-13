
import { useRef, useEffect } from "react";

interface BattleVideoPlayerProps {
  videoUrl: string;
  isActive: boolean;
  onVideoTap: () => void;
  userName: string;
  isVoted?: boolean;
}

const BattleVideoPlayer = ({ videoUrl, isActive, onVideoTap, userName, isVoted }: BattleVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isActive) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
  }, [isActive]);

  return (
    <div className="flex-1 relative overflow-hidden border-b-2 border-app-yellow">
      <video
        ref={videoRef}
        src={videoUrl}
        className="h-full w-full object-cover"
        loop
        muted
        playsInline
        onClick={onVideoTap}
      />
      <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 rounded-full">
        <p className="text-white text-xs">@{userName}</p>
      </div>
      {isVoted && (
        <div className="absolute top-2 right-2 bg-app-yellow text-app-black px-2 py-1 rounded-full text-xs font-bold">
          Voted
        </div>
      )}
    </div>
  );
};

export default BattleVideoPlayer;
