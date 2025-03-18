
import { Video, BattleVideo } from "@/types/video.types";

/**
 * Converts battle videos to regular videos for display in video components
 */
export const convertBattleVideosToVideos = (battleVideos: BattleVideo[]): Video[] => {
  return battleVideos.map(battleVideo => {
    const { battle_id, score, position, ...videoData } = battleVideo;
    return videoData as Video;
  });
};
