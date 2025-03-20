
import { supabase, getAuthenticatedUser } from './base.service';
import { Video } from '@/types/video.types';

class VideoInteractionService {
  // Increment view count for a video
  async incrementViewCount(videoId: string): Promise<void> {
    try {
      const { error } = await supabase.rpc('increment_view_count', {
        video_id: videoId
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error incrementing view count:", error);
      throw error;
    }
  }

  // Like a video
  async likeVideo(videoId: string): Promise<void> {
    try {
      // First, insert into likes table
      const { error: likesError } = await supabase
        .from('likes')
        .insert({ video_id: videoId, user_id: (await supabase.auth.getUser()).data.user?.id });

      if (likesError) throw likesError;

      // Increment likes count
      const { error: countError } = await supabase.rpc('increment_likes_count', {
        video_id: videoId
      });

      if (countError) throw countError;
    } catch (error) {
      console.error("Error liking video:", error);
      throw error;
    }
  }

  // Unlike a video
  async unlikeVideo(videoId: string): Promise<void> {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      
      // Delete from likes table
      const { error: likesError } = await supabase
        .from('likes')
        .delete()
        .eq('video_id', videoId)
        .eq('user_id', userId);

      if (likesError) throw likesError;

      // Decrement likes count
      const { error: countError } = await supabase.rpc('decrement_likes_count', {
        video_id: videoId
      });

      if (countError) throw countError;
    } catch (error) {
      console.error("Error unliking video:", error);
      throw error;
    }
  }

  // Save a video
  async saveVideo(videoId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('saved_videos')
        .insert({ video_id: videoId, user_id: (await supabase.auth.getUser()).data.user?.id });

      if (error) throw error;
    } catch (error) {
      console.error("Error saving video:", error);
      throw error;
    }
  }

  // Unsave a video
  async unsaveVideo(videoId: string): Promise<void> {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      
      const { error } = await supabase
        .from('saved_videos')
        .delete()
        .eq('video_id', videoId)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error("Error unsaving video:", error);
      throw error;
    }
  }

  // Check if a video is liked by the current user
  async checkIfVideoLiked(videoId: string): Promise<boolean> {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) return false;
      
      const { data, error } = await supabase
        .from('likes')
        .select('id')
        .eq('video_id', videoId)
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error("Error checking if video liked:", error);
      return false;
    }
  }

  // Check if a video is saved by the current user
  async checkIfVideoSaved(videoId: string): Promise<boolean> {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) return false;
      
      const { data, error } = await supabase
        .from('saved_videos')
        .select('id')
        .eq('video_id', videoId)
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error("Error checking if video saved:", error);
      return false;
    }
  }

  // Report a video
  async reportVideo(videoId: string, report: string | { category: string, description: string }): Promise<void> {
    try {
      const user = await getAuthenticatedUser();

      let reportCategory = 'other';
      let reportDescription = '';

      if (typeof report === 'string') {
        reportDescription = report;
      } else {
        reportCategory = report.category;
        reportDescription = report.description;
      }

      const { error } = await supabase
        .from('video_reports')
        .insert({
          video_id: videoId,
          user_id: user.id,
          report_category: reportCategory,
          report_description: reportDescription,
          status: 'pending'
        });

      if (error) throw error;
    } catch (error) {
      console.error("Error reporting video:", error);
      throw error;
    }
  }
}

// Export a singleton instance
export default new VideoInteractionService();
