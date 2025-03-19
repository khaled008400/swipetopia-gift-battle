
import { useVideosHook } from "./useVideosHook";
import VideoService from "@/services/video.service";

export const useUserVideos = (userId: string) => {
  return useVideosHook(
    userId,
    VideoService.getUserVideos,
    'useUserVideos'
  );
};
