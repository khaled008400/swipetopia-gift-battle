
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// StreamHighlight type definition
export interface StreamHighlight {
  id: string;
  title: string;
  description?: string;
  thumbnail: string;
  video_url: string;
  streamer_id: string;
  duration: string;
  views: number;
  likes: number;
  comments: number;
  created_at: string;
}

// TopSupporter type definition
export interface TopSupporter {
  id: string;
  supporter_id: string;
  supporter_username: string;
  supporter_avatar: string;
  streamer_id: string;
  gift_amount: number;
  created_at?: string;
}

// ScheduledStream type definition
export interface ScheduledStream {
  id: string;
  title: string;
  description: string;
  scheduled_time: string;
  duration_minutes: number;
  streamer_id: string;
  category: string;
  thumbnail_url?: string;
}

// Hook to get scheduled streams
export const useScheduledStreams = (streamerId: string) => {
  const [scheduledStreams, setScheduledStreams] = useState<ScheduledStream[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchScheduledStreams = async () => {
      try {
        setIsLoading(true);
        
        // Fetch from Supabase
        const { data, error: fetchError } = await supabase
          .from('stream_schedule')
          .select('*')
          .eq('streamer_id', streamerId)
          .gte('scheduled_time', new Date().toISOString())
          .order('scheduled_time', { ascending: true });
          
        if (fetchError) throw fetchError;
        
        // If no data or empty array, use mock data
        if (!data || data.length === 0) {
          // Mock data
          const mockSchedule: ScheduledStream[] = [
            {
              id: '1',
              title: 'Gaming Session: New Release',
              description: 'First look at the newest game release',
              scheduled_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
              duration_minutes: 120,
              streamer_id: streamerId,
              category: 'Gaming'
            },
            {
              id: '2',
              title: 'Q&A with Followers',
              description: 'Answering your questions and chat',
              scheduled_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
              duration_minutes: 60,
              streamer_id: streamerId,
              category: 'Just Chatting'
            }
          ];
          setScheduledStreams(mockSchedule);
        } else {
          setScheduledStreams(data);
        }
      } catch (err) {
        console.error('Error fetching scheduled streams:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchScheduledStreams();
  }, [streamerId]);
  
  // Function to schedule a new stream
  const scheduleStream = async (streamData: ScheduledStream) => {
    try {
      const { data, error } = await supabase
        .from('stream_schedule')
        .insert({
          title: streamData.title,
          description: streamData.description,
          scheduled_time: streamData.scheduled_time,
          duration_minutes: streamData.duration_minutes,
          streamer_id: streamerId,
          category: streamData.category
        })
        .select()
        .single();
        
      if (error) throw error;
      
      setScheduledStreams(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Error scheduling stream:', err);
      throw err;
    }
  };
  
  // Function to delete a scheduled stream
  const deleteScheduledStream = async (streamId: string) => {
    try {
      const { error } = await supabase
        .from('stream_schedule')
        .delete()
        .eq('id', streamId);
        
      if (error) throw error;
      
      setScheduledStreams(prev => prev.filter(stream => stream.id !== streamId));
      return true;
    } catch (err) {
      console.error('Error deleting scheduled stream:', err);
      throw err;
    }
  };
  
  return { scheduledStreams, isLoading, error, scheduleStream, deleteScheduledStream };
};

// Hook to get stream highlights
export const useStreamHighlights = (streamerId: string) => {
  const [streamHighlights, setStreamHighlights] = useState<StreamHighlight[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStreamHighlights = async () => {
      try {
        setIsLoading(true);
        
        // Fetch from Supabase
        const { data, error: fetchError } = await supabase
          .from('stream_highlights')
          .select('*')
          .eq('streamer_id', streamerId)
          .order('created_at', { ascending: false });
          
        if (fetchError) throw fetchError;
        
        // If no data or empty array, use mock data
        if (!data || data.length === 0) {
          // Mock data
          const mockHighlights: StreamHighlight[] = [
            {
              id: '1',
              title: 'Epic Win in Battle Royale',
              description: 'Check out this amazing play',
              thumbnail: 'https://i.pravatar.cc/300?img=1',
              video_url: 'https://example.com/video1.mp4',
              streamer_id: streamerId,
              duration: '3:42',
              views: 12540,
              likes: 856,
              comments: 124,
              created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: '2',
              title: 'Unboxing New Gaming Gear',
              description: 'First look at my new setup',
              thumbnail: 'https://i.pravatar.cc/300?img=2',
              video_url: 'https://example.com/video2.mp4',
              streamer_id: streamerId,
              duration: '8:15',
              views: 8750,
              likes: 723,
              comments: 95,
              created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
            }
          ];
          setStreamHighlights(mockHighlights);
        } else {
          setStreamHighlights(data);
        }
      } catch (err) {
        console.error('Error fetching stream highlights:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStreamHighlights();
  }, [streamerId]);
  
  return { streamHighlights, isLoading, error };
};

// Hook to get top supporters for a streamer
export const useTopSupporters = (streamerId: string) => {
  const [topSupporters, setTopSupporters] = useState<TopSupporter[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTopSupporters = async () => {
      try {
        setIsLoading(true);
        
        // Fetch from Supabase
        const { data, error: fetchError } = await supabase
          .from('top_supporters')
          .select('*')
          .eq('streamer_id', streamerId)
          .order('gift_amount', { ascending: false })
          .limit(10);
          
        if (fetchError) throw fetchError;
        
        // If no data or empty array, use mock data
        if (!data || data.length === 0) {
          // Mock data
          const mockSupporters: TopSupporter[] = [
            {
              id: '1',
              supporter_id: '101',
              supporter_username: 'SuperFan123',
              supporter_avatar: 'https://i.pravatar.cc/300?img=3',
              streamer_id: streamerId,
              gift_amount: 15000
            },
            {
              id: '2',
              supporter_id: '102',
              supporter_username: 'BigDonator',
              supporter_avatar: 'https://i.pravatar.cc/300?img=4',
              streamer_id: streamerId,
              gift_amount: 8500
            },
            {
              id: '3',
              supporter_id: '103',
              supporter_username: 'LoyalViewer',
              supporter_avatar: 'https://i.pravatar.cc/300?img=5',
              streamer_id: streamerId,
              gift_amount: 4250
            }
          ];
          setTopSupporters(mockSupporters);
        } else {
          setTopSupporters(data);
        }
      } catch (err) {
        console.error('Error fetching top supporters:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTopSupporters();
  }, [streamerId]);
  
  return { topSupporters, isLoading, error };
};
