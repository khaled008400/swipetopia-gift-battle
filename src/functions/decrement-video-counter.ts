
import { supabase } from '@/lib/supabase';

export async function decrementVideoCounter(videoId: string, counterName: string): Promise<void> {
  try {
    // Using SQL function to safely decrement counter and ensure it doesn't go below 0
    const { error } = await supabase.rpc('decrement_video_counter', {
      video_id: videoId,
      counter_name: counterName
    });
    
    if (error) throw error;
  } catch (error) {
    console.error(`Error decrementing ${counterName}:`, error);
    throw error;
  }
}
