
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useRealtimeData } from "./useRealtimeData";

export interface StreamHistory {
  id: string;
  title: string;
  date: string;
  duration: number;
  view_count: number;
  gifts_earned: number;
  coins_earned: number;
}

export interface BattleHistory {
  id: string;
  opponent_username: string;
  opponent_avatar: string;
  date: string;
  result: string;
  view_count: number;
  votes_received: number;
  votes_opponent: number;
}

export interface TopSupporter {
  id: string;
  supporter_username: string;
  supporter_avatar: string;
  gift_amount: number;
}

export interface StreamHighlight {
  id: string;
  title: string;
  thumbnail: string;
  video_url: string;
  duration: string;
  views: number;
  likes: number;
  comments: number;
}

export interface ScheduledStream {
  id: string;
  title: string;
  description: string;
  scheduled_time: string;
  is_battle: boolean;
  opponent_id: string | null;
  status: "scheduled" | "live" | "completed" | "cancelled";
}

export const useStreamHistory = (streamerId: string) => {
  const [streamHistory, setStreamHistory] = useState<StreamHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStreamHistory = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("stream_history")
          .select("*")
          .eq("streamer_id", streamerId)
          .order("date", { ascending: false });

        if (error) throw error;
        
        setStreamHistory(data);
      } catch (err) {
        console.error("Error fetching stream history:", err);
        setError("Failed to load stream history");
        toast({
          title: "Error",
          description: "Failed to load stream history",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (streamerId) {
      fetchStreamHistory();
    }
  }, [streamerId, toast]);

  // Subscribe to real-time updates
  const realtimeData = useRealtimeData<StreamHistory>(
    "stream_history", 
    streamHistory, 
    "streamer_id", 
    streamerId
  );

  // Merge initial data with realtime updates
  const finalStreamHistory = realtimeData.data.length > 0 ? realtimeData.data : streamHistory;
  const finalIsLoading = isLoading || realtimeData.isLoading;
  const finalError = error || realtimeData.error;

  return { 
    streamHistory: finalStreamHistory, 
    isLoading: finalIsLoading, 
    error: finalError 
  };
};

export const useBattleHistory = (streamerId: string) => {
  const [battleHistory, setBattleHistory] = useState<BattleHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBattleHistory = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("battle_history")
          .select("*")
          .eq("streamer_id", streamerId)
          .order("date", { ascending: false });

        if (error) throw error;
        
        setBattleHistory(data);
      } catch (err) {
        console.error("Error fetching battle history:", err);
        setError("Failed to load battle stats");
        toast({
          title: "Error",
          description: "Failed to load battle statistics",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (streamerId) {
      fetchBattleHistory();
    }
  }, [streamerId, toast]);

  // Subscribe to real-time updates
  const realtimeData = useRealtimeData<BattleHistory>(
    "battle_history", 
    battleHistory, 
    "streamer_id", 
    streamerId
  );

  // Merge initial data with realtime updates
  const finalBattleHistory = realtimeData.data.length > 0 ? realtimeData.data : battleHistory;
  const finalIsLoading = isLoading || realtimeData.isLoading;
  const finalError = error || realtimeData.error;

  return { 
    battleHistory: finalBattleHistory, 
    isLoading: finalIsLoading, 
    error: finalError 
  };
};

export const useTopSupporters = (streamerId: string) => {
  const [topSupporters, setTopSupporters] = useState<TopSupporter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTopSupporters = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("top_supporters")
          .select("*")
          .eq("streamer_id", streamerId)
          .order("gift_amount", { ascending: false })
          .limit(5);

        if (error) throw error;
        
        setTopSupporters(data);
      } catch (err) {
        console.error("Error fetching top supporters:", err);
        setError("Failed to load top supporters");
        toast({
          title: "Error",
          description: "Failed to load supporter data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (streamerId) {
      fetchTopSupporters();
    }
  }, [streamerId, toast]);

  // Subscribe to real-time updates
  const realtimeData = useRealtimeData<TopSupporter>(
    "top_supporters", 
    topSupporters, 
    "streamer_id", 
    streamerId
  );

  // Merge initial data with realtime updates
  const finalTopSupporters = realtimeData.data.length > 0 ? realtimeData.data : topSupporters;
  const finalIsLoading = isLoading || realtimeData.isLoading;
  const finalError = error || realtimeData.error;

  return { 
    topSupporters: finalTopSupporters, 
    isLoading: finalIsLoading, 
    error: finalError 
  };
};

export const useStreamHighlights = (streamerId: string) => {
  const [streamHighlights, setStreamHighlights] = useState<StreamHighlight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStreamHighlights = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("stream_highlights")
          .select("*")
          .eq("streamer_id", streamerId)
          .order("created_at", { ascending: false });

        if (error) throw error;
        
        setStreamHighlights(data);
      } catch (err) {
        console.error("Error fetching stream highlights:", err);
        setError("Failed to load stream highlights");
        toast({
          title: "Error",
          description: "Failed to load highlight videos",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (streamerId) {
      fetchStreamHighlights();
    }
  }, [streamerId, toast]);

  // Subscribe to real-time updates
  const realtimeData = useRealtimeData<StreamHighlight>(
    "stream_highlights", 
    streamHighlights, 
    "streamer_id", 
    streamerId
  );

  // Merge initial data with realtime updates
  const finalStreamHighlights = realtimeData.data.length > 0 ? realtimeData.data : streamHighlights;
  const finalIsLoading = isLoading || realtimeData.isLoading;
  const finalError = error || realtimeData.error;

  return { 
    streamHighlights: finalStreamHighlights, 
    isLoading: finalIsLoading, 
    error: finalError 
  };
};

export const useScheduledStreams = (streamerId: string) => {
  const [scheduledStreams, setScheduledStreams] = useState<ScheduledStream[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchScheduledStreams = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("scheduled_streams")
          .select("*")
          .eq("streamer_id", streamerId)
          .gte("scheduled_time", new Date().toISOString())
          .order("scheduled_time", { ascending: true });

        if (error) throw error;
        
        // Type assertion to ensure status has the correct type
        setScheduledStreams(data?.map(stream => ({
          ...stream,
          status: (stream.status as "scheduled" | "live" | "completed" | "cancelled") || "scheduled"
        })) || []);
      } catch (err) {
        console.error("Error fetching scheduled streams:", err);
        setError("Failed to load scheduled streams");
        toast({
          title: "Error",
          description: "Failed to load stream schedule",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (streamerId) {
      fetchScheduledStreams();
    }
  }, [streamerId, toast]);

  // Subscribe to real-time updates
  const realtimeData = useRealtimeData<ScheduledStream>(
    "scheduled_streams", 
    scheduledStreams, 
    "streamer_id", 
    streamerId
  );

  // Merge initial data with realtime updates
  const finalScheduledStreams = realtimeData.data.length > 0 ? realtimeData.data : scheduledStreams;
  const finalIsLoading = isLoading || realtimeData.isLoading;
  const finalError = error || realtimeData.error;

  return { 
    scheduledStreams: finalScheduledStreams, 
    isLoading: finalIsLoading, 
    error: finalError 
  };
};
