
import { useState, useEffect, useCallback } from "react";
import VideoService from "@/services/video.service";
import { Video } from "@/types/video.types";

export const useSavedVideos = (userId: string) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSavedVideos = useCallback(async () => {
    if (!userId) {
      setVideos([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const savedVideos = await VideoService.getSavedVideos(userId);
      setVideos(savedVideos);
      setError(null);
    } catch (err) {
      console.error("Error fetching saved videos:", err);
      setError("Failed to load saved videos");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchSavedVideos();
  }, [fetchSavedVideos]);

  return { videos, isLoading, error, refreshVideos: fetchSavedVideos };
};
