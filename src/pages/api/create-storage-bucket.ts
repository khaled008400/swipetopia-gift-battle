
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/integrations/supabase/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { data, error } = await supabase.functions.invoke('create-storage-bucket');
    
    if (error) {
      throw error;
    }
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error calling create-storage-bucket function:', error);
    return res.status(500).json({ error: 'Failed to create storage buckets' });
  }
}
