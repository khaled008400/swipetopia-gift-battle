
import { supabase } from "@/integrations/supabase/client";
import { Video } from "@/types/video.types";

const VideoService = {
  getFeedVideos: async () => {
    const { data, error } = await supabase
      .from('short_videos')
      .select(`
        *,
        profiles (username, avatar_url)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching feed videos:', error);
      return [];
    }

    return data || [];
  },

  getTrendingVideos: async () => {
    const { data, error } = await supabase
      .from('short_videos')
      .select(`
        *,
        profiles (username, avatar_url)
      `)
      .order('view_count', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching trending videos:', error);
      return [];
    }

    return data || [];
  },

  getUserVideos: async (userId: string) => {
    const { data, error } = await supabase
      .from('short_videos')
      .select(`
        *,
        profiles (username, avatar_url)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user videos:', error);
      return [];
    }

    return data || [];
  },

  getVideoById: async (id: string) => {
    const { data, error } = await supabase
      .from('short_videos')
      .select(`
        *,
        profiles (username, avatar_url)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching video by id:', error);
      return null;
    }

    return data;
  },

  searchVideos: async (query: string) => {
    const { data, error } = await supabase
      .from('short_videos')
      .select(`
        *,
        profiles (username, avatar_url)
      `)
      .or(`title.ilike.%${query}%, description.ilike.%${query}%`);

    if (error) {
      console.error('Error searching videos:', error);
      return [];
    }

    return data || [];
  },

  downloadVideo: async (videoId: string) => {
    // Log the download action
    await supabase.rpc('log_video_download', { 
      video_id: videoId 
    });
    
    // Get the video URL
    const { data } = await supabase
      .from('short_videos')
      .select('video_url')
      .eq('id', videoId)
      .single();

    return data?.video_url || null;
  },

  shareVideo: async (videoId: string) => {
    // Log the share action
    await supabase.rpc('log_video_share', { 
      video_id: videoId 
    });
    return true;
  },

  likeVideo: async (videoId: string, userId: string) => {
    const { error } = await supabase
      .from('video_likes')
      .insert({ video_id: videoId, user_id: userId });

    if (error && error.code !== '23505') { // Ignore unique violation errors
      console.error('Error liking video:', error);
      return false;
    }

    return true;
  },

  unlikeVideo: async (videoId: string, userId: string) => {
    const { error } = await supabase
      .from('video_likes')
      .delete()
      .match({ video_id: videoId, user_id: userId });

    if (error) {
      console.error('Error unliking video:', error);
      return false;
    }

    return true;
  },

  reportVideo: async (videoId: string, reason: string) => {
    // First get user ID from auth
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to report videos');
    }
    
    // Log the report
    await supabase.rpc('report_video', { 
      p_video_id: videoId, 
      p_reason: reason,
      p_reporter_id: user.id
    });

    return true;
  },
  
  uploadVideo: async (videoData: {
    title: string;
    description?: string;
    hashtags?: string[];
    isPublic: boolean;
    allowDownloads: boolean;
    videoFile: File;
  }) => {
    // First get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to upload videos');
    }
    
    // Upload the video file to storage
    const fileExt = videoData.videoFile.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `videos/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('videos')
      .upload(filePath, videoData.videoFile);
      
    if (uploadError) {
      console.error('Error uploading video file:', uploadError);
      throw uploadError;
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('videos')
      .getPublicUrl(filePath);
      
    // Create a thumbnail (in a real app this would be generated)
    const thumbnailUrl = 'https://placehold.co/600x400/333/FFF?text=Video+Thumbnail';
    
    // Create the video record in the database
    const { data, error } = await supabase
      .from('short_videos')
      .insert({
        user_id: user.id,
        title: videoData.title,
        description: videoData.description || '',
        video_url: publicUrl,
        thumbnail_url: thumbnailUrl,
        // Additional metadata from the form would be added here
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error creating video record:', error);
      throw error;
    }
    
    return {
      ...data,
      title: videoData.title,
      description: videoData.description,
      hashtags: videoData.hashtags,
      isPublic: videoData.isPublic,
      allowDownloads: videoData.allowDownloads,
    };
  }
};

export default VideoService;
