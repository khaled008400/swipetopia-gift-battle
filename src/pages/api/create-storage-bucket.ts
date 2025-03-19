
import { supabase } from '@/integrations/supabase/client';

export async function createStorageBucket() {
  try {
    const { data, error } = await supabase.functions.invoke('create-storage-bucket');
    
    if (error) {
      console.error('Error calling create-storage-bucket function:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error calling create-storage-bucket function:', error);
    throw new Error('Failed to create storage buckets');
  }
}
