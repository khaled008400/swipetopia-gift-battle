
import React from "react";
import VideoPlayer from "../VideoPlayer";
import VideoOverlay from "./VideoOverlay";
import { Video } from "@/types/video.types";

interface VideoItemProps {
  video: Video;
  isActive: boolean;
  isLiked: boolean;
  isSaved: boolean;
  onLike: () => void;
  onSave: () => void;
  onFollow: () => void;
}

const VideoItem: React.FC<VideoItemProps> = ({
  video,
  isActive,
  isLiked,
  isSaved,
  onLike,
  onSave,
  onFollow
}) => {
  return (
    <div className="absolute inset-0 transition-opacity duration-300">
      <VideoPlayer
        src={video.video_url}
        poster={video.thumbnail_url}
        isActive={isActive}
        videoId={video.id}
      />
      <VideoOverlay
        video={{
          id: video.id,
          description: video.description || "",
          likes: video.likes_count || 0,
          comments: video.comments_count || 0,
          shares: video.shares_count || 0,
          isLive: video.is_live,
          isLiked: isLiked,
          isSaved: isSaved,
          allowDownloads: true,
          user: {
            username: video.user?.username || "Unknown",
            avatar: video.user?.avatar_url || video.user?.avatar || "",
            isFollowing: video.user?.isFollowing,
          },
        }}
        isLiked={isLiked}
        isSaved={isSaved}
        onLike={onLike}
        onSave={onSave}
        onFollow={onFollow}
      />
    </div>
  );
};

export default VideoItem;
