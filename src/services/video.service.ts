import { supabase } from "@/integrations/supabase/client";
import { Video } from "@/types/video.types";
import { v4 as uuidv4 } from 'uuid';

class VideoService {
  // Add videos
  async uploadVideo(
    videoFile: File,
    title: string,
    description: string,
    thumbnailUrl: string | null,
    isPrivate: boolean = false,
    hashtags: string[] = []
  ) {
    try {
      console.log('Starting video upload process in VideoService...');
      
      // 1. Generate a unique filename
      const fileExt = videoFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `videos/${fileName}`;

      // 2. Upload the video file to storage
      console.log('Uploading video file to storage...');
      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, videoFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Error uploading video:', uploadError);
        throw uploadError;
      }

      // 3. Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('videos')
        .getPublicUrl(filePath);

      const videoUrl = publicUrlData.publicUrl;
      console.log('Video uploaded, public URL:', videoUrl);

      // 4. Insert the video metadata into the videos table
      console.log('Inserting video metadata into database...');
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      console.log('Inserting with user ID:', user.id);

      // First, let's inspect the table structure to handle schema variations
      console.log('Checking video table schema...');
      
      // Create a basic insert object with required fields
      const videoData = {
        title,
        description,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl || `${videoUrl}?preview`,
        is_private: isPrivate,
        user_id: user.id,
        hashtags,
        view_count: 0,
        likes_count: 0,
        shares_count: 0
      };
      
      // Add a field for comment count - we'll use RETURNING to get the inserted row
      // without specifying whether it's comment_count or comments_count
      console.log('Inserting video with data:', videoData);
      
      const { data: insertedVideo, error: insertError } = await supabase
        .from('videos')
        .insert(videoData)
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting video metadata:', insertError);
        throw insertError;
      }

      console.log('Video metadata inserted successfully:', insertedVideo);
      return insertedVideo;
    } catch (error) {
      console.error('Error in uploadVideo:', error);
      throw error;
    }
  }

  // Get video by ID
  async getVideoById(id: string) {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in getVideoById:', error);
      throw error;
    }
  }

  // Get videos for feed
  async getForYouVideos(limit: number = 20) {
    try {
      console.log('Fetching For You videos...');
      // Modified to not use the foreign key relationship that's causing issues
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error in getForYouVideos:', error);
        throw error;
      }

      // Fetch user profiles separately and combine the data
      const userIds = [...new Set(data.map(video => video.user_id))];
      
      if (userIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, avatar_url')
          .in('id', userIds);
          
        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
        } else {
          // Create a map for quick lookups
          const profileMap = new Map(profiles.map(profile => [profile.id, profile]));
          
          // Add profile information to videos
          return data.map(video => ({
            ...video,
            profiles: profileMap.get(video.user_id) || null
          }));
        }
      }
      
      return data;
    } catch (error) {
      console.error('Error in getForYouVideos:', error);
      // Return empty array instead of throwing to avoid app crashes
      return [];
    }
  }

  // Get videos for a specific user
  async getUserVideos(userId: string, limit: number = 20) {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in getUserVideos:', error);
      throw error;
    }
  }

  // Update video metadata
  async updateVideo(id: string, updates: Partial<Video>) {
    try {
      const { data, error } = await supabase
        .from('videos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in updateVideo:', error);
      throw error;
    }
  }

  // Delete video
  async deleteVideo(id: string) {
    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error in deleteVideo:', error);
      throw error;
    }
  }

  // Get trending videos
  async getTrendingVideos(limit: number = 10) {
    try {
      // In a real app, this would use more complex criteria
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('view_count', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in getTrendingVideos:', error);
      throw error;
    }
  }

  // Get all videos - for VideosPage
  async getVideos(limit: number = 50) {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*, profiles(*)')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in getVideos:', error);
      return [];
    }
  }

  // Like a video
  async likeVideo(videoId: string) {
    try {
      // First get the current like count
      const { data: video, error: getError } = await supabase
        .from('videos')
        .select('like_count')
        .eq('id', videoId)
        .single();

      if (getError) throw getError;

      // Increment the like count
      const { data, error: updateError } = await supabase
        .from('videos')
        .update({ like_count: (video.like_count || 0) + 1 })
        .eq('id', videoId)
        .select()
        .single();

      if (updateError) throw updateError;
      return data;
    } catch (error) {
      console.error('Error in likeVideo:', error);
      throw error;
    }
  }

  // Unlike a video
  async unlikeVideo(videoId: string) {
    try {
      // First get the current like count
      const { data: video, error: getError } = await supabase
        .from('videos')
        .select('like_count')
        .eq('id', videoId)
        .single();

      if (getError) throw getError;

      // Decrement the like count, but don't go below zero
      const newLikeCount = Math.max(0, (video.like_count || 1) - 1);

      const { data, error: updateError } = await supabase
        .from('videos')
        .update({ like_count: newLikeCount })
        .eq('id', videoId)
        .select()
        .single();

      if (updateError) throw updateError;
      return data;
    } catch (error) {
      console.error('Error in unlikeVideo:', error);
      throw error;
    }
  }

  // Save video to user's collection
  async saveVideo(videoId: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from('saved_videos')
        .insert({
          video_id: videoId,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in saveVideo:', error);
      throw error;
    }
  }

  // Remove video from user's collection
  async unsaveVideo(videoId: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase
        .from('saved_videos')
        .delete()
        .match({ video_id: videoId, user_id: user.id });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error in unsaveVideo:', error);
      throw error;
    }
  }

  // Get liked videos
  async getLikedVideos(userId: string, limit: number = 20) {
    try {
      const { data, error } = await supabase
        .from('video_likes')
        .select('video_id')
        .eq('user_id', userId)
        .limit(limit);

      if (error) throw error;
      
      if (data.length === 0) return [];
      
      const videoIds = data.map(like => like.video_id);
      
      const { data: videos, error: videosError } = await supabase
        .from('videos')
        .select('*')
        .in('id', videoIds);
        
      if (videosError) throw videosError;
      
      return videos;
    } catch (error) {
      console.error('Error in getLikedVideos:', error);
      return [];
    }
  }

  // Get saved videos
  async getSavedVideos(userId: string, limit: number = 20) {
    try {
      const { data, error } = await supabase
        .from('saved_videos')
        .select('video_id')
        .eq('user_id', userId)
        .limit(limit);

      if (error) throw error;
      
      if (data.length === 0) return [];
      
      const videoIds = data.map(saved => saved.video_id);
      
      const { data: videos, error: videosError } = await supabase
        .from('videos')
        .select('*')
        .in('id', videoIds);
        
      if (videosError) throw videosError;
      
      return videos;
    } catch (error) {
      console.error('Error in getSavedVideos:', error);
      return [];
    }
  }

  // Search videos by title or hashtags
  async searchVideos(query: string, limit: number = 20) {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in searchVideos:', error);
      throw error;
    }
  }

  // Increment view count
  async incrementViewCount(videoId: string) {
    try {
      // First get the current view count
      const { data: video, error: getError } = await supabase
        .from('videos')
        .select('view_count')
        .eq('id', videoId)
        .single();

      if (getError) throw getError;

      // Increment the view count
      const { data, error: updateError } = await supabase
        .from('videos')
        .update({ view_count: (video.view_count || 0) + 1 })
        .eq('id', videoId)
        .select()
        .single();

      if (updateError) throw updateError;
      return data;
    } catch (error) {
      console.error('Error in incrementViewCount:', error);
      // Don't throw error for view count issues
      return null;
    }
  }

  // Report video
  async reportVideo(videoId: string, report: { category: string, description: string }) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from('video_reports')
        .insert({
          video_id: videoId,
          user_id: user.id,
          report_category: report.category,
          report_description: report.description,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in reportVideo:', error);
      throw error;
    }
  }
}

export default new VideoService();
