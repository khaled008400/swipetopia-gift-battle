
import fetchVideoService from './video/fetch.service';
import uploadVideoService from './video/upload.service';
import { supabase } from '@/integrations/supabase/client';

const VideoService = {
  // Upload a video
  uploadVideo: (
    videoFile: File, 
    title: string, 
    description: string, 
    thumbnailUrl: string | null, 
    isPrivate: boolean = false, 
    hashtags: string[] = []
  ) => {
    return uploadVideoService.uploadVideo(
      videoFile, 
      title, 
      description, 
      thumbnailUrl, 
      isPrivate, 
      hashtags
    );
  },

  // Get all videos
  getVideos: () => fetchVideoService.fetchVideos(),

  // Get a single video by id
  getVideo: (id: string) => fetchVideoService.fetchVideo(id),

  // Get videos by user id
  getUserVideos: (userId: string) => fetchVideoService.fetchUserVideos(userId),

  // Like a video
  likeVideo: async (videoId: string) => {
    try {
      const { data, error } = await supabase
        .from('video_likes')
        .insert({ video_id: videoId })
        .select();

      if (error) throw error;

      // Increment like count
      await supabase.rpc('increment_video_counter', {
        video_id: videoId,
        counter_name: 'likes_count'
      });

      return data;
    } catch (error) {
      console.error('Error liking video:', error);
      throw error;
    }
  },

  // Unlike a video
  unlikeVideo: async (videoId: string) => {
    try {
      const { error } = await supabase
        .from('video_likes')
        .delete()
        .match({ video_id: videoId });

      if (error) throw error;

      // Decrement like count
      // We would ideally have a decrement function but we're using a workaround for now
      const { data: video } = await supabase
        .from('videos')
        .select('likes_count')
        .eq('id', videoId)
        .single();

      if (video && video.likes_count > 0) {
        await supabase
          .from('videos')
          .update({ likes_count: video.likes_count - 1 })
          .eq('id', videoId);
      }

      return true;
    } catch (error) {
      console.error('Error unliking video:', error);
      throw error;
    }
  },

  // Save a video
  saveVideo: async (videoId: string) => {
    try {
      const { data, error } = await supabase
        .from('video_bookmarks')
        .insert({ video_id: videoId })
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving video:', error);
      throw error;
    }
  },

  // Unsave a video
  unsaveVideo: async (videoId: string) => {
    try {
      const { error } = await supabase
        .from('video_bookmarks')
        .delete()
        .match({ video_id: videoId });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error unsaving video:', error);
      throw error;
    }
  },

  // Check if a video exists
  checkVideoExists: async (videoId: string) => {
    return uploadVideoService.checkVideoExists(videoId);
  }
};

export default VideoService;
