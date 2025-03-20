
import { useVideosHook } from "./useVideosHook";
import VideoService from "@/services/video";

export const useSavedVideos = (userId: string) => {
  return useVideosHook(
    userId,
    VideoService.getSavedVideos,
    'useSavedVideos'
  );
};
