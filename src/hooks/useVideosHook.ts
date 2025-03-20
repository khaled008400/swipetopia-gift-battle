
import { useState, useEffect, useCallback } from "react";
import { Video } from "@/types/video.types";

type VideoFetchFunction = (userId: string) => Promise<Video[]>;

export const useVideosHook = (
  userId: string, 
  fetchFunction: VideoFetchFunction, 
  hookName: string
) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = useCallback(async () => {
    if (!userId) {
      console.log(`${hookName}: No user ID provided, setting empty videos array`);
      setVideos([]);
      setIsLoading(false);
      return;
    }

    console.log(`${hookName}: Fetching videos for user ID:`, userId);
    try {
      setIsLoading(true);
      const fetchedVideos = await fetchFunction(userId);
      console.log(`${hookName}: Fetched videos:`, fetchedVideos?.length || 0);
      setVideos(fetchedVideos || []);
      setError(null);
    } catch (err) {
      console.error(`Error fetching videos in ${hookName}:`, err);
      setError(`Failed to load videos`);
      // Return empty array on error to prevent UI crashes
      setVideos([]);
    } finally {
      setIsLoading(false);
    }
  }, [userId, fetchFunction, hookName]);

  useEffect(() => {
    console.log(`${hookName} useEffect triggered for user ID:`, userId);
    fetchVideos();
    
    // Add cleanup function
    return () => {
      console.log(`${hookName}: cleaning up for user ID:`, userId);
    };
  }, [fetchVideos, hookName, userId]);

  return { videos, isLoading, error, refreshVideos: fetchVideos };
};
