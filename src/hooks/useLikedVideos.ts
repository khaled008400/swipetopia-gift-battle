
import { useState, useEffect, useCallback } from "react";
import VideoService from "@/services/video.service";
import { Video } from "@/types/video.types";

export const useLikedVideos = (userId: string) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLikedVideos = useCallback(async () => {
    if (!userId) {
      console.log('useLikedVideos: No user ID provided, setting empty videos array');
      setVideos([]);
      setIsLoading(false);
      return;
    }

    console.log('useLikedVideos: Fetching liked videos for user ID:', userId);
    try {
      setIsLoading(true);
      const likedVideos = await VideoService.getLikedVideos(userId);
      console.log('useLikedVideos: Fetched liked videos:', likedVideos?.length || 0);
      setVideos(likedVideos || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching liked videos:", err);
      setError("Failed to load liked videos");
      // Return empty array on error to prevent UI crashes
      setVideos([]);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    console.log('useLikedVideos useEffect triggered for user ID:', userId);
    fetchLikedVideos();
    
    // Add cleanup function
    return () => {
      console.log('useLikedVideos: cleaning up for user ID:', userId);
    };
  }, [fetchLikedVideos]);

  return { videos, isLoading, error, refreshVideos: fetchLikedVideos };
};
