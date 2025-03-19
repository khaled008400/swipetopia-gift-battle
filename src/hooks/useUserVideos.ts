
import { useState, useEffect, useCallback } from "react";
import VideoService from "@/services/video.service";
import { Video } from "@/types/video.types";

export const useUserVideos = (userId: string) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserVideos = useCallback(async () => {
    if (!userId) {
      console.log('useUserVideos: No user ID provided, setting empty videos array');
      setVideos([]);
      setIsLoading(false);
      return;
    }

    console.log('useUserVideos: Fetching videos for user ID:', userId);
    try {
      setIsLoading(true);
      const userVideos = await VideoService.getUserVideos(userId);
      console.log('useUserVideos: Fetched videos:', userVideos?.length || 0);
      setVideos(userVideos || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching user videos:", err);
      setError("Failed to load user videos");
      // Return empty array on error to prevent UI crashes
      setVideos([]);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    console.log('useUserVideos useEffect triggered for user ID:', userId);
    fetchUserVideos();
    
    // Add cleanup function
    return () => {
      console.log('useUserVideos: cleaning up for user ID:', userId);
    };
  }, [fetchUserVideos]);

  return { videos, isLoading, error, refreshVideos: fetchUserVideos };
};
