import { supabase } from '@/integrations/supabase/client';
import { Video, Comment } from '@/types/video.types';

class VideoService {
  async getForYouVideos(): Promise<Video[]> {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      
      return data.map((video: any) => ({
        ...video,
        user: {
          username: video.profiles?.username || 'Unknown',
          avatar: video.profiles?.avatar_url || '/placeholder-avatar.jpg',
          avatar_url: video.profiles?.avatar_url || '/placeholder-avatar.jpg',
          id: video.user_id
        },
        likes: video.likes_count,
        comments: video.comments_count,
        shares: video.shares_count
      }));
    } catch (error) {
      console.error('Error fetching for you videos:', error);
      return [];
    }
  }
  
  async incrementViewCount(videoId: string): Promise<void> {
    try {
      const { error } = await supabase.rpc('increment_video_views', {
        video_id: videoId
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  }

  async getVideoById(videoId: string): Promise<Video | null> {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url,
            id
          )
        `)
        .eq('id', videoId)
        .single();
      
      if (error) throw error;
      
      return {
        ...data,
        user: {
          username: data.profiles?.username || 'Unknown',
          avatar: data.profiles?.avatar_url || '/placeholder-avatar.jpg',
          avatar_url: data.profiles?.avatar_url || '/placeholder-avatar.jpg',
          id: data.profiles?.id
        },
        likes: data.likes_count,
        comments: data.comments_count,
        shares: data.shares_count
      };
    } catch (error) {
      console.error('Error fetching video by ID:', error);
      return null;
    }
  }

  async getVideos(page = 1, filter = ''): Promise<{ videos: Video[], hasMore: boolean }> {
    try {
      const PAGE_SIZE = 10;
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      
      let query = supabase
        .from('videos')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url,
            id
          )
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);
      
      if (filter === 'trending') {
        query = query.order('view_count', { ascending: false });
      } else if (filter === 'latest') {
        query = query.order('created_at', { ascending: false });
      }
      
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      const videos = data.map((video: any) => ({
        ...video,
        user: {
          username: video.profiles?.username || 'Unknown',
          avatar: video.profiles?.avatar_url || '/placeholder-avatar.jpg',
          avatar_url: video.profiles?.avatar_url || '/placeholder-avatar.jpg',
          id: video.profiles?.id
        },
        likes: video.likes_count,
        comments: video.comments_count,
        shares: video.shares_count
      }));
      
      const hasMore = count !== null ? from + videos.length < count : false;
      
      return { videos, hasMore };
    } catch (error) {
      console.error('Error fetching videos:', error);
      return { videos: [], hasMore: false };
    }
  }

  async uploadVideo(videoFile: File, thumbnailFile: File, title: string, description: string): Promise<Video | null> {
    try {
      const videoFileName = `videos/${Date.now()}-${videoFile.name}`;
      const { error: videoUploadError } = await supabase.storage
        .from('media')
        .upload(videoFileName, videoFile);
      
      if (videoUploadError) throw videoUploadError;
      
      const thumbnailFileName = `thumbnails/${Date.now()}-${thumbnailFile.name}`;
      const { error: thumbnailUploadError } = await supabase.storage
        .from('media')
        .upload(thumbnailFileName, thumbnailFile);
      
      if (thumbnailUploadError) throw thumbnailUploadError;
      
      const { data: videoData } = supabase.storage
        .from('media')
        .getPublicUrl(videoFileName);
      
      const { data: thumbnailData } = supabase.storage
        .from('media')
        .getPublicUrl(thumbnailFileName);
      
      const { data: video, error } = await supabase
        .from('videos')
        .insert({
          title,
          description,
          video_url: videoData.publicUrl,
          thumbnail_url: thumbnailData.publicUrl
        })
        .select()
        .single();
      
      if (error) throw error;
      
      const { data: { user } } = await supabase.auth.getUser();
      
      return {
        ...video,
        user: {
          username: user?.user_metadata?.username || 'Unknown',
          avatar: user?.user_metadata?.avatar_url || '/placeholder-avatar.jpg',
          avatar_url: user?.user_metadata?.avatar_url || '/placeholder-avatar.jpg',
          id: user?.id
        },
        likes: 0,
        comments: 0,
        shares: 0
      };
    } catch (error) {
      console.error('Error uploading video:', error);
      return null;
    }
  }

  async searchVideos(query: string): Promise<Video[]> {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url,
            id
          )
        `)
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      
      return data.map((video: any) => ({
        ...video,
        user: {
          username: video.profiles?.username || 'Unknown',
          avatar: video.profiles?.avatar_url || '/placeholder-avatar.jpg',
          avatar_url: video.profiles?.avatar_url || '/placeholder-avatar.jpg',
          id: video.profiles?.id
        },
        likes: video.likes_count,
        comments: video.comments_count,
        shares: video.shares_count
      }));
    } catch (error) {
      console.error('Error searching videos:', error);
      return [];
    }
  }

  async getLikedVideos(): Promise<Video[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return [];
      }
      
      const { data, error } = await supabase
        .from('video_likes')
        .select(`
          videos:video_id (
            *,
            profiles:user_id (
              username,
              avatar_url,
              id
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map((item: any) => ({
        ...item.videos,
        user: {
          username: item.videos.profiles?.username || 'Unknown',
          avatar: item.videos.profiles?.avatar_url || '/placeholder-avatar.jpg',
          avatar_url: item.videos.profiles?.avatar_url || '/placeholder-avatar.jpg',
          id: item.videos.profiles?.id
        },
        likes: item.videos.likes_count,
        comments: item.videos.comments_count,
        shares: item.videos.shares_count,
        is_liked: true
      }));
    } catch (error) {
      console.error('Error fetching liked videos:', error);
      return [];
    }
  }

  async reportVideo(videoId: string, reason: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated to report videos');
      }
      
      const { error } = await supabase
        .from('video_reports')
        .insert({
          video_id: videoId,
          user_id: user.id,
          reason
        });
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error reporting video:', error);
      return false;
    }
  }

  async likeVideo(videoId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('video_likes')
        .insert({ video_id: videoId, user_id: userId });
      
      if (error) throw error;
      
      await this.incrementVideoCounter(videoId, 'likes_count');
    } catch (error) {
      console.error('Error liking video:', error);
      throw error;
    }
  }

  async unlikeVideo(videoId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('video_likes')
        .delete()
        .eq('video_id', videoId)
        .eq('user_id', userId);
      
      if (error) throw error;
      
      await supabase.rpc('decrement_video_counter', {
        video_id: videoId,
        counter_name: 'likes_count'
      });
    } catch (error) {
      console.error('Error unliking video:', error);
      throw error;
    }
  }

  async saveVideo(videoId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('video_bookmarks')
        .insert({ video_id: videoId, user_id: userId });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error saving video:', error);
      throw error;
    }
  }

  async unsaveVideo(videoId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('video_bookmarks')
        .delete()
        .eq('video_id', videoId)
        .eq('user_id', userId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error unsaving video:', error);
      throw error;
    }
  }

  async getUserVideos(userId: string): Promise<Video[]> {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url,
            id
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map((video: any) => ({
        ...video,
        user: {
          username: video.profiles?.username || 'Unknown',
          avatar: video.profiles?.avatar_url || '/placeholder-avatar.jpg',
          avatar_url: video.profiles?.avatar_url || '/placeholder-avatar.jpg',
          id: video.profiles?.id
        },
        likes: video.likes_count,
        comments: video.comments_count,
        shares: video.shares_count
      }));
    } catch (error) {
      console.error('Error fetching user videos:', error);
      return [];
    }
  }

  async getSavedVideos(userId: string): Promise<Video[]> {
    try {
      const { data, error } = await supabase
        .from('video_bookmarks')
        .select(`
          videos:video_id (
            *,
            profiles:user_id (
              username,
              avatar_url,
              id
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map((item: any) => ({
        ...item.videos,
        user: {
          username: item.videos.profiles?.username || 'Unknown',
          avatar: item.videos.profiles?.avatar_url || '/placeholder-avatar.jpg',
          avatar_url: item.videos.profiles?.avatar_url || '/placeholder-avatar.jpg',
          id: item.videos.profiles?.id
        },
        likes: item.videos.likes_count,
        comments: item.videos.comments_count,
        shares: item.videos.shares_count,
        is_saved: true
      }));
    } catch (error) {
      console.error('Error fetching saved videos:', error);
      return [];
    }
  }

  async getFollowingVideos(userId: string): Promise<Video[]> {
    try {
      const { data: followingData, error: followingError } = await supabase
        .from('followers')
        .select('following_id')
        .eq('follower_id', userId);
      
      if (followingError) throw followingError;
      
      if (!followingData || followingData.length === 0) {
        return [];
      }
      
      const followingIds = followingData.map(f => f.following_id);
      
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url,
            id
          )
        `)
        .in('user_id', followingIds)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      
      return data.map((video: any) => ({
        ...video,
        user: {
          username: video.profiles?.username || 'Unknown',
          avatar: video.profiles?.avatar_url || '/placeholder-avatar.jpg',
          avatar_url: video.profiles?.avatar_url || '/placeholder-avatar.jpg',
          id: video.profiles?.id
        },
        likes: video.likes_count,
        comments: video.comments_count,
        shares: video.shares_count
      }));
    } catch (error) {
      console.error('Error fetching following videos:', error);
      return [];
    }
  }

  async incrementVideoCounter(videoId: string, counterName: string): Promise<void> {
    try {
      await supabase.rpc('increment_video_counter', {
        video_id: videoId,
        counter_name: counterName
      });
    } catch (error) {
      console.error('Error incrementing video counter:', error);
    }
  }
}

export default new VideoService();
