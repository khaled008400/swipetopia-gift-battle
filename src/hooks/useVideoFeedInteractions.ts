
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import VideoService from "@/services/video";
import { useAuth } from "@/context/AuthContext";

export const useVideoFeedInteractions = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthRequiredAction = (action: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: `Please sign in to ${action} this video`,
        duration: 3000,
      });
      return false;
    }
    return true;
  };

  const handleLike = async (videoId: string, isLiked: boolean) => {
    if (!handleAuthRequiredAction("like")) return;
    
    setIsLoading(true);
    try {
      if (isLiked) {
        await VideoService.unlikeVideo(videoId);
      } else {
        await VideoService.likeVideo(videoId);
      }
      
      toast({
        title: isLiked ? "Removed like" : "Video liked",
        description: isLiked ? "You've removed your like from this video" : "You've liked this video",
        duration: 2000,
      });
      
      return !isLiked;
    } catch (error) {
      console.error("Error toggling like:", error);
      toast({
        title: "Error",
        description: "There was a problem with your action",
        variant: "destructive",
      });
      return isLiked;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (videoId: string, isSaved: boolean) => {
    if (!handleAuthRequiredAction("save")) return;
    
    setIsLoading(true);
    try {
      if (isSaved) {
        await VideoService.unsaveVideo(videoId);
      } else {
        await VideoService.saveVideo(videoId);
      }
      
      toast({
        title: isSaved ? "Removed from saved" : "Video saved",
        description: isSaved ? "Video removed from your saved collection" : "Video added to your saved collection",
        duration: 2000,
      });
      
      return !isSaved;
    } catch (error) {
      console.error("Error toggling save:", error);
      toast({
        title: "Error",
        description: "There was a problem with your action",
        variant: "destructive",
      });
      return isSaved;
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollow = async (userId: string, isFollowing: boolean) => {
    if (!handleAuthRequiredAction("follow")) return;
    
    if (user && userId === user.id) {
      toast({
        title: "Can't follow yourself",
        description: "You cannot follow your own account",
        variant: "destructive",
      });
      return isFollowing;
    }

    setIsLoading(true);
    try {
      // Implement actual follow/unfollow logic here
      // This is a placeholder that returns the new state
      
      toast({
        title: isFollowing ? "Unfollowed" : "Followed",
        description: isFollowing ? "You've unfollowed this user" : "You're now following this user",
        duration: 2000,
      });
      
      return !isFollowing;
    } catch (error) {
      console.error("Error toggling follow:", error);
      toast({
        title: "Error",
        description: "There was a problem with your action",
        variant: "destructive",
      });
      return isFollowing;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleLike,
    handleSave,
    handleFollow,
    isLoading
  };
};
