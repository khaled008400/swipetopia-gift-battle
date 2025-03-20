
import { useState, useEffect, useCallback } from "react";
import { Video } from "@/types/video.types";
import VideoService from "@/services/video.service";

export const useUserVideos = (userId: string) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = useCallback(async () => {
    if (!userId) {
      console.log("useUserVideos: No user ID provided, setting empty videos array");
      setVideos([]);
      setIsLoading(false);
      return;
    }

    console.log("useUserVideos: Fetching videos for user ID:", userId);
    try {
      setIsLoading(true);
      setError(null);
      const fetchedVideos = await VideoService.getUserVideos(userId);
      console.log("useUserVideos: Fetched videos:", fetchedVideos?.length || 0);
      setVideos(fetchedVideos || []);
    } catch (err: any) {
      console.error("Error fetching videos in useUserVideos:", err);
      setError("Failed to load videos");
      // Return empty array on error to prevent UI crashes
      setVideos([]);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    console.log("useUserVideos useEffect triggered for user ID:", userId);
    if (userId) {
      fetchVideos();
    }
    
    // Add cleanup function
    return () => {
      console.log("useUserVideos: cleaning up for user ID:", userId);
    };
  }, [fetchVideos, userId]);

  return { videos, isLoading, error, refreshVideos: fetchVideos };
};
