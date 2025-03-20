import { supabase, getAuthenticatedUser } from './base.service';

class VideoInteractionService {
  // Update video metadata
  async updateVideo(id: string, updates: any) {
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
      const user = await getAuthenticatedUser();

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
      const user = await getAuthenticatedUser();

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

  // Report video - updated to handle both string reason and object with category/description
  async reportVideo(videoId: string, report: string | { category: string, description: string }) {
    try {
      const user = await getAuthenticatedUser();
      
      // Process the report data based on its type
      let reportCategory: string;
      let reportDescription: string;
      
      if (typeof report === 'string') {
        // Legacy format: just a reason string
        reportCategory = 'other';
        reportDescription = report;
      } else {
        // New format: object with category and description
        reportCategory = report.category;
        reportDescription = report.description;
      }

      const { data, error } = await supabase
        .from('video_reports')
        .insert({
          video_id: videoId,
          user_id: user.id,
          report_category: reportCategory,
          report_description: reportDescription,
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

export default new VideoInteractionService();
