
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing environment variables for Supabase client');
    }

    // Initialize Supabase client with admin rights
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Create or ensure buckets exist
    const buckets = ['videos', 'thumbnails', 'avatars', 'products', 'shops'];
    const results = [];

    for (const bucket of buckets) {
      const { data, error } = await supabase.storage.createBucket(bucket, {
        public: true,
        fileSizeLimit: bucket === 'videos' ? 104857600 : 10485760, // 100MB for videos, 10MB for others
      });

      results.push({
        bucket,
        success: !error,
        error: error ? error.message : null,
      });
    }

    return new Response(JSON.stringify({
      message: 'Storage buckets checked',
      results
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error: any) {
    console.error('Error creating buckets:', error.message);
    
    return new Response(JSON.stringify({
      error: error.message,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
