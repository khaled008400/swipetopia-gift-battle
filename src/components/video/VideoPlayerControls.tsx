
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface VideoPlayerControlsProps {
  isPlaying: boolean;
  isLiked: boolean;
  setIsLiked: (value: boolean) => void;
  setIsPlaying: (value: boolean) => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  videoError: boolean;
  onTapPosition: (x: number, y: number) => void;
  onShowHeart: (show: boolean) => void;
}

const VideoPlayerControls = ({
  isPlaying,
  isLiked,
  setIsLiked,
  setIsPlaying,
  videoRef,
  videoError,
  onTapPosition,
  onShowHeart
}: VideoPlayerControlsProps) => {
  const [doubleTapTimer, setDoubleTapTimer] = useState<number | null>(null);
  const { toast } = useToast();

  const handleVideoPress = (e: React.MouseEvent<HTMLVideoElement, MouseEvent>) => {
    if (videoError) return;
    
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    onTapPosition(x, y);

    // Check for double tap
    if (doubleTapTimer) {
      // Double tap occurred
      clearTimeout(doubleTapTimer);
      setDoubleTapTimer(null);
      handleDoubleTap();
    } else {
      // First tap, wait for potential second tap
      const timer = window.setTimeout(() => {
        // Single tap after timeout
        setDoubleTapTimer(null);
        
        // Toggle play/pause on single tap
        if (isPlaying) {
          videoRef.current?.pause();
          setIsPlaying(false);
        } else {
          videoRef.current?.play().catch(err => {
            console.error("Error on manual play:", err);
          });
          setIsPlaying(true);
        }
      }, 300); // 300ms timeout for double tap detection
      
      setDoubleTapTimer(timer as unknown as number);
    }
  };

  const handleDoubleTap = () => {
    // Like/unlike the video
    setIsLiked(!isLiked);
    
    // Show heart animation
    onShowHeart(true);
    setTimeout(() => onShowHeart(false), 800);
    
    toast({
      title: isLiked ? "Removed like" : "Added like",
      description: isLiked ? "You've removed your like from this video" : "You've liked this video",
      duration: 2000,
    });
  };

  return {
    handleVideoPress
  };
};

export default VideoPlayerControls;
