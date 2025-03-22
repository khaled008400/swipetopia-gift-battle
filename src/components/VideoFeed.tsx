
import React, { useState, useEffect } from "react";
import { Video } from "@/types/video.types";
import { useAuth } from "@/context/AuthContext";
import VideoService from "@/services/video";
import { useVideoFeedInteractions } from "@/hooks/useVideoFeedInteractions";
import VideoItem from "./video/VideoItem";
import EmptyFeedState from "./video/EmptyFeedState";
import ProgressIndicators from "./video/ProgressIndicators";

interface VideoFeedProps {
  videos: Video[];
  activeIndex?: number;
  onVideoChange?: (index: number) => void;
  onVideoView?: (videoId: string) => void;
  isBattlePage?: boolean;
  videoUrl?: string;
  isActive?: boolean;
}

const VideoFeed: React.FC<VideoFeedProps> = ({
  videos,
  activeIndex = 0,
  onVideoChange,
  onVideoView,
  isBattlePage = false,
  isActive = true,
}) => {
  const [likedVideos, setLikedVideos] = useState<Record<string, boolean>>({});
  const [savedVideos, setSavedVideos] = useState<Record<string, boolean>>({});
  const [followedUsers, setFollowedUsers] = useState<Record<string, boolean>>({});
  const [viewedVideos, setViewedVideos] = useState<Record<string, boolean>>({});
  const { user, isAuthenticated } = useAuth();
  const { handleLike, handleSave, handleFollow } = useVideoFeedInteractions();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("VideoFeed received videos:", videos?.length || 0);
    
    if (videos === undefined) {
      setError("Could not load videos");
    } else if (videos.length === 0) {
      setError(null); // Use the EmptyFeedState without error
    } else {
      setError(null);
    }
  }, [videos]);

  useEffect(() => {
    if (!isAuthenticated) {
      // For non-logged in users, reset all interaction states
      setLikedVideos({});
      setSavedVideos({});
      setFollowedUsers({});
      return;
    }
    
    const initializeStates = () => {
      const newLikedVideos: Record<string, boolean> = {};
      const newSavedVideos: Record<string, boolean> = {};
      const newFollowedUsers: Record<string, boolean> = {};

      videos.forEach((video) => {
        newLikedVideos[video.id] = video.is_liked || false;
        newSavedVideos[video.id] = video.is_saved || false;
        if (video.user && video.user.isFollowing !== undefined) {
          newFollowedUsers[video.user_id] = video.user.isFollowing;
        }
      });

      setLikedVideos(newLikedVideos);
      setSavedVideos(newSavedVideos);
      setFollowedUsers(newFollowedUsers);
    };

    if (isAuthenticated) {
      initializeStates();
    }
  }, [videos, user, isAuthenticated]);

  useEffect(() => {
    if (onVideoView && videos.length > 0 && activeIndex >= 0 && activeIndex < videos.length) {
      const videoId = videos[activeIndex].id;
      
      // Only count the view once per session
      if (!viewedVideos[videoId]) {
        onVideoView(videoId);
        setViewedVideos(prev => ({
          ...prev,
          [videoId]: true
        }));
      }
    }
  }, [activeIndex, videos, onVideoView, viewedVideos]);

  const onVideoLike = async (videoId: string) => {
    const isLiked = likedVideos[videoId] || false;
    const result = await handleLike(videoId, isLiked);
    
    if (result !== undefined) {
      setLikedVideos(prev => ({
        ...prev,
        [videoId]: result
      }));
    }
  };

  const onVideoSave = async (videoId: string) => {
    const isSaved = savedVideos[videoId] || false;
    const result = await handleSave(videoId, isSaved);
    
    if (result !== undefined) {
      setSavedVideos(prev => ({
        ...prev,
        [videoId]: result
      }));
    }
  };

  const onUserFollow = async (userId: string) => {
    const isFollowing = followedUsers[userId] || false;
    const result = await handleFollow(userId, isFollowing);
    
    if (result !== undefined) {
      setFollowedUsers(prev => ({
        ...prev,
        [userId]: result
      }));
    }
  };

  if (error) {
    return <EmptyFeedState error={error} />;
  }

  if (!videos || videos.length === 0) {
    return <EmptyFeedState isLoading={videos === undefined} />;
  }

  return (
    <div className="relative h-full w-full">
      <ProgressIndicators totalVideos={videos.length} activeIndex={activeIndex} />
      
      {videos.map((video, index) => (
        <div
          key={video.id}
          className={`absolute inset-0 transition-opacity duration-300 ${
            index === activeIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <VideoItem
            video={video}
            isActive={index === activeIndex && isActive}
            isLiked={likedVideos[video.id] || false}
            isSaved={savedVideos[video.id] || false}
            onLike={() => onVideoLike(video.id)}
            onSave={() => onVideoSave(video.id)}
            onFollow={() => onUserFollow(video.user_id)}
          />
        </div>
      ))}
    </div>
  );
};

export default VideoFeed;
