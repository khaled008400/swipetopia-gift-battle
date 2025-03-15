
import { supabase } from "@/integrations/supabase/client";
import axios from "axios";

const VideoService = {
  uploadVideo: async (file: File, metadata: any) => {
    try {
      // Generate unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `videos/${fileName}`;
      
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(filePath);
      
      // Create video record in database
      const { data, error } = await supabase
        .from('videos')
        .insert({
          title: metadata.title,
          description: metadata.description,
          video_url: publicUrl,
          thumbnail_url: metadata.thumbnailUrl,
          user_id: metadata.userId,
          status: 'processing', // Initial status
          hashtags: metadata.hashtags
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error uploading video:', error);
      throw error;
    }
  },
  
  getUserVideos: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          id,
          title,
          description,
          video_url,
          thumbnail_url,
          view_count,
          created_at,
          user_id,
          profiles (
            username,
            avatar_url
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching user videos:', error);
      return [];
    }
  },
  
  getVideoById: async (videoId: string) => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          id,
          title,
          description,
          video_url,
          thumbnail_url,
          view_count,
          user_id,
          created_at,
          profiles (
            username,
            avatar_url
          )
        `)
        .eq('id', videoId)
        .single();
      
      if (error) throw error;
      
      // Increment view count
      await supabase.rpc('increment_video_views', {
        video_id: videoId
      });
      
      return data;
    } catch (error) {
      console.error('Error fetching video:', error);
      throw error;
    }
  },
  
  likeVideo: async (videoId: string, userId: string) => {
    try {
      // Check if already liked
      const { data: existingLike, error: checkError } = await supabase
        .from('video_likes')
        .select('id')
        .eq('video_id', videoId)
        .eq('user_id', userId)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (existingLike) {
        // Unlike if already liked
        const { error: unlikeError } = await supabase
          .from('video_likes')
          .delete()
          .eq('id', existingLike.id);
        
        if (unlikeError) throw unlikeError;
        return { liked: false };
      } else {
        // Like if not already liked
        const { error: likeError } = await supabase
          .from('video_likes')
          .insert({
            video_id: videoId,
            user_id: userId
          });
        
        if (likeError) throw likeError;
        return { liked: true };
      }
    } catch (error) {
      console.error('Error liking/unliking video:', error);
      throw error;
    }
  },
  
  getComments: async (videoId: string) => {
    try {
      const { data, error } = await supabase
        .from('video_comments')
        .select(`
          id,
          comment,
          created_at,
          user_id,
          profiles (
            username,
            avatar_url
          )
        `)
        .eq('video_id', videoId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  },
  
  addComment: async (videoId: string, userId: string, comment: string) => {
    try {
      const { data, error } = await supabase
        .from('video_comments')
        .insert({
          video_id: videoId,
          user_id: userId,
          comment
        })
        .select(`
          id,
          comment,
          created_at,
          user_id,
          profiles (
            username,
            avatar_url
          )
        `)
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },
  
  getTrendingVideos: async (limit = 10) => {
    try {
      const { data, error } = await supabase.rpc('get_trending_videos', {
        p_limit: limit
      });
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching trending videos:', error);
      return [];
    }
  },
  
  searchVideos: async (query: string) => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          id,
          title,
          description,
          thumbnail_url,
          view_count,
          created_at,
          profiles (
            username,
            avatar_url
          )
        `)
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .order('view_count', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error searching videos:', error);
      return [];
    }
  },
  
  reportVideo: async (videoId: string, userId: string, reason: string) => {
    try {
      const { error } = await supabase
        .from('video_reports')
        .insert({
          video_id: videoId,
          user_id: userId,
          reason
        });
      
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error('Error reporting video:', error);
      throw error;
    }
  }
};

export default VideoService;
