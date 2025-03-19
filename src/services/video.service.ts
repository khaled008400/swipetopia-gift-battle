
import { supabase } from '@/lib/supabase';
import UploadService from './upload.service';
import { v4 as uuidv4 } from 'uuid';
import { decrementVideoCounter } from '@/utils/db-functions';

class VideoService {
  /**
   * Upload a video with metadata to the database
   */
  async uploadVideo(
    videoFile: File,
    title: string,
    description: string = '',
    thumbnailUrl: string | null = null,
    isPrivate: boolean = false,
    hashtags: string[] = []
  ) {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('You must be logged in to upload videos');
      }
      
      // Upload video if it's a file
      let videoUrl = '';
      if (videoFile instanceof File) {
        const uploadResult = await UploadService.uploadFile(videoFile, 'videos');
        videoUrl = uploadResult;
      }
      
      if (!videoUrl) {
        throw new Error('Failed to upload video file');
      }
      
      // Insert into videos table
      const { data, error } = await supabase
        .from('videos')
        .insert({
          title,
          description,
          video_url: videoUrl,
          thumbnail_url: thumbnailUrl,
          user_id: user.id,
          is_private: isPrivate,
          hashtags
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error inserting video metadata:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error in uploadVideo:', error);
      throw error;
    }
  }
  
  /**
   * Get videos for the feed
   */
  async getVideos(limit: number = 20) {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          profiles:user_id (username, avatar_url)
        `)
        .order('view_count', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('Error fetching videos:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getVideos:', error);
      throw error;
    }
  }
  
  /**
   * Get videos for the "For You" feed
   */
  async getForYouVideos(limit: number = 20) {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          profiles:user_id (username, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('Error fetching For You videos:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getForYouVideos:', error);
      throw error;
    }
  }
  
  /**
   * Get videos from users that the current user follows
   */
  async getFollowingVideos(userId: string, limit: number = 20) {
    try {
      // Get users that the current user is following
      const { data: followingData, error: followingError } = await supabase
        .from('followers')
        .select('following_id')
        .eq('follower_id', userId);
      
      if (followingError) {
        console.error('Error fetching following users:', followingError);
        throw followingError;
      }
      
      // Extract user IDs
      const followingIds = followingData.map(item => item.following_id);
      
      if (followingIds.length === 0) {
        return []; // No following users, return empty array
      }
      
      // Get videos from those users
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          profiles:user_id (username, avatar_url)
        `)
        .in('user_id', followingIds)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('Error fetching following videos:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getFollowingVideos:', error);
      throw error;
    }
  }
  
  /**
   * Get a single video by ID
   */
  async getVideo(videoId: string) {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          profiles:user_id (username, avatar_url)
        `)
        .eq('id', videoId)
        .single();
      
      if (error) {
        console.error('Error fetching video:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error in getVideo:', error);
      throw error;
    }
  }
  
  /**
   * Alias for getVideo to match the function call in WatchPage.tsx
   */
  async getVideoById(videoId: string) {
    return this.getVideo(videoId);
  }
  
  /**
   * Get videos uploaded by a specific user
   */
  async getUserVideos(userId: string, limit: number = 20) {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          profiles:user_id (username, avatar_url)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('Error fetching user videos:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getUserVideos:', error);
      throw error;
    }
  }
  
  /**
   * Get videos liked by a specific user
   */
  async getLikedVideos(userId: string, limit: number = 20) {
    try {
      // First get video IDs that the user has liked
      const { data: likesData, error: likesError } = await supabase
        .from('video_likes')
        .select('video_id')
        .eq('user_id', userId)
        .limit(limit);
      
      if (likesError) {
        console.error('Error fetching user likes:', likesError);
        throw likesError;
      }
      
      if (!likesData.length) {
        return []; // No liked videos
      }
      
      // Extract video IDs
      const videoIds = likesData.map(like => like.video_id);
      
      // Then fetch the actual videos
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          profiles:user_id (username, avatar_url)
        `)
        .in('id', videoIds)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching liked videos:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getLikedVideos:', error);
      throw error;
    }
  }
  
  /**
   * Get videos saved by a specific user
   */
  async getSavedVideos(userId: string, limit: number = 20) {
    try {
      // First get video IDs that the user has saved
      const { data: bookmarksData, error: bookmarksError } = await supabase
        .from('video_bookmarks')
        .select('video_id')
        .eq('user_id', userId)
        .limit(limit);
      
      if (bookmarksError) {
        console.error('Error fetching user bookmarks:', bookmarksError);
        throw bookmarksError;
      }
      
      if (!bookmarksData.length) {
        return []; // No saved videos
      }
      
      // Extract video IDs
      const videoIds = bookmarksData.map(bookmark => bookmark.video_id);
      
      // Then fetch the actual videos
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          profiles:user_id (username, avatar_url)
        `)
        .in('id', videoIds)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching saved videos:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getSavedVideos:', error);
      throw error;
    }
  }
  
  /**
   * Increment a video's view count
   */
  async incrementViews(videoId: string) {
    try {
      await supabase.rpc('increment_video_counter', {
        video_id: videoId,
        counter_name: 'view_count'
      });
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  }
  
  /**
   * Alias for incrementViews to match the function call in HomePage.tsx and Index.tsx
   */
  async incrementViewCount(videoId: string) {
    return this.incrementViews(videoId);
  }
  
  /**
   * Like a video
   */
  async likeVideo(videoId: string, userId: string) {
    try {
      // First check if the user already liked this video
      const { data: existingLike, error: checkError } = await supabase
        .from('video_likes')
        .select('id')
        .eq('video_id', videoId)
        .eq('user_id', userId)
        .maybeSingle();
      
      if (checkError) {
        console.error('Error checking existing like:', checkError);
        throw checkError;
      }
      
      // If like already exists, return early
      if (existingLike) {
        return existingLike;
      }
      
      // Insert new like
      const { data, error } = await supabase
        .from('video_likes')
        .insert({
          video_id: videoId,
          user_id: userId
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error liking video:', error);
        throw error;
      }
      
      // Increment the likes count on the video
      await supabase.rpc('increment_video_counter', {
        video_id: videoId,
        counter_name: 'likes_count'
      });
      
      return data;
    } catch (error) {
      console.error('Error in likeVideo:', error);
      throw error;
    }
  }
  
  /**
   * Unlike a video
   */
  async unlikeVideo(videoId: string, userId: string) {
    try {
      // Delete the like
      const { error } = await supabase
        .from('video_likes')
        .delete()
        .eq('video_id', videoId)
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error unliking video:', error);
        throw error;
      }
      
      // Decrement the likes count on the video
      await decrementVideoCounter(videoId, 'likes_count');
      
      return true;
    } catch (error) {
      console.error('Error in unlikeVideo:', error);
      throw error;
    }
  }
  
  /**
   * Save a video
   */
  async saveVideo(videoId: string, userId: string) {
    try {
      // First check if the user already saved this video
      const { data: existingBookmark, error: checkError } = await supabase
        .from('video_bookmarks')
        .select('id')
        .eq('video_id', videoId)
        .eq('user_id', userId)
        .maybeSingle();
      
      if (checkError) {
        console.error('Error checking existing bookmark:', checkError);
        throw checkError;
      }
      
      // If bookmark already exists, return early
      if (existingBookmark) {
        return existingBookmark;
      }
      
      // Insert new bookmark
      const { data, error } = await supabase
        .from('video_bookmarks')
        .insert({
          video_id: videoId,
          user_id: userId
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error saving video:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error in saveVideo:', error);
      throw error;
    }
  }
  
  /**
   * Unsave a video
   */
  async unsaveVideo(videoId: string, userId: string) {
    try {
      // Delete the bookmark
      const { error } = await supabase
        .from('video_bookmarks')
        .delete()
        .eq('video_id', videoId)
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error unsaving video:', error);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error in unsaveVideo:', error);
      throw error;
    }
  }
  
  /**
   * Search for videos by title or description
   */
  async searchVideos(query: string, limit: number = 20) {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          profiles:user_id (username, avatar_url)
        `)
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .order('view_count', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('Error searching videos:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in searchVideos:', error);
      throw error;
    }
  }
  
  /**
   * Report a video
   */
  async reportVideo(videoId: string, reportData: { category: string, description?: string }) {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('You must be logged in to report videos');
      }
      
      // Insert into video_interactions table as a report
      const { data, error } = await supabase
        .from('video_interactions')
        .insert({
          video_id: videoId,
          user_id: user.id,
          interaction_type: 'report',
          content: JSON.stringify(reportData)
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error reporting video:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error in reportVideo:', error);
      throw error;
    }
  }
}

export default new VideoService();
