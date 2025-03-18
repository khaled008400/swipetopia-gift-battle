
import { useState, useEffect } from "react";
import VideoService from "@/services/video.service";
import { Video } from "@/types/video.types";

export const useLikedVideos = (userId: string) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLikedVideos = async () => {
      if (!userId) {
        setVideos([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const likedVideos = await VideoService.getLikedVideos();
        setVideos(likedVideos);
        setError(null);
      } catch (err) {
        console.error("Error fetching liked videos:", err);
        setError("Failed to load liked videos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikedVideos();
  }, [userId]);

  return { videos, isLoading, error };
};
