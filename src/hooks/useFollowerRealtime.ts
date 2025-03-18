
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import FollowerService from '@/services/follower.service';

export function useFollowerRealtime(userId: string) {
  const [followerCount, setFollowerCount] = useState<number>(0);
  const [recentFollowers, setRecentFollowers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Fetch initial follower count and recent followers
  useEffect(() => {
    const fetchFollowerData = async () => {
      try {
        setLoading(true);
        
        // Get follower count
        const count = await FollowerService.getFollowerCount(userId);
        setFollowerCount(count);
        
        // Get recent followers
        const { data, error } = await supabase
          .from('followers')
          .select(`
            id,
            follower_id,
            created_at,
            profiles:follower_id (username, avatar_url)
          `)
          .eq('following_id', userId)
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (!error && data) {
          setRecentFollowers(data);
        }
      } catch (error) {
        console.error('Error fetching follower data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) {
      fetchFollowerData();
    }
  }, [userId]);
  
  // Set up real-time subscription for follower changes
  useEffect(() => {
    if (!userId) return;
    
    // Create a channel for follower updates
    const channel = supabase.channel(`followers:${userId}`);
    
    // Listen for INSERT events (new followers)
    channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'followers',
        filter: `following_id=eq.${userId}`
      },
      async (payload) => {
        // Update follower count
        setFollowerCount(prevCount => prevCount + 1);
        
        // Fetch details of the new follower
        const { data, error } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', payload.new.follower_id)
          .single();
          
        if (!error && data) {
          // Add to recent followers
          const newFollower = {
            id: payload.new.id,
            follower_id: payload.new.follower_id,
            created_at: payload.new.created_at,
            profiles: data
          };
          
          setRecentFollowers(prev => [newFollower, ...prev].slice(0, 5));
        }
      }
    );
    
    // Listen for DELETE events (unfollows)
    channel.on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'followers',
        filter: `following_id=eq.${userId}`
      },
      (payload) => {
        // Update follower count
        setFollowerCount(prevCount => Math.max(0, prevCount - 1));
        
        // Remove from recent followers
        setRecentFollowers(prev => 
          prev.filter(follower => follower.id !== payload.old.id)
        );
      }
    );
    
    // Subscribe to the channel
    channel.subscribe();
    
    // Cleanup
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);
  
  return {
    followerCount,
    recentFollowers,
    loading
  };
}
