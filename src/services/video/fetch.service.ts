
import { getVideoById } from './fetch/single-video';
import { getForYouVideos, getVideos } from './fetch/feed';
import { getUserVideos, getLikedVideos, getSavedVideos } from './fetch/user-videos';
import { searchVideos } from './fetch/search';
import { Video } from '@/types/video.types';

// Re-export all functions
export default {
  // Single video fetching
  getVideoById,
  
  // Feed fetching
  getForYouVideos,
  getVideos,
  
  // User-related fetching
  getUserVideos,
  getLikedVideos,
  getSavedVideos,
  
  // Search and discovery
  searchVideos
};
