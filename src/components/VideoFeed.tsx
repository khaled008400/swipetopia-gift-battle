
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VideoPlayer from "./VideoPlayer";
import VideoOverlay from "./video/VideoOverlay";
import { Video } from "@/types/video.types";
import { useAuth } from "@/context/AuthContext";
import VideoService from "@/services/video";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

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
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [viewedVideos, setViewedVideos] = useState<Record<string, boolean>>({});

  useEffect(() => {
    console.log("VideoFeed received videos:", videos?.length || 0);
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

  const handleAuthRequiredAction = (action: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: `Please sign in to ${action} this video`,
        duration: 3000,
      });
      // Optional: Can navigate to login page after delay
      // setTimeout(() => navigate("/login"), 1500);
      return false;
    }
    return true;
  };

  const handleLike = async (videoId: string) => {
    if (!handleAuthRequiredAction("like")) return;
    
    setIsLoading(true);
    try {
      const isLiked = likedVideos[videoId];
      if (isLiked) {
        await VideoService.unlikeVideo(videoId);
      } else {
        await VideoService.likeVideo(videoId);
      }
      
      setLikedVideos((prev) => ({
        ...prev,
        [videoId]: !isLiked,
      }));
      
      toast({
        title: isLiked ? "Removed like" : "Video liked",
        description: isLiked ? "You've removed your like from this video" : "You've liked this video",
        duration: 2000,
      });
    } catch (error) {
      console.error("Error toggling like:", error);
      toast({
        title: "Error",
        description: "There was a problem with your action",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (videoId: string) => {
    if (!handleAuthRequiredAction("save")) return;
    
    setIsLoading(true);
    try {
      const isSaved = savedVideos[videoId];
      if (isSaved) {
        await VideoService.unsaveVideo(videoId);
      } else {
        await VideoService.saveVideo(videoId);
      }
      
      setSavedVideos((prev) => ({
        ...prev,
        [videoId]: !isSaved,
      }));
      
      toast({
        title: isSaved ? "Removed from saved" : "Video saved",
        description: isSaved ? "Video removed from your saved collection" : "Video added to your saved collection",
        duration: 2000,
      });
    } catch (error) {
      console.error("Error toggling save:", error);
      toast({
        title: "Error",
        description: "There was a problem with your action",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollow = async (userId: string) => {
    if (!handleAuthRequiredAction("follow")) return;
    
    if (user && userId === user.id) {
      toast({
        title: "Can't follow yourself",
        description: "You cannot follow your own account",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const isFollowing = followedUsers[userId];
      setFollowedUsers((prev) => ({
        ...prev,
        [userId]: !isFollowing,
      }));
      
      toast({
        title: isFollowing ? "Unfollowed" : "Followed",
        description: isFollowing ? "You've unfollowed this user" : "You're now following this user",
        duration: 2000,
      });
    } catch (error) {
      console.error("Error toggling follow:", error);
      toast({
        title: "Error",
        description: "There was a problem with your action",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!videos || videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p className="text-center text-gray-500">Loading videos...</p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {videos.map((video, index) => (
        <div
          key={video.id}
          className={`absolute inset-0 transition-opacity duration-300 ${
            index === activeIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <VideoPlayer
            src={video.video_url}
            poster={video.thumbnail_url}
            isActive={index === activeIndex && isActive}
            videoId={video.id}
          />
          <VideoOverlay
            video={{
              id: video.id,
              description: video.description || "",
              likes: video.likes_count || 0,
              comments: video.comments_count || 0,
              shares: video.shares_count || 0,
              isLive: video.is_live,
              isLiked: likedVideos[video.id],
              isSaved: savedVideos[video.id],
              allowDownloads: true,
              user: {
                username: video.user?.username || "Unknown",
                avatar: video.user?.avatar_url || video.user?.avatar || "",
                isFollowing: followedUsers[video.user_id],
              },
            }}
            isLiked={likedVideos[video.id] || false}
            isSaved={savedVideos[video.id] || false}
            onLike={() => handleLike(video.id)}
            onSave={() => handleSave(video.id)}
            onFollow={() => handleFollow(video.user_id)}
          />
        </div>
      ))}
    </div>
  );
};

export default VideoFeed;
