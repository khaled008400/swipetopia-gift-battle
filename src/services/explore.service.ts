
import api from './api';

export interface SearchResult {
  type: 'user' | 'hashtag' | 'video' | 'live' | 'sound';
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  count?: number; // For hashtags
  username?: string; // For users
  avatar?: string; // For users
  followers?: number; // For users
  url?: string; // For videos
}

const ExploreService = {
  async search(query: string, type?: string) {
    const params = type ? { query, type } : { query };
    const response = await api.get('/explore/search', { params });
    return response.data;
  },

  async getTrendingHashtags() {
    const response = await api.get('/explore/trending-hashtags');
    return response.data;
  },

  async getHashtagVideos(hashtag: string) {
    const response = await api.get(`/explore/hashtags/${hashtag}`);
    return response.data;
  },

  async getPopularUsers() {
    const response = await api.get('/explore/popular-users');
    return response.data;
  },

  async getPopularSounds() {
    const response = await api.get('/explore/popular-sounds');
    return response.data;
  }
};

export default ExploreService;
