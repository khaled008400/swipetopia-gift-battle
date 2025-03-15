
import { supabase } from '@/integrations/supabase/client';

export interface AdminVideo {
  id: string;
  title: string;
  description: string;
  url: string;
  video_url: string;
  thumbnail_url?: string;
  status: string;
  likes: number;
  comments: number;
  shares: number;
  createdAt: string;
  created_at: string;
  user: {
    id: string;
    username: string;
    avatar?: string;
  };
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  status: string;
  role: string;
  createdAt: string;
  videosCount: number;
  ordersCount: number;
}

class AdminService {
  // Videos
  async getVideosList(page = 1, perPage = 10, status = '', search = '', user = '', date = '') {
    try {
      // First try to use the admin-videos edge function
      const response = await supabase.functions.invoke('admin-videos', {
        body: { action: 'list' }
      });
      
      if (!response.error && response.data) {
        const { videos, total } = response.data;
        
        // Filter the results based on parameters
        let filteredVideos = videos || [];
        
        if (status) {
          filteredVideos = filteredVideos.filter(video => 
            video.status?.toLowerCase() === status.toLowerCase()
          );
        }
        
        if (search) {
          filteredVideos = filteredVideos.filter(video => 
            video.title?.toLowerCase().includes(search.toLowerCase()) || 
            video.description?.toLowerCase().includes(search.toLowerCase())
          );
        }
        
        if (user) {
          filteredVideos = filteredVideos.filter(video => 
            video.profiles?.username?.toLowerCase().includes(user.toLowerCase())
          );
        }
        
        if (date) {
          const filterDate = new Date(date).toISOString().split('T')[0];
          filteredVideos = filteredVideos.filter(video => {
            const videoDate = new Date(video.created_at).toISOString().split('T')[0];
            return videoDate === filterDate;
          });
        }
        
        // Transform data to match expected interface
        const transformedVideos = filteredVideos.map(video => ({
          id: video.id,
          title: video.title || '',
          description: video.description || '',
          url: video.video_url,
          video_url: video.video_url,
          thumbnail_url: video.thumbnail_url,
          status: 'active', // Default status, can be updated from metadata
          likes: video.likes_count || 0,
          comments: video.comments_count || 0,
          shares: video.shares_count || 0,
          createdAt: video.created_at,
          created_at: video.created_at,
          user: {
            id: video.user_id,
            username: video.profiles?.username || 'unknown',
            avatar: video.profiles?.avatar_url,
          }
        }));
        
        // Paginate the results
        const start = (page - 1) * perPage;
        const end = start + perPage;
        const paginatedVideos = transformedVideos.slice(start, end);
        
        return {
          data: paginatedVideos,
          pagination: {
            current_page: page,
            per_page: perPage,
            total: transformedVideos.length,
            last_page: Math.ceil(transformedVideos.length / perPage)
          }
        };
      }
      
      // Fallback to direct database queries if edge function fails
      let query = supabase
        .from('videos')
        .select(`
          *,
          profiles:user_id (username, avatar_url)
        `, { count: 'exact' });
      
      // Apply filters
      if (status) {
        query = query.eq('status', status);
      }
      
      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      }
      
      if (user) {
        query = query.eq('profiles.username', user);
      }
      
      if (date) {
        const filterDate = new Date(date).toISOString().split('T')[0];
        query = query.gte('created_at', `${filterDate}T00:00:00Z`)
          .lte('created_at', `${filterDate}T23:59:59Z`);
      }
      
      // Paginate and order
      const from = (page - 1) * perPage;
      const to = from + perPage - 1;
      
      query = query
        .order('created_at', { ascending: false })
        .range(from, to);
      
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      const videos = data.map(video => ({
        id: video.id,
        title: video.title || '',
        description: video.description || '',
        url: video.video_url,
        video_url: video.video_url,
        thumbnail_url: video.thumbnail_url,
        status: video.status || 'active',
        likes: video.likes_count || 0,
        comments: video.comments_count || 0,
        shares: video.shares_count || 0,
        createdAt: video.created_at,
        created_at: video.created_at,
        user: {
          id: video.user_id,
          username: video.profiles?.username || 'unknown',
          avatar: video.profiles?.avatar_url,
        }
      }));
      
      return {
        data: videos,
        pagination: {
          current_page: page,
          per_page: perPage,
          total: count || 0,
          last_page: Math.ceil((count || 0) / perPage)
        }
      };
    } catch (error) {
      console.error("Error in getVideosList:", error);
      throw error;
    }
  }

  async updateVideoStatus(videoId: string, status: 'active' | 'flagged' | 'removed') {
    try {
      // Try to use the edge function first
      const response = await supabase.functions.invoke('admin-videos', {
        body: { 
          action: 'update',
          videoId,
          videoData: { status }
        }
      });
      
      if (!response.error) {
        return response.data;
      }
      
      // Fallback to direct update
      const { data, error } = await supabase
        .from('videos')
        .update({ status })
        .eq('id', videoId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating video status:", error);
      throw error;
    }
  }

  async deleteVideo(videoId: string) {
    try {
      // Try to use the edge function first
      const response = await supabase.functions.invoke('admin-videos', {
        body: { 
          action: 'delete',
          videoId
        }
      });
      
      if (!response.error) {
        return response.data;
      }
      
      // First delete interactions
      const { error: intError } = await supabase
        .from('video_interactions')
        .delete()
        .eq('video_id', videoId);
      
      if (intError) throw intError;
      
      // Then delete the video
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', videoId);
      
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error("Error deleting video:", error);
      throw error;
    }
  }

  async getUser(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          videos:videos(count),
          orders:orders(count)
        `)
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        username: data.username,
        email: data.email,
        status: data.status || 'active',
        role: data.role || 'user',
        createdAt: data.created_at,
        videosCount: data.videos[0]?.count || 0,
        ordersCount: data.orders[0]?.count || 0
      };
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  async sendUserWarning(userId: string, message: string, videoId?: string) {
    // This would typically send a notification to the user
    console.log(`Warning sent to ${userId}: ${message} regarding video ${videoId}`);
    return { success: true };
  }

  async restrictUser(userId: string, reason: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ 
          status: 'restricted',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Log admin action
      await supabase.rpc('log_admin_action', {
        p_action_type: 'restrict_user',
        p_target_id: userId,
        p_reason: reason
      });
      
      return data;
    } catch (error) {
      console.error("Error restricting user:", error);
      throw error;
    }
  }
}

export default new AdminService();
