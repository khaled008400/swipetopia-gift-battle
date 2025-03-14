
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
  downloads?: number;
  allowDownloads?: boolean;
  isPublic?: boolean;
  hashtags?: string[];
  user: {
    id: string;
    username: string;
    avatar: string;
  };
  isLive?: boolean;
}

export interface UploadVideoParams {
  title: string;
  description: string;
  hashtags: string[];
  isPublic: boolean;
  allowDownloads: boolean;
  videoFile: File;
}

export const VideoService = {
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
  },

  async reportVideo(videoId: string, reason: string) {
    const response = await api.post(`/videos/${videoId}/report`, { reason });
    return response.data;
  },

  async shareVideo(videoId: string, platform?: string) {
    const response = await api.post(`/videos/${videoId}/share`, { platform });
    return response.data;
  },

  async downloadVideo(videoId: string) {
    const response = await api.get(`/videos/${videoId}/download`);
    return response.data;
  },

  async deleteVideo(videoId: string) {
    const response = await api.delete(`/videos/${videoId}`);
    return response.data;
  },

  async uploadVideo(params: UploadVideoParams) {
    // In a real implementation, we would use FormData to upload the video file
    const formData = new FormData();
    formData.append('title', params.title);
    formData.append('description', params.description);
    formData.append('isPublic', String(params.isPublic));
    formData.append('allowDownloads', String(params.allowDownloads));
    formData.append('video', params.videoFile);
    params.hashtags.forEach(tag => {
      formData.append('hashtags[]', tag);
    });

    // For demo purposes, we'll return a mock response
    console.log('Uploading video with params:', params);
    
    // Mock API response
    return {
      id: 'new-video-' + Date.now(),
      url: URL.createObjectURL(params.videoFile),
      thumbnail: '',
      title: params.title,
      description: params.description,
      likes: 0,
      comments: 0,
      shares: 0,
      downloads: 0,
      isPublic: params.isPublic,
      allowDownloads: params.allowDownloads,
      hashtags: params.hashtags,
      user: {
        id: 'current-user',
        username: 'currentuser',
        avatar: '/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png'
      }
    };
  },

  async updateVideo(videoId: string, updates: Partial<UploadVideoParams>) {
    const response = await api.put(`/videos/${videoId}`, updates);
    return response.data;
  }
};

export default VideoService;
