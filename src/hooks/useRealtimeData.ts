
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

// Generic hook for real-time data with Supabase and React Query
export function useRealtimeData<T>(
  table: string,
  initialData: T[] = [],
  filter: any = null,
  options: Partial<UseQueryOptions<any, Error, any, any>> = {}
) {
  const [data, setData] = useState<T[]>(initialData);
  const [channel, setChannel] = useState<any>(null);

  // Setup the initial query
  const query = useQuery({
    queryKey: [table, filter],
    queryFn: async () => {
      let queryBuilder = supabase.from(table).select('*');
      
      if (filter) {
        queryBuilder = queryBuilder.match(filter);
      }
      
      const { data, error } = await queryBuilder;
      
      if (error) throw error;
      return data as T[];
    },
    ...options
  });

  // Set up real-time subscription
  useEffect(() => {
    // Only subscribe if we have data and the component is mounted
    if (query.data) {
      setData(query.data);
      
      // Create a new Supabase real-time channel
      const newChannel = supabase
        .channel(`${table}-changes`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table,
        }, (payload) => {
          // Handle different types of changes
          if (payload.eventType === 'INSERT') {
            setData((currentData) => [payload.new as T, ...currentData]);
          } else if (payload.eventType === 'UPDATE') {
            setData((currentData) =>
              currentData.map((item: any) =>
                item.id === (payload.new as any).id ? (payload.new as T) : item
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setData((currentData) =>
              currentData.filter((item: any) => item.id !== (payload.old as any).id)
            );
          }
        })
        .subscribe();
      
      setChannel(newChannel);
      
      // Clean up subscription when unmounting
      return () => {
        if (newChannel) {
          supabase.removeChannel(newChannel);
        }
      };
    }
  }, [table, query.data]);

  return {
    ...query,
    data,
  };
}
