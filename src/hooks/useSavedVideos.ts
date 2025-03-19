
import { useState, useEffect, useCallback } from "react";
import VideoService from "@/services/video.service";
import { Video } from "@/types/video.types";

export const useSavedVideos = (userId: string) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSavedVideos = useCallback(async () => {
    if (!userId) {
      console.log('useSavedVideos: No user ID provided, setting empty videos array');
      setVideos([]);
      setIsLoading(false);
      return;
    }

    console.log('useSavedVideos: Fetching saved videos for user ID:', userId);
    try {
      setIsLoading(true);
      const savedVideos = await VideoService.getSavedVideos(userId);
      console.log('useSavedVideos: Fetched saved videos:', savedVideos?.length || 0);
      setVideos(savedVideos || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching saved videos:", err);
      setError("Failed to load saved videos");
      // Return empty array on error to prevent UI crashes
      setVideos([]);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    console.log('useSavedVideos useEffect triggered for user ID:', userId);
    fetchSavedVideos();

    // Add cleanup function
    return () => {
      console.log('useSavedVideos: cleaning up for user ID:', userId);
    };
  }, [fetchSavedVideos]);

  return { videos, isLoading, error, refreshVideos: fetchSavedVideos };
};
