
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

// Define the RealtimePostgresChangesPayload interface to match Supabase's structure
interface RealtimePostgresChangesPayload<T> {
  commit_timestamp: string;
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  schema: string;
  table: string;
  old: T | null;
  new: T | null;
}

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
      ? `${tableName}:${filterColumn}:eq:${filterValue}`
      : `${tableName}`;
    
    let filter = {};
    if (filterColumn && filterValue) {
      filter = { [filterColumn]: filterValue };
    }

    // Create channel for realtime updates
    const channel = supabase.channel(channelName);
    
    // Add listeners for INSERT events
    channel.on(
      'postgres_changes' as any,
      {
        event: 'INSERT',
        schema: 'public',
        table: tableName,
        ...(Object.keys(filter).length > 0 ? { filter } : {})
      },
      (payload: { [key: string]: any }) => {
        // Extract the data from the payload correctly
        const newRecord = (payload.new || payload.payload?.new) as T;
        if (newRecord) {
          setData((prevData) => [...prevData, newRecord]);
          toast({
            title: "New data received",
            description: `New update for ${tableName}`,
          });
        }
      }
    );
    
    // Add listeners for UPDATE events
    channel.on(
      'postgres_changes' as any,
      {
        event: 'UPDATE',
        schema: 'public',
        table: tableName,
        ...(Object.keys(filter).length > 0 ? { filter } : {})
      },
      (payload: { [key: string]: any }) => {
        // Extract the data from the payload correctly
        const updatedRecord = (payload.new || payload.payload?.new) as T;
        if (updatedRecord) {
          setData((prevData) =>
            prevData.map((item: any) =>
              item.id === (updatedRecord as any).id ? updatedRecord : item
            )
          );
        }
      }
    );
    
    // Add listeners for DELETE events
    channel.on(
      'postgres_changes' as any,
      {
        event: 'DELETE',
        schema: 'public',
        table: tableName,
        ...(Object.keys(filter).length > 0 ? { filter } : {})
      },
      (payload: { [key: string]: any }) => {
        // Extract the data from the payload correctly
        const deletedRecord = (payload.old || payload.payload?.old) as T;
        if (deletedRecord) {
          setData((prevData) =>
            prevData.filter((item: any) => item.id !== (deletedRecord as any).id)
          );
        }
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
