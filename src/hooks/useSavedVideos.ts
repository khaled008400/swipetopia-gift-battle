
import { useVideosHook } from "./useVideosHook";
import VideoService from "@/services/video.service";

export const useSavedVideos = (userId: string) => {
  return useVideosHook(
    userId,
    VideoService.getSavedVideos,
    'useSavedVideos'
  );
};
