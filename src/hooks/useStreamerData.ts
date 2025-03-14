
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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
  status: string;
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

  return { streamHistory, isLoading, error };
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

  return { battleHistory, isLoading, error };
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

  return { topSupporters, isLoading, error };
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

  return { streamHighlights, isLoading, error };
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
        
        setScheduledStreams(data);
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

  return { scheduledStreams, isLoading, error };
};
