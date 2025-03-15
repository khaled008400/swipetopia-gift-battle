import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Video } from "@/types/video.types";
import VideoService from "@/services/video.service";
import { useAuth } from "@/hooks/use-auth";

export const useVideoInteractions = (
  videos: any[],
  activeVideoIndex: number,
  setVideos: React.Dispatch<React.SetStateAction<any[]>>
) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to like videos",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    const video = videos[activeVideoIndex];
    const newLikedState = !video.isLiked;
    
    // Update optimistically
    setVideos(prevVideos => {
      const newVideos = [...prevVideos];
      newVideos[activeVideoIndex] = {
        ...video,
        isLiked: newLikedState,
        likes: newLikedState ? (video.likes || 0) + 1 : (video.likes || 1) - 1,
      };
      return newVideos;
    });

    try {
      // Use methods that now exist in VideoService
      if (newLikedState) {
        await VideoService.likeVideo(video.id, user.id);
      } else {
        await VideoService.unlikeVideo(video.id, user.id);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      
      // Revert on error
      setVideos(prevVideos => {
        const newVideos = [...prevVideos];
        newVideos[activeVideoIndex] = {
          ...video,
          isLiked: !newLikedState,
          likes: !newLikedState ? (video.likes || 0) + 1 : (video.likes || 1) - 1,
        };
        return newVideos;
      });
      
      toast({
        title: "Error",
        description: "Could not update like status",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const handleSave = () => {
    const updatedVideos = [...videos];
    const video = updatedVideos[activeVideoIndex];
    video.isSaved = !video.isSaved;
    setVideos(updatedVideos);
    
    toast({
      title: video.isSaved ? "Saved" : "Removed",
      description: video.isSaved ? "Video saved to your collection" : "Video removed from your collection",
      duration: 2000,
    });
  };

  const handleFollow = () => {
    const updatedVideos = [...videos];
    const video = updatedVideos[activeVideoIndex];
    
    if (video.user.isFollowing === undefined) {
      video.user.isFollowing = true;
    } else {
      video.user.isFollowing = !video.user.isFollowing;
    }
    
    setVideos(updatedVideos);
    
    toast({
      title: video.user.isFollowing ? "Followed" : "Unfollowed",
      description: video.user.isFollowing 
        ? `You are now following ${video.user.username}` 
        : `You unfollowed ${video.user.username}`,
      duration: 2000,
    });
  };

  return { handleLike, handleSave, handleFollow };
};
