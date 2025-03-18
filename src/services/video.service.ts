
import { supabase } from '@/integrations/supabase/client';
import { Video, Comment } from '@/types/video.types';

class VideoService {
  async uploadVideo(file: File, title: string, description: string, thumbnail?: string | null): Promise<any> {
    // Implementation
    console.log('Video upload', file, title, description, thumbnail);
    return { id: 'new-video-id' };
  }

  async getVideo(id: string): Promise<Video> {
    // Implementation to get video by id
    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        user:profiles(*)
      `)
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data as unknown as Video;
  }

  // Alias for getVideo to fix getVideoById references
  async getVideoById(id: string): Promise<Video> {
    return this.getVideo(id);
  }

  async getComments(videoId: string): Promise<Comment[]> {
    // Implementation to get video comments
    const { data, error } = await supabase
      .from('video_comments')
      .select(`
        *,
        user:profiles(username, avatar_url)
      `)
      .eq('video_id', videoId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data as unknown as Comment[];
  }

  async addComment(videoId: string, comment: string): Promise<Comment> {
    // Implementation to add a comment
    const { data, error } = await supabase
      .from('video_comments')
      .insert({
        video_id: videoId,
        user_id: supabase.auth.getUser().then(res => res.data.user?.id),
        content: comment
      })
      .select(`
        *,
        user:profiles(username, avatar_url)
      `)
      .single();
      
    if (error) throw error;
    return data as unknown as Comment;
  }

  async likeVideo(videoId: string, userId: string): Promise<void> {
    // Implementation to like a video
    const { error } = await supabase
      .from('video_likes')
      .insert({
        video_id: videoId,
        user_id: userId
      });
      
    if (error) throw error;
    
    // Increment the likes count
    await supabase.rpc('increment_video_counter', {
      video_id: videoId,
      counter_name: 'likes_count'
    });
  }

  async unlikeVideo(videoId: string, userId: string): Promise<void> {
    // Implementation to unlike a video
    const { error } = await supabase
      .from('video_likes')
      .delete()
      .eq('video_id', videoId)
      .eq('user_id', userId);
      
    if (error) throw error;
    
    // We would need a separate RPC to decrement the counter
    // This is a simplified approach
    const { data } = await supabase
      .from('videos')
      .select('likes_count')
      .eq('id', videoId)
      .single();
      
    if (data && data.likes_count > 0) {
      await supabase
        .from('videos')
        .update({ likes_count: data.likes_count - 1 })
        .eq('id', videoId);
    }
  }

  async saveVideo(videoId: string, userId: string): Promise<void> {
    // Implementation to save/bookmark a video
    const { error } = await supabase
      .from('video_bookmarks')
      .insert({
        video_id: videoId,
        user_id: userId
      });
      
    if (error) throw error;
  }

  async unsaveVideo(videoId: string, userId: string): Promise<void> {
    // Implementation to unsave/unbookmark a video
    const { error } = await supabase
      .from('video_bookmarks')
      .delete()
      .eq('video_id', videoId)
      .eq('user_id', userId);
      
    if (error) throw error;
  }

  async reportVideo(videoId: string, reason: string): Promise<void> {
    // Implementation to report a video
    const { error } = await supabase
      .from('video_reports')
      .insert({
        video_id: videoId,
        user_id: supabase.auth.getUser().then(res => res.data.user?.id),
        reason: reason
      });
      
    if (error) throw error;
  }

  async getLikedVideos(userId: string): Promise<Video[]> {
    // Implementation to get videos liked by a user
    const { data, error } = await supabase
      .from('video_likes')
      .select('video_id')
      .eq('user_id', userId);
      
    if (error) throw error;
    
    if (!data || data.length === 0) return [];
    
    const videoIds = data.map(like => like.video_id);
    
    const { data: videos, error: videosError } = await supabase
      .from('videos')
      .select(`
        *,
        user:profiles(*)
      `)
      .in('id', videoIds);
      
    if (videosError) throw videosError;
    
    return videos as unknown as Video[];
  }

  async getUserVideos(userId: string): Promise<Video[]> {
    // Implementation to get videos created by a user
    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        user:profiles(*)
      `)
      .eq('user_id', userId);
      
    if (error) throw error;
    
    return data as unknown as Video[];
  }

  async getSavedVideos(userId: string): Promise<Video[]> {
    // Implementation to get videos saved by a user
    const { data, error } = await supabase
      .from('video_bookmarks')
      .select('video_id')
      .eq('user_id', userId);
      
    if (error) throw error;
    
    if (!data || data.length === 0) return [];
    
    const videoIds = data.map(bookmark => bookmark.video_id);
    
    const { data: videos, error: videosError } = await supabase
      .from('videos')
      .select(`
        *,
        user:profiles(*)
      `)
      .in('id', videoIds);
      
    if (videosError) throw videosError;
    
    return videos as unknown as Video[];
  }

  async getForYouVideos(): Promise<Video[]> {
    // Implementation to get recommended/trending videos
    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        user:profiles(*)
      `)
      .order('view_count', { ascending: false })
      .limit(20);
      
    if (error) throw error;
    
    return data as unknown as Video[];
  }

  async getFollowingVideos(userId: string): Promise<Video[]> {
    // Implementation to get videos from followed users
    const { data: followingData, error: followingError } = await supabase
      .from('followers')
      .select('following_id')
      .eq('follower_id', userId);
      
    if (followingError) throw followingError;
    
    if (!followingData || followingData.length === 0) return [];
    
    const followingIds = followingData.map(follow => follow.following_id);
    
    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        user:profiles(*)
      `)
      .in('user_id', followingIds)
      .order('created_at', { ascending: false })
      .limit(20);
      
    if (error) throw error;
    
    return data as unknown as Video[];
  }

  async incrementViewCount(videoId: string): Promise<void> {
    // Implementation to increment view count
    await supabase.rpc('increment_video_counter', {
      video_id: videoId,
      counter_name: 'view_count'
    });
  }

  async searchVideos(query: string): Promise<Video[]> {
    // Implementation to search videos
    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        user:profiles(*)
      `)
      .or(`title.ilike.%${query}%, description.ilike.%${query}%`)
      .order('view_count', { ascending: false });
      
    if (error) throw error;
    
    return data as unknown as Video[];
  }
  
  // Add method to get all videos
  async getVideos(): Promise<Video[]> {
    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        user:profiles(*)
      `)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data as unknown as Video[];
  }
}

export default new VideoService();
