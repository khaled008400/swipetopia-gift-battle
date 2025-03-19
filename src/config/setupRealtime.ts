
import { supabase } from '@/integrations/supabase/client';

export const enableRealtimeForProfiles = async () => {
  try {
    // Enable real-time for the profiles table
    const { error } = await supabase.rpc('enable_realtime_for_table', {
      table_name: 'profiles'
    });
    
    if (error) {
      console.error('Error enabling real-time for profiles:', error);
      return false;
    }
    
    console.log('Real-time enabled for profiles table');
    return true;
  } catch (err) {
    console.error('Failed to enable real-time:', err);
    return false;
  }
};
