
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
    
    let channel = supabase.channel(`public:${tableName}`);
    
    // Filter by column if provided
    let filter = {};
    if (filterColumn && filterValue) {
      filter = { [filterColumn]: filterValue };
    }
    
    // Using channel.on with the proper type definition for postgres_changes
    channel = channel
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: tableName,
        ...(Object.keys(filter).length > 0 ? { filter } : {})
      }, (payload) => {
        setData((prevData) => [...prevData, payload.new as T]);
        toast({
          title: "New data received",
          description: `New update for ${tableName}`,
        });
      })
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: tableName,
        ...(Object.keys(filter).length > 0 ? { filter } : {})
      }, (payload) => {
        setData((prevData) => 
          prevData.map((item: any) => 
            item.id === (payload.new as any).id ? payload.new as T : item
          )
        );
      })
      .on('postgres_changes', { 
        event: 'DELETE', 
        schema: 'public', 
        table: tableName,
        ...(Object.keys(filter).length > 0 ? { filter } : {})
      }, (payload) => {
        setData((prevData) => 
          prevData.filter((item: any) => item.id !== (payload.old as any).id)
        );
      });

    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`Subscribed to real-time updates for ${tableName}`);
        setIsLoading(false);
      } else if (status === 'CHANNEL_ERROR') {
        setError(`Failed to subscribe to ${tableName} updates`);
        setIsLoading(false);
      }
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableName, filterColumn, filterValue, toast]);

  return { data, isLoading, error };
}
