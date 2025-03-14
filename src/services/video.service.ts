
import api from './api';

export interface Video {
  id: string;
  url: string;
  thumbnail?: string;
  description: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked?: boolean;
  user: {
    id: string;
    username: string;
    avatar: string;
  };
  isLive?: boolean;
}

const VideoService = {
  async getFeedVideos() {
    const response = await api.get('/videos/feed');
    return response.data;
  },

  async getTrendingVideos() {
    const response = await api.get('/videos/trending');
    return response.data;
  },

  async getUserVideos(userId: string) {
    const response = await api.get(`/users/${userId}/videos`);
    return response.data;
  },

  async getLikedVideos() {
    const response = await api.get('/videos/liked');
    return response.data;
  },

  async getBattleVideos() {
    const response = await api.get('/videos/battles');
    return response.data;
  },

  async likeVideo(videoId: string) {
    const response = await api.post(`/videos/${videoId}/like`);
    return response.data;
  },

  async unlikeVideo(videoId: string) {
    const response = await api.delete(`/videos/${videoId}/like`);
    return response.data;
  },

  async getVideoComments(videoId: string) {
    const response = await api.get(`/videos/${videoId}/comments`);
    return response.data;
  },

  async addComment(videoId: string, content: string) {
    const response = await api.post(`/videos/${videoId}/comments`, { content });
    return response.data;
  }
};

export default VideoService;
