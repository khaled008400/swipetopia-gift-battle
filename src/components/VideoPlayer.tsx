
import { useRef, useState, useEffect } from "react";
import VideoOverlay from "./video/VideoOverlay";
import VideoErrorDisplay from "./video/VideoErrorDisplay";

interface VideoPlayerProps {
  video: {
    id: string;
    url: string;
    user: {
      username: string;
      avatar: string;
    };
    description: string;
    likes: number;
    comments: number;
    shares: number;
    isLive?: boolean;
  };
  isActive?: boolean;
}

const VideoPlayer = ({
  video,
  isActive = false
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    if (isActive && !videoError) {
      const playVideo = async () => {
        try {
          if (videoRef.current) {
            // Reset video error state on new attempt
            setVideoError(false);
            await videoRef.current.play();
            setIsPlaying(true);
          }
        } catch (err) {
          console.error("Error playing video:", err);
          setVideoError(true);
          setIsPlaying(false);
        }
      };
      
      playVideo();
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isActive, videoError]);

  const handleVideoPress = () => {
    if (videoError) return;
    
    if (isPlaying) {
      videoRef.current?.pause();
      setIsPlaying(false);
    } else {
      videoRef.current?.play().catch(err => {
        console.error("Error on manual play:", err);
        setVideoError(true);
      });
      setIsPlaying(true);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleVideoError = () => {
    console.error("Video failed to load:", video.url);
    setVideoError(true);
  };

  return (
    <div className="h-full w-full relative overflow-hidden">
      {videoError ? (
        <VideoErrorDisplay isLive={video.isLive} />
      ) : (
        <video 
          ref={videoRef} 
          src={video.url} 
          className="h-full w-full object-cover" 
          loop 
          muted 
          playsInline 
          onClick={handleVideoPress}
          onError={handleVideoError}
        />
      )}
      
      {/* Video overlay with user info and actions */}
      {!videoError && (
        <VideoOverlay 
          video={video} 
          isLiked={isLiked} 
          onLike={handleLike} 
        />
      )}
    </div>
  );
};

export default VideoPlayer;
