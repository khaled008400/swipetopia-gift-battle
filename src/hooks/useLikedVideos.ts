
import { useVideosHook } from "./useVideosHook";
import VideoService from "@/services/video";

export const useLikedVideos = (userId: string) => {
  return useVideosHook(
    userId,
    VideoService.getLikedVideos,
    'useLikedVideos'
  );
};
