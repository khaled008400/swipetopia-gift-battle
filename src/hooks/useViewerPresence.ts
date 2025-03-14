
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface Viewer {
  id: string;
  username: string;
  avatar: string | null;
  joinedAt: string;
}

export function useViewerPresence(streamerId: string) {
  const [viewers, setViewers] = useState<Viewer[]>([]);
  const [viewerCount, setViewerCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (!streamerId) return;

    // Create a channel scoped to this streamerId
    const channelName = `stream:${streamerId}`;
    const channel = supabase.channel(channelName);

    // Setup presence tracking
    if (user) {
      // Subscribe to the channel and track the user's presence
      channel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Get user profile data to display in the viewer list
          const { data: profileData } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', user.id)
            .single();

          // Track this user's presence in the channel
          await channel.track({
            id: user.id,
            username: profileData?.username || 'Anonymous',
            avatar: profileData?.avatar_url,
            joinedAt: new Date().toISOString(),
            online: true
          });
        }
      });
    } else {
      // Just subscribe without tracking (anonymous viewer)
      channel.subscribe();
    }

    // Listen for presence changes
    channel
      .on('presence', { event: 'sync' }, () => {
        // Get the current state of all viewers
        const presenceState = channel.presenceState();
        
        // Convert presence state to array of viewers
        const viewersList: Viewer[] = [];
        Object.keys(presenceState).forEach(key => {
          // Each key might have multiple presence objects (e.g., if user is connected from multiple devices)
          presenceState[key].forEach((presence: any) => {
            viewersList.push({
              id: presence.id,
              username: presence.username,
              avatar: presence.avatar,
              joinedAt: presence.joinedAt
            });
          });
        });
        
        setViewers(viewersList);
        setViewerCount(viewersList.length);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [streamerId, user]);

  return { viewers, viewerCount };
}
