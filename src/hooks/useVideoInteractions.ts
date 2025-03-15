
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Video } from "@/types/video.types";
import VideoService from "@/services/video.service";

export function useVideoInteractions(
  videos: Video[],
  activeVideoIndex: number,
  setVideos: (videos: Video[]) => void
) {
  const { toast } = useToast();

  const handleLike = async () => {
    try {
      const updatedVideos = [...videos];
      const video = updatedVideos[activeVideoIndex];
      const wasLiked = video.isLiked;
      
      // Update UI immediately for better experience
      video.isLiked = !video.isLiked;
      video.likes = video.isLiked ? video.likes + 1 : video.likes - 1;
      setVideos(updatedVideos);
      
      // Call API in the background
      if (video.isLiked) {
        await VideoService.likeVideo(video.id);
      } else {
        await VideoService.unlikeVideo(video.id);
      }
      
      toast({
        title: video.isLiked ? "Added like" : "Removed like",
        description: video.isLiked ? "You've liked this video" : "You've removed your like from this video",
        duration: 2000,
      });
    } catch (error) {
      console.error("Error liking/unliking video:", error);
      toast({
        title: "Error",
        description: "Failed to like/unlike this video",
        variant: "destructive",
        duration: 2000,
      });
      
      // Revert the UI changes on error
      const updatedVideos = [...videos];
      const video = updatedVideos[activeVideoIndex];
      video.isLiked = !video.isLiked;
      video.likes = video.isLiked ? video.likes + 1 : video.likes - 1;
      setVideos(updatedVideos);
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

  return {
    handleLike,
    handleSave,
    handleFollow
  };
}
