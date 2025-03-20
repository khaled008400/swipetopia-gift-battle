
import VideoUploadService from './upload.service';
import VideoFetchService from './fetch.service';
import VideoInteractionService from './interaction.service';

// Create the instance here, so we don't need to use bind
const uploadServiceInstance = VideoUploadService;
const fetchServiceInstance = VideoFetchService;
const interactionServiceInstance = VideoInteractionService;

// Combine all services into a single export
const VideoService = {
  // Upload methods
  uploadVideo: (videoFile: File, title: string, description: string, thumbnailUrl: string | null, isPrivate: boolean = false, hashtags: string[] = []) => 
    uploadServiceInstance.uploadVideo(videoFile, title, description, thumbnailUrl, isPrivate, hashtags),
  
  checkVideoExists: (videoId: string) => 
    uploadServiceInstance.checkVideoExists(videoId),
  
  // Fetch methods
  getVideoById: (id: string) => 
    fetchServiceInstance.getVideoById(id),
  
  getForYouVideos: () => 
    fetchServiceInstance.getForYouVideos(),
  
  getUserVideos: (userId: string) => 
    fetchServiceInstance.getUserVideos(userId),
  
  getTrendingVideos: () => 
    fetchServiceInstance.getTrendingVideos(),
  
  getVideos: (limit: number = 50) => 
    fetchServiceInstance.getVideos(limit),
  
  getLikedVideos: (userId?: string) => 
    fetchServiceInstance.getLikedVideos(userId),
  
  getSavedVideos: (userId?: string) => 
    fetchServiceInstance.getSavedVideos(userId),
  
  searchVideos: (query: string) => 
    fetchServiceInstance.searchVideos(query),
  
  // For backward compatibility
  fetchVideo: (id: string) => 
    fetchServiceInstance.getVideoById(id),
  
  fetchVideos: (params: any) => 
    fetchServiceInstance.getVideos(params),
  
  fetchUserVideos: (userId: string) => 
    fetchServiceInstance.getUserVideos(userId),
  
  // Interaction methods
  updateVideo: (videoId: string, data: any) => 
    interactionServiceInstance.updateVideo(videoId, data),
  
  deleteVideo: (videoId: string) => 
    interactionServiceInstance.deleteVideo(videoId),
  
  likeVideo: (videoId: string) => 
    interactionServiceInstance.likeVideo(videoId),
  
  unlikeVideo: (videoId: string) => 
    interactionServiceInstance.unlikeVideo(videoId),
  
  saveVideo: (videoId: string) => 
    interactionServiceInstance.saveVideo(videoId),
  
  unsaveVideo: (videoId: string) => 
    interactionServiceInstance.unsaveVideo(videoId),
  
  incrementViewCount: (videoId: string) => 
    interactionServiceInstance.incrementViewCount(videoId),
  
  reportVideo: (videoId: string, report: string | { category: string, description: string }) => 
    interactionServiceInstance.reportVideo(videoId, report),
};

export default VideoService;
