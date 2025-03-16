
import { useState, useEffect } from "react";
import VideoService from "@/services/video.service";
import { Video } from "@/types/video.types";

export const useSavedVideos = (userId: string) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSavedVideos = async () => {
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
    };

    fetchSavedVideos();
  }, [userId]);

  return { videos, isLoading, error };
};
