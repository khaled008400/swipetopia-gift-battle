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
    isFollowing?: boolean;
  };
  isLive?: boolean;
  privacy?: "public" | "private" | "followers";
  createdAt?: string;
  title?: string;
}

export interface UploadVideoParams {
  title: string;
  description: string;
  hashtags: string[];
  isPublic: boolean;
  allowDownloads: boolean;
  videoFile: File;
}

export interface VideoComment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    avatar: string;
  };
}

export interface ReportVideoParams {
  videoId: string;
  reason: string;
  details?: string;
}

// Store uploaded videos in memory for demo purposes
const uploadedVideos: Video[] = [];

export const VideoService = {
  async getFeedVideos() {
    try {
      // Try to get videos from API
      const response = await api.get('/videos/feed');
      
      // If we have uploaded videos, add them to the feed
      if (uploadedVideos.length > 0) {
        return [...uploadedVideos, ...response.data]; 
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching feed videos:", error);
      
      // If API call fails, return uploaded videos if we have any
      if (uploadedVideos.length > 0) {
        return uploadedVideos;
      }
      
      return [];
    }
  },

  async getTrendingVideos() {
    try {
      const response = await api.get('/videos/trending');
      return response.data;
    } catch (error) {
      console.error("Error fetching trending videos:", error);
      return [];
    }
  },

  async getUserVideos(userId: string) {
    try {
      const response = await api.get(`/users/${userId}/videos`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user videos:", error);
      return [];
    }
  },

  async getLikedVideos() {
    try {
      const response = await api.get('/videos/liked');
      return response.data;
    } catch (error) {
      console.error("Error fetching liked videos:", error);
      return [];
    }
  },

  async getBattleVideos() {
    try {
      const response = await api.get('/videos/battles');
      return response.data;
    } catch (error) {
      console.error("Error fetching battle videos:", error);
      return [];
    }
  },

  async likeVideo(videoId: string) {
    try {
      const response = await api.post(`/videos/${videoId}/like`);
      return response.data;
    } catch (error) {
      console.error("Error liking video:", error);
      throw error;
    }
  },

  async unlikeVideo(videoId: string) {
    try {
      const response = await api.delete(`/videos/${videoId}/like`);
      return response.data;
    } catch (error) {
      console.error("Error unliking video:", error);
      throw error;
    }
  },

  async getVideoComments(videoId: string) {
    try {
      const response = await api.get(`/videos/${videoId}/comments`);
      return response.data;
    } catch (error) {
      console.error("Error fetching video comments:", error);
      return [];
    }
  },

  async addComment(videoId: string, content: string) {
    try {
      const response = await api.post(`/videos/${videoId}/comments`, { content });
      return response.data;
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  },

  async reportVideo(videoId: string, reason: string, details?: string) {
    try {
      const response = await api.post(`/videos/${videoId}/report`, { reason, details });
      return response.data;
    } catch (error) {
      console.error("Error reporting video:", error);
      throw error;
    }
  },

  async shareVideo(videoId: string, platform?: string) {
    try {
      const response = await api.post(`/videos/${videoId}/share`, { platform });
      return response.data;
    } catch (error) {
      console.error("Error sharing video:", error);
      throw error;
    }
  },

  async downloadVideo(videoId: string) {
    try {
      const response = await api.get(`/videos/${videoId}/download`);
      return response.data;
    } catch (error) {
      console.error("Error downloading video:", error);
      throw error;
    }
  },

  async deleteVideo(videoId: string) {
    try {
      const response = await api.delete(`/videos/${videoId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting video:", error);
      throw error;
    }
  },

  async uploadVideo(params: UploadVideoParams) {
    try {
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

      console.log('Uploading video with params:', params);
      
      // Create a new video object with the uploaded data
      const newVideo: Video = {
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
        },
        createdAt: new Date().toISOString()
      };
      
      // Add the video to our local store
      uploadedVideos.unshift(newVideo);
      
      console.log('Added new video to uploadedVideos array:', newVideo);
      console.log('Current uploaded videos:', uploadedVideos);
      
      // For demo purposes, return the new video data
      return newVideo;
    } catch (error) {
      console.error("Error uploading video:", error);
      throw error;
    }
  },

  async updateVideo(videoId: string, updates: Partial<UploadVideoParams>) {
    try {
      const response = await api.put(`/videos/${videoId}`, updates);
      return response.data;
    } catch (error) {
      console.error("Error updating video:", error);
      throw error;
    }
  }
};

export default VideoService;
