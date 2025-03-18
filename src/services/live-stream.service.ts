
import { supabase } from "@/lib/supabase";
import { LiveStream } from "@/types/livestream.types";
import { Video, BattleVideo } from "@/types/video.types";

class LiveStreamService {
  // Get all live streams
  async getLiveStreams(): Promise<LiveStream[]> {
    try {
      const { data, error } = await supabase
        .from('streams')
        .select('*, profiles:user_id(username, avatar_url)')
        .eq('status', 'live')
        .order('viewer_count', { ascending: false });
      
      if (error) throw error;
      
      return data as LiveStream[];
    } catch (error) {
      console.error('Error fetching live streams:', error);
      return [];
    }
  }

  // Get a specific live stream by ID
  async getLiveStream(liveStreamId: string): Promise<LiveStream> {
    try {
      const { data, error } = await supabase
        .from('streams')
        .select('*, profiles:user_id(username, avatar_url)')
        .eq('id', liveStreamId)
        .single();
      
      if (error) throw error;
      
      return data as LiveStream;
    } catch (error) {
      console.error('Error fetching live stream:', error);
      throw error;
    }
  }

  // Get related videos for a live stream
  async getRelatedVideos(liveStreamId: string): Promise<BattleVideo[]> {
    try {
      // For now, return mock data until you implement the actual related videos query
      const mockRelatedVideos: BattleVideo[] = [
        {
          id: "video1",
          battle_id: "battle1",
          score: 156,
          position: "left",
          title: "Amazing dance routine",
          description: "Check out this incredible dance performance",
          video_url: "https://example.com/video1.mp4",
          thumbnail_url: "https://example.com/thumbnail1.jpg",
          user_id: "user1",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          view_count: 1200,
          likes_count: 350,
          comments_count: 42,
          shares_count: 28,
          is_live: false,
          is_private: false,
          duration: 180,
          category: "Dance",
          user: { username: "DanceQueen", avatar: "/assets/avatars/dancer.jpg" },
          profiles: { username: "DanceQueen", avatar_url: "/assets/avatars/dancer.jpg" },
          creator: { username: "DanceQueen" },
          url: "https://example.com/video1.mp4",
          isPublic: true,
          isLive: false,
          hashtags: ["dance", "talent"]
        },
        {
          id: "video2",
          battle_id: "battle2",
          score: 203,
          position: "right",
          title: "Street performance",
          description: "Street dancer shows amazing skills",
          video_url: "https://example.com/video2.mp4",
          thumbnail_url: "https://example.com/thumbnail2.jpg",
          user_id: "user2",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          view_count: 1800,
          likes_count: 420,
          comments_count: 56,
          shares_count: 35,
          is_live: false,
          is_private: false,
          duration: 210,
          category: "Dance",
          user: { username: "StreetMoves", avatar: "/assets/avatars/street.jpg" },
          profiles: { username: "StreetMoves", avatar_url: "/assets/avatars/street.jpg" },
          creator: { username: "StreetMoves" },
          url: "https://example.com/video2.mp4",
          isPublic: true,
          isLive: false,
          hashtags: ["street", "dance"]
        }
      ];
      
      return mockRelatedVideos;
    } catch (error) {
      console.error('Error fetching related videos:', error);
      return [];
    }
  }
}

export default new LiveStreamService();
