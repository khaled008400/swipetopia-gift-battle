
import VideoUploadService from './upload.service';
import VideoFetchService from './fetch.service';
import VideoInteractionService from './interaction.service';

// Combine all services into a single export
const VideoService = {
  // Upload methods
  uploadVideo: VideoUploadService.uploadVideo.bind(VideoUploadService),
  checkVideoExists: VideoUploadService.checkVideoExists.bind(VideoUploadService),
  
  // Fetch methods
  getVideoById: VideoFetchService.getVideoById.bind(VideoFetchService),
  getForYouVideos: VideoFetchService.getForYouVideos.bind(VideoFetchService),
  getUserVideos: VideoFetchService.getUserVideos.bind(VideoFetchService),
  getTrendingVideos: VideoFetchService.getTrendingVideos.bind(VideoFetchService),
  getVideos: VideoFetchService.getVideos.bind(VideoFetchService),
  getLikedVideos: VideoFetchService.getLikedVideos.bind(VideoFetchService),
  getSavedVideos: VideoFetchService.getSavedVideos.bind(VideoFetchService),
  searchVideos: VideoFetchService.searchVideos.bind(VideoFetchService),
  
  // For backward compatibility
  fetchVideo: VideoFetchService.getVideoById.bind(VideoFetchService),
  fetchVideos: VideoFetchService.getVideos.bind(VideoFetchService),
  fetchUserVideos: VideoFetchService.getUserVideos.bind(VideoFetchService),
  
  // Interaction methods
  updateVideo: VideoInteractionService.updateVideo.bind(VideoInteractionService),
  deleteVideo: VideoInteractionService.deleteVideo.bind(VideoInteractionService),
  likeVideo: VideoInteractionService.likeVideo.bind(VideoInteractionService),
  unlikeVideo: VideoInteractionService.unlikeVideo.bind(VideoInteractionService),
  saveVideo: VideoInteractionService.saveVideo.bind(VideoInteractionService),
  unsaveVideo: VideoInteractionService.unsaveVideo.bind(VideoInteractionService),
  incrementViewCount: VideoInteractionService.incrementViewCount.bind(VideoInteractionService),
  reportVideo: VideoInteractionService.reportVideo.bind(VideoInteractionService),
};

export default VideoService;
