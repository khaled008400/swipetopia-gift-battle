
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
        console.log('New follower:', payload);
        
        // Increment follower count
        setFollowerCount(prev => prev + 1);
        
        // Fetch the new follower's details
        const { data } = await supabase
          .from('followers')
          .select(`
            id,
            follower_id,
            created_at,
            profiles:follower_id (username, avatar_url)
          `)
          .eq('id', payload.new.id)
          .single();
          
        if (data) {
          // Add to recent followers
          setRecentFollowers(prev => [data, ...prev.slice(0, 4)]);
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
        console.log('Follower removed:', payload);
        
        // Decrement follower count
        setFollowerCount(prev => Math.max(0, prev - 1));
        
        // Remove from recent followers if present
        if (payload.old && payload.old.id) {
          setRecentFollowers(prev => 
            prev.filter(follower => follower.id !== payload.old.id)
          );
        }
      }
    );
    
    // Subscribe to the channel
    channel.subscribe((status) => {
      console.log(`Follower realtime subscription status: ${status}`);
    });
    
    // Clean up on unmount
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
