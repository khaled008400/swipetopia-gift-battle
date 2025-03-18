
import axios from 'axios';
import { Video, Comment } from '@/types/video.types';
import { supabase } from '@/lib/supabase';

class VideoService {
  // Mock data for development
  private mockVideos: Video[] = Array(10).fill(null).map((_, i) => ({
    id: `video-${i+1}`,
    title: `Video Title ${i+1}`,
    description: `This is video description ${i+1}. #trending #viral`,
    video_url: `https://example.com/videos/${i+1}.mp4`,
    thumbnail_url: `https://example.com/thumbnails/${i+1}.jpg`,
    user_id: `user-${(i % 4) + 1}`,
    created_at: new Date(Date.now() - i * 86400000).toISOString(),
    updated_at: new Date(Date.now() - i * 86400000).toISOString(),
    view_count: Math.floor(Math.random() * 10000),
    likes_count: Math.floor(Math.random() * 500),
    comments_count: Math.floor(Math.random() * 100),
    shares_count: Math.floor(Math.random() * 50),
    is_live: i % 7 === 0,
    is_private: false,
    duration: Math.floor(Math.random() * 60) + 10,
    category: ['dance', 'comedy', 'food', 'sports', 'music'][i % 5],
    hashtags: ['trending', 'viral', 'fyp'],
    is_liked: false,
    is_saved: false,
    user: {
      username: `user${(i % 4) + 1}`,
      avatar: `https://i.pravatar.cc/150?img=${(i % 4) + 1}`,
      avatar_url: `https://i.pravatar.cc/150?img=${(i % 4) + 1}`,
      isFollowing: false,
      id: `user-${(i % 4) + 1}`
    }
  }));

  async getForYouVideos(): Promise<Video[]> {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          user:profiles(id, username, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(25);

      if (error) throw error;
      
      if (data && data.length > 0) {
        return data.map(this.mapDatabaseVideoToModel);
      }
      
      // Return mock data if no real data
      return this.mockVideos;
    } catch (error) {
      console.error('Error getting for you videos:', error);
      return this.mockVideos;
    }
  }

  async getFollowingVideos(userId: string): Promise<Video[]> {
    try {
      const { data: followingData, error: followingError } = await supabase
        .from('followers')
        .select('following_id')
        .eq('follower_id', userId);
      
      if (followingError) throw followingError;
      
      if (followingData && followingData.length > 0) {
        const followingIds = followingData.map(follow => follow.following_id);
        
        const { data, error } = await supabase
          .from('videos')
          .select(`
            *,
            user:profiles(id, username, avatar_url)
          `)
          .in('user_id', followingIds)
          .order('created_at', { ascending: false })
          .limit(25);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          return data.map(this.mapDatabaseVideoToModel);
        }
      }
      
      // Return filtered mock videos if no real data
      return this.mockVideos.filter((_, index) => index % 3 === 0);
    } catch (error) {
      console.error('Error getting following videos:', error);
      return this.mockVideos.filter((_, index) => index % 3 === 0);
    }
  }

  async getUserVideos(userId: string): Promise<Video[]> {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          user:profiles(id, username, avatar_url)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        return data.map(this.mapDatabaseVideoToModel);
      }
      
      // Return filtered mock videos if no real data
      return this.mockVideos.filter(video => video.user_id === userId);
    } catch (error) {
      console.error('Error getting user videos:', error);
      return this.mockVideos.filter(video => video.user_id === userId);
    }
  }

  async getSavedVideos(userId: string): Promise<Video[]> {
    try {
      const { data: savedData, error: savedError } = await supabase
        .from('saved_videos')
        .select('video_id')
        .eq('user_id', userId);
        
      if (savedError) throw savedError;
      
      if (savedData && savedData.length > 0) {
        const videoIds = savedData.map(saved => saved.video_id);
        
        const { data, error } = await supabase
          .from('videos')
          .select(`
            *,
            user:profiles(id, username, avatar_url)
          `)
          .in('id', videoIds)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          return data.map(this.mapDatabaseVideoToModel);
        }
      }
      
      // Return filtered mock videos if no real data
      return this.mockVideos.filter((_, index) => index % 4 === 0);
    } catch (error) {
      console.error('Error getting saved videos:', error);
      return this.mockVideos.filter((_, index) => index % 4 === 0);
    }
  }

  async likeVideo(videoId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('likes')
        .insert([{ video_id: videoId, user_id: userId }]);
      
      if (error) throw error;
      
      // Increment likes count in videos table
      await supabase.rpc('increment_video_likes', { video_id: videoId });
    } catch (error) {
      console.error('Error liking video:', error);
      throw error;
    }
  }

  async unlikeVideo(videoId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('likes')
        .delete()
        .match({ video_id: videoId, user_id: userId });
        
      if (error) throw error;
      
      // Decrement likes count in videos table
      await supabase.rpc('decrement_video_likes', { video_id: videoId });
    } catch (error) {
      console.error('Error unliking video:', error);
      throw error;
    }
  }

  async saveVideo(videoId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('saved_videos')
        .insert([{ video_id: videoId, user_id: userId }]);
        
      if (error) throw error;
    } catch (error) {
      console.error('Error saving video:', error);
      throw error;
    }
  }

  async unsaveVideo(videoId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('saved_videos')
        .delete()
        .match({ video_id: videoId, user_id: userId });
        
      if (error) throw error;
    } catch (error) {
      console.error('Error unsaving video:', error);
      throw error;
    }
  }

  async incrementViewCount(videoId: string): Promise<void> {
    try {
      // Use RPC for atomic increment
      await supabase.rpc('increment_video_views', { video_id: videoId });
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  }

  async getVideoComments(videoId: string): Promise<Comment[]> {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          user:profiles(username, avatar_url)
        `)
        .eq('video_id', videoId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error getting video comments:', error);
      return [];
    }
  }

  async addComment(videoId: string, userId: string, content: string): Promise<Comment | null> {
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([{ 
          video_id: videoId, 
          user_id: userId, 
          content 
        }])
        .select(`
          *,
          user:profiles(username, avatar_url)
        `)
        .single();
      
      if (error) throw error;
      
      // Increment comment count
      await supabase.rpc('increment_video_comments', { video_id: videoId });
      
      return data;
    } catch (error) {
      console.error('Error adding comment:', error);
      return null;
    }
  }

  // Helper method to map database video to frontend model
  private mapDatabaseVideoToModel(dbVideo: any): Video {
    return {
      id: dbVideo.id,
      title: dbVideo.title || '',
      description: dbVideo.description || '',
      video_url: dbVideo.video_url,
      thumbnail_url: dbVideo.thumbnail_url,
      user_id: dbVideo.user_id,
      created_at: dbVideo.created_at,
      updated_at: dbVideo.updated_at,
      view_count: dbVideo.view_count || 0,
      likes_count: dbVideo.likes_count || 0,
      comments_count: dbVideo.comments_count || 0,
      shares_count: dbVideo.shares_count || 0,
      is_live: dbVideo.is_live || false,
      is_private: dbVideo.is_private || false,
      duration: dbVideo.duration || 0,
      category: dbVideo.category || 'general',
      hashtags: dbVideo.hashtags || [],
      is_liked: dbVideo.is_liked || false,
      is_saved: dbVideo.is_saved || false,
      user: {
        id: dbVideo.user?.id,
        username: dbVideo.user?.username || 'Unknown',
        avatar: dbVideo.user?.avatar_url || 'https://i.pravatar.cc/150',
        avatar_url: dbVideo.user?.avatar_url || 'https://i.pravatar.cc/150',
        isFollowing: dbVideo.user?.isFollowing || false
      }
    };
  }
}

export default new VideoService();
