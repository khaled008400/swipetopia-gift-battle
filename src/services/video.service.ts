
import { supabase } from '@/integrations/supabase/client';
import VideoService from './video/index';

// Re-export all methods from the combined video service
export default {
  // Upload a video
  uploadVideo: VideoService.uploadVideo,

  // Get all videos
  getVideos: VideoService.getVideos,
  
  // Get videos for the For You feed
  getForYouVideos: VideoService.getForYouVideos,
  
  // Get trending videos
  getTrendingVideos: VideoService.getTrendingVideos,

  // Get a single video by id
  getVideo: VideoService.getVideoById,
  getVideoById: VideoService.getVideoById,

  // Get videos by user id
  getUserVideos: VideoService.getUserVideos,
  
  // Search videos
  searchVideos: VideoService.searchVideos,
  
  // Get liked videos
  getLikedVideos: VideoService.getLikedVideos,
  
  // Get saved videos
  getSavedVideos: VideoService.getSavedVideos,

  // Like a video
  likeVideo: VideoService.likeVideo,

  // Unlike a video
  unlikeVideo: VideoService.unlikeVideo,

  // Save a video
  saveVideo: VideoService.saveVideo,

  // Unsave a video
  unsaveVideo: VideoService.unsaveVideo,
  
  // Increment view count
  incrementViewCount: VideoService.incrementViewCount,
  
  // Report a video
  reportVideo: VideoService.reportVideo,

  // Check if a video exists
  checkVideoExists: VideoService.uploadVideo.bind(VideoService).constructor.prototype.checkVideoExists
};
