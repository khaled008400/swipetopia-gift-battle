
import { useState, useEffect } from "react";
import VideoService from "@/services/video.service";
import { Video } from "@/types/video.types";

export const useUserVideos = (userId: string) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserVideos = async () => {
      if (!userId) {
        setVideos([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const userVideos = await VideoService.getUserVideos(userId);
        setVideos(userVideos);
        setError(null);
      } catch (err) {
        console.error("Error fetching user videos:", err);
        setError("Failed to load user videos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserVideos();
  }, [userId]);

  return { videos, isLoading, error };
};
