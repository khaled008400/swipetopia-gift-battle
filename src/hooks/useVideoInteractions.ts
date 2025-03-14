
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Video } from "@/types/video.types";

export function useVideoInteractions(
  videos: Video[],
  activeVideoIndex: number,
  setVideos: (videos: Video[]) => void
) {
  const { toast } = useToast();

  const handleLike = () => {
    const updatedVideos = [...videos];
    const video = updatedVideos[activeVideoIndex];
    video.isLiked = !video.isLiked;
    video.likes = video.isLiked ? video.likes + 1 : video.likes - 1;
    setVideos(updatedVideos);
    
    toast({
      title: video.isLiked ? "Added like" : "Removed like",
      description: video.isLiked ? "You've liked this video" : "You've removed your like from this video",
      duration: 2000,
    });
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
