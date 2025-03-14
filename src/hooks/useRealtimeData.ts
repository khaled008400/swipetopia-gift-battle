
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useRealtimeData<T>(
  tableName: string, 
  initialData: T[], 
  filterColumn: string | null = null, 
  filterValue: string | null = null
) {
  const [data, setData] = useState<T[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Set initial data when it changes
    setData(initialData);
  }, [initialData]);

  useEffect(() => {
    // Setup real-time subscription
    setIsLoading(true);
    
    // Create a channel name based on table and filter if any
    const channelName = filterColumn && filterValue 
      ? `public:${tableName}:${filterColumn}:${filterValue}`
      : `public:${tableName}`;
    
    const channel = supabase.channel(channelName);
    
    // Filter by column if provided
    let filterOptions = {};
    if (filterColumn && filterValue) {
      filterOptions = { [filterColumn]: filterValue };
    }
    
    // Subscribe to INSERT events
    channel.on(
      'postgres_changes', 
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: tableName,
        ...(Object.keys(filterOptions).length > 0 ? { filter: filterOptions } : {})
      }, 
      (payload) => {
        setData((prevData) => [...prevData, payload.new as T]);
        toast({
          title: "New data received",
          description: `New update for ${tableName}`,
        });
      }
    );
    
    // Subscribe to UPDATE events
    channel.on(
      'postgres_changes', 
      { 
        event: 'UPDATE', 
        schema: 'public', 
        table: tableName,
        ...(Object.keys(filterOptions).length > 0 ? { filter: filterOptions } : {})
      }, 
      (payload) => {
        setData((prevData) => 
          prevData.map((item: any) => 
            item.id === (payload.new as any).id ? payload.new as T : item
          )
        );
      }
    );
    
    // Subscribe to DELETE events
    channel.on(
      'postgres_changes', 
      { 
        event: 'DELETE', 
        schema: 'public', 
        table: tableName,
        ...(Object.keys(filterOptions).length > 0 ? { filter: filterOptions } : {})
      }, 
      (payload) => {
        setData((prevData) => 
          prevData.filter((item: any) => item.id !== (payload.old as any).id)
        );
      }
    );

    // Subscribe to the channel
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`Subscribed to real-time updates for ${tableName}`);
        setIsLoading(false);
      } else if (status === 'CHANNEL_ERROR') {
        setError(`Failed to subscribe to ${tableName} updates`);
        setIsLoading(false);
      }
    });

    // Cleanup function
    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableName, filterColumn, filterValue, toast]);

  return { data, isLoading, error };
}
