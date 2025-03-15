import api from './api';
import { supabase } from '@/integrations/supabase/client';

export interface Video {
  id: string;
  url: string;
  thumbnail?: string;
  description: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked?: boolean;
  downloads?: number;
  allowDownloads?: boolean;
  isPublic?: boolean;
  hashtags?: string[];
  user: {
    id: string;
    username: string;
    avatar: string;
    isFollowing?: boolean;
  };
  isLive?: boolean;
  privacy?: "public" | "private" | "followers";
  createdAt?: string;
  title?: string;
}

export interface UploadVideoParams {
  title: string;
  description: string;
  hashtags: string[];
  isPublic: boolean;
  allowDownloads: boolean;
  videoFile: File;
}

export interface VideoComment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    avatar: string;
  };
}

export interface ReportVideoParams {
  videoId: string;
  reason: string;
  details?: string;
}

// Store uploaded videos in memory for demo purposes
const uploadedVideos: Video[] = [];

export const VideoService = {
  async getFeedVideos() {
    try {
      // Try to fetch videos from Supabase
      const { data: supabaseVideos, error } = await supabase
        .from('short_videos')
        .select(`
          id,
          title,
          description,
          video_url,
          thumbnail_url,
          view_count,
          user_id,
          created_at,
          profiles(username, avatar_url)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching videos from Supabase:", error);
        throw error;
      }
      
      // Format the videos to match our interface
      const formattedVideos = supabaseVideos.map(video => ({
        id: video.id,
        url: video.video_url,
        thumbnail: video.thumbnail_url || '',
        title: video.title,
        description: video.description || '',
        likes: 0, // These can be fetched from separate tables if needed
        comments: 0,
        shares: 0,
        isPublic: true,
        createdAt: video.created_at,
        user: {
          id: video.user_id,
          username: video.profiles?.username || 'unknown',
          avatar: video.profiles?.avatar_url || '/placeholder.svg',
          isFollowing: false
        }
      }));
      
      // If we have uploaded videos, add them to the feed
      if (uploadedVideos.length > 0) {
        return [...uploadedVideos, ...formattedVideos]; 
      }
      
      return formattedVideos;
    } catch (error) {
      console.error("Error fetching feed videos:", error);
      
      // If API call fails, return uploaded videos if we have any
      if (uploadedVideos.length > 0) {
        return uploadedVideos;
      }
      
      // Fallback to original API
      try {
        const response = await api.get('/videos/feed');
        return response.data;
      } catch (apiError) {
        console.error("Fallback API also failed:", apiError);
        return [];
      }
    }
  },

  async getTrendingVideos() {
    try {
      const response = await api.get('/videos/trending');
      return response.data;
    } catch (error) {
      console.error("Error fetching trending videos:", error);
      return [];
    }
  },

  async getUserVideos(userId: string) {
    try {
      const response = await api.get(`/users/${userId}/videos`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user videos:", error);
      return [];
    }
  },

  async getLikedVideos() {
    try {
      const response = await api.get('/videos/liked');
      return response.data;
    } catch (error) {
      console.error("Error fetching liked videos:", error);
      return [];
    }
  },

  async getBattleVideos() {
    try {
      const response = await api.get('/videos/battles');
      return response.data;
    } catch (error) {
      console.error("Error fetching battle videos:", error);
      return [];
    }
  },

  async likeVideo(videoId: string) {
    try {
      // First try to update the in-memory videos
      const videoIndex = uploadedVideos.findIndex(v => v.id === videoId);
      if (videoIndex !== -1) {
        uploadedVideos[videoIndex].likes += 1;
        uploadedVideos[videoIndex].isLiked = true;
        return uploadedVideos[videoIndex];
      }
      
      // Then try Supabase
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      
      if (userData.user) {
        const { error } = await supabase
          .from('video_likes')
          .insert({
            user_id: userData.user.id,
            video_id: videoId
          });
          
        if (error) throw error;
      }
      
      // Fallback to original API
      const response = await api.post(`/videos/${videoId}/like`);
      return response.data;
    } catch (error) {
      console.error("Error liking video:", error);
      throw error;
    }
  },

  async unlikeVideo(videoId: string) {
    try {
      // First try to update the in-memory videos
      const videoIndex = uploadedVideos.findIndex(v => v.id === videoId);
      if (videoIndex !== -1) {
        uploadedVideos[videoIndex].likes = Math.max(0, uploadedVideos[videoIndex].likes - 1);
        uploadedVideos[videoIndex].isLiked = false;
        return uploadedVideos[videoIndex];
      }
      
      // Then try Supabase
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      
      if (userData.user) {
        const { error } = await supabase
          .from('video_likes')
          .delete()
          .eq('user_id', userData.user.id)
          .eq('video_id', videoId);
          
        if (error) throw error;
      }
      
      // Fallback to original API
      const response = await api.delete(`/videos/${videoId}/like`);
      return response.data;
    } catch (error) {
      console.error("Error unliking video:", error);
      throw error;
    }
  },

  async getVideoComments(videoId: string) {
    try {
      // Try Supabase first
      const { data, error } = await supabase
        .from('video_comments')
        .select(`
          id,
          content,
          created_at,
          user_id,
          profiles(username, avatar_url)
        `)
        .eq('video_id', videoId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        return data.map(comment => ({
          id: comment.id,
          content: comment.content,
          createdAt: comment.created_at,
          user: {
            id: comment.user_id,
            username: comment.profiles?.username || 'unknown',
            avatar: comment.profiles?.avatar_url || '/placeholder.svg'
          }
        }));
      }
      
      // Fallback to original API
      const response = await api.get(`/videos/${videoId}/comments`);
      return response.data;
    } catch (error) {
      console.error("Error fetching video comments:", error);
      return [];
    }
  },

  async addComment(videoId: string, content: string) {
    try {
      // Try Supabase first
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      
      if (userData.user) {
        const { data, error } = await supabase
          .from('video_comments')
          .insert({
            content,
            user_id: userData.user.id,
            video_id: videoId
          })
          .select(`
            id,
            content,
            created_at,
            user_id,
            profiles(username, avatar_url)
          `)
          .single();
          
        if (error) throw error;
        
        if (data) {
          return {
            id: data.id,
            content: data.content,
            createdAt: data.created_at,
            user: {
              id: data.user_id,
              username: data.profiles?.username || 'unknown',
              avatar: data.profiles?.avatar_url || '/placeholder.svg'
            }
          };
        }
      }
      
      // Fallback to original API
      const response = await api.post(`/videos/${videoId}/comments`, { content });
      return response.data;
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  },

  async reportVideo(videoId: string, reason: string, details?: string) {
    try {
      const response = await api.post(`/videos/${videoId}/report`, { reason, details });
      return response.data;
    } catch (error) {
      console.error("Error reporting video:", error);
      throw error;
    }
  },

  async shareVideo(videoId: string, platform?: string) {
    try {
      const response = await api.post(`/videos/${videoId}/share`, { platform });
      return response.data;
    } catch (error) {
      console.error("Error sharing video:", error);
      throw error;
    }
  },

  async downloadVideo(videoId: string) {
    try {
      const response = await api.get(`/videos/${videoId}/download`);
      return response.data;
    } catch (error) {
      console.error("Error downloading video:", error);
      throw error;
    }
  },

  async deleteVideo(videoId: string) {
    try {
      // First check if it's an in-memory video
      const videoIndex = uploadedVideos.findIndex(v => v.id === videoId);
      if (videoIndex !== -1) {
        uploadedVideos.splice(videoIndex, 1);
        return { success: true };
      }
      
      // Try Supabase
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      
      // Verify ownership and delete
      if (userData.user) {
        const { data: video, error: getError } = await supabase
          .from('short_videos')
          .select('user_id')
          .eq('id', videoId)
          .single();
          
        if (getError) throw getError;
        
        // Only delete if user owns the video
        if (video && video.user_id === userData.user.id) {
          const { error: deleteError } = await supabase
            .from('short_videos')
            .delete()
            .eq('id', videoId);
            
          if (deleteError) throw deleteError;
          return { success: true };
        } else {
          throw new Error("Not authorized to delete this video");
        }
      }
      
      // Fallback to original API
      const response = await api.delete(`/videos/${videoId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting video:", error);
      throw error;
    }
  },

  async uploadVideo(params: UploadVideoParams) {
    try {
      console.log('Uploading video with params:', params);
      
      // Get the current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error("Error getting user:", userError);
        throw userError;
      }
      
      if (!userData.user) {
        console.error("No authenticated user found");
        throw new Error("You must be logged in to upload videos");
      }
      
      // Upload video file to Supabase Storage
      const videoFileName = `${Date.now()}-${params.videoFile.name}`;
      const { data: videoData, error: videoUploadError } = await supabase.storage
        .from('videos')
        .upload(videoFileName, params.videoFile);
        
      if (videoUploadError) {
        console.error("Error uploading video to storage:", videoUploadError);
        
        // If storage bucket doesn't exist, use the URL API for local preview
        const videoUrl = URL.createObjectURL(params.videoFile);
        
        // Create a new video object with the uploaded data but keep it in memory
        const newVideo: Video = {
          id: 'new-video-' + Date.now(),
          url: videoUrl,
          thumbnail: '',
          title: params.title,
          description: params.description,
          likes: 0,
          comments: 0,
          shares: 0,
          downloads: 0,
          isPublic: params.isPublic,
          allowDownloads: params.allowDownloads,
          hashtags: params.hashtags,
          user: {
            id: userData.user.id,
            username: userData.user.email?.split('@')[0] || 'user',
            avatar: '/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png'
          },
          createdAt: new Date().toISOString()
        };
        
        // Add the video to our local store
        uploadedVideos.unshift(newVideo);
        
        console.log('Added new video to uploadedVideos array (fallback):', newVideo);
        
        return newVideo;
      }
      
      // Get the public URL for the uploaded video
      const { data: publicUrlData } = supabase.storage
        .from('videos')
        .getPublicUrl(videoFileName);
      
      const videoUrl = publicUrlData.publicUrl;
      
      // Insert video record into the database
      const { data: insertData, error: insertError } = await supabase
        .from('short_videos')
        .insert({
          title: params.title,
          description: params.description,
          video_url: videoUrl,
          user_id: userData.user.id,
        })
        .select('*')
        .single();
        
      if (insertError) {
        console.error("Error inserting video record:", insertError);
        throw insertError;
      }
      
      console.log('Successfully inserted video into database:', insertData);
      
      // Get user profile for the response
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', userData.user.id)
        .single();
        
      if (profileError) {
        console.error("Error fetching user profile:", profileError);
      }
      
      // Format the response
      const newVideo: Video = {
        id: insertData.id,
        url: videoUrl,
        thumbnail: insertData.thumbnail_url || '',
        title: insertData.title,
        description: insertData.description || '',
        likes: 0,
        comments: 0,
        shares: 0,
        downloads: 0,
        isPublic: params.isPublic,
        allowDownloads: params.allowDownloads,
        hashtags: params.hashtags,
        user: {
          id: userData.user.id,
          username: profileData?.username || userData.user.email?.split('@')[0] || 'user',
          avatar: profileData?.avatar_url || '/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png'
        },
        createdAt: insertData.created_at
      };
      
      // Keep a copy in memory for immediate access
      uploadedVideos.unshift(newVideo);
      
      console.log('Added new video to database and uploadedVideos array:', newVideo);
      
      return newVideo;
    } catch (error) {
      console.error("Error uploading video:", error);
      throw error;
    }
  },

  async updateVideo(videoId: string, updates: Partial<UploadVideoParams>) {
    try {
      const response = await api.put(`/videos/${videoId}`, updates);
      return response.data;
    } catch (error) {
      console.error("Error updating video:", error);
      throw error;
    }
  }
};

export default VideoService;
