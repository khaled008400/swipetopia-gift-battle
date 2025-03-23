
import { useRef, useState, useEffect } from "react";
import VideoErrorDisplay from "./VideoErrorDisplay";
import { toast } from "sonner";

interface VideoPlayerCoreProps {
  videoUrl: string;
  isActive: boolean;
  onVideoPress: (e: React.MouseEvent<HTMLVideoElement, MouseEvent>) => void;
  onVideoError: () => void;
}

const VideoPlayerCore = ({ 
  videoUrl, 
  isActive, 
  onVideoPress, 
  onVideoError 
}: VideoPlayerCoreProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const [isNotFound, setIsNotFound] = useState(false);
  const [isFormatError, setIsFormatError] = useState(false);

  useEffect(() => {
    // Reset error and loading states when video URL changes
    setLoadError(false);
    setIsNotFound(false);
    setIsFormatError(false);
    setLoadAttempts(0);
    setIsLoading(true);
  }, [videoUrl]);

  const tryPlayVideo = async () => {
    if (!videoRef.current || !isActive || loadError) return;
    
    try {
      await videoRef.current.play();
      setIsPlaying(true);
      // Reset error state on successful play
      setLoadError(false);
      setIsNotFound(false);
      setIsFormatError(false);
      setIsLoading(false);
    } catch (err) {
      console.error("Error playing video:", err);
      setIsPlaying(false);
      
      // Check specific error types
      if (videoRef.current?.error) {
        const errorCode = videoRef.current.error.code;
        const errorMessage = videoRef.current.error.message || '';
        console.error(`Video error code: ${errorCode}, message: ${errorMessage}`);
        
        // MEDIA_ERR_SRC_NOT_SUPPORTED = 4
        if (errorCode === 4) {
          if (errorMessage.includes("Failed to init decoder")) {
            setIsFormatError(true);
            toast("This video format is not supported by your browser", {
              description: "Try a different video",
              duration: 3000
            });
          } else {
            setIsNotFound(true);
          }
          setLoadError(true);
          onVideoError();
          return;
        }
        
        setLoadAttempts(prev => prev + 1);
        if (loadAttempts >= 2) {
          setLoadError(true);
          onVideoError();
        }
      }
    }
  };

  const handleRetry = () => {
    if (videoRef.current && !isFormatError) {
      setLoadError(false);
      setIsNotFound(false);
      setLoadAttempts(0);
      setIsLoading(true);
      videoRef.current.load();
      // Short delay before retry
      setTimeout(() => {
        tryPlayVideo();
      }, 500);
    }
  };

  const handleError = () => {
    console.error("Video error event triggered for:", videoUrl);
    setLoadAttempts(prev => prev + 1);
    setIsLoading(false);
    
    // Check if video source is invalid
    if (videoRef.current?.error) {
      const errorCode = videoRef.current.error.code;
      const errorMessage = videoRef.current.error.message || '';
      
      // MEDIA_ERR_SRC_NOT_SUPPORTED = 4
      if (errorCode === 4) {
        if (errorMessage.includes("Failed to init decoder")) {
          setIsFormatError(true);
          setLoadError(true);
          onVideoError();
          return;
        } else {
          setIsNotFound(true);
        }
      }
    }
    
    if (loadAttempts >= 2) {
      setLoadError(true);
      onVideoError();
    } else if (!isFormatError) {
      // Attempt to reload the video, but not for format errors
      if (videoRef.current) {
        videoRef.current.load();
      }
    }
  };

  // Handle playback when active state changes
  useEffect(() => {
    if (isActive && !loadError) {
      tryPlayVideo();
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isActive, loadError]);

  // Handle when the video loads
  const handleVideoLoad = () => {
    setIsLoading(false);
  };

  return (
    <>
      {loadError ? (
        <VideoErrorDisplay 
          message={isFormatError 
            ? "This video format cannot be played in your browser" 
            : isNotFound 
              ? "This video source cannot be played" 
              : "This video could not be loaded"} 
          onRetry={!isFormatError ? handleRetry : undefined}
          notFound={isNotFound}
          isFormatError={isFormatError}
        />
      ) : (
        <>
          {isLoading && !loadError && (
            <VideoErrorDisplay isLoading={true} />
          )}
          <video 
            ref={videoRef} 
            src={videoUrl} 
            className="h-full w-full object-cover" 
            loop 
            muted 
            playsInline 
            onClick={onVideoPress}
            onError={handleError}
            onLoadedData={handleVideoLoad}
            style={{ display: isLoading ? 'none' : 'block' }}
          />
        </>
      )}
    </>
  );
};

export default VideoPlayerCore;
