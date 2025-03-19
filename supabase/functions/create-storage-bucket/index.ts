
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
    const buckets = ['videos', 'thumbnails', 'avatars', 'gift-icons', 'gift-sounds'];
    const results = [];

    for (const bucket of buckets) {
      try {
        // Try to get bucket first to see if it exists
        const { data: bucketData, error: getBucketError } = await supabase.storage.getBucket(bucket);
        
        if (getBucketError) {
          console.log(`Bucket ${bucket} doesn't exist, creating it...`);
          const { data, error } = await supabase.storage.createBucket(bucket, {
            public: true,
            fileSizeLimit: bucket === 'videos' ? 104857600 : 10485760, // 100MB for videos, 10MB for others
          });

          results.push({
            bucket,
            success: !error,
            error: error ? error.message : null,
            created: true
          });
        } else {
          console.log(`Bucket ${bucket} already exists`);
          // Update bucket to ensure it's public
          const { error: updateError } = await supabase.storage.updateBucket(bucket, {
            public: true,
            fileSizeLimit: bucket === 'videos' ? 104857600 : 10485760, // 100MB for videos, 10MB for others
          });
          
          results.push({
            bucket,
            success: !updateError,
            error: updateError ? updateError.message : null,
            created: false,
            updated: true
          });
        }
      } catch (bucketError) {
        console.error(`Error handling bucket ${bucket}:`, bucketError);
        results.push({
          bucket,
          success: false,
          error: bucketError.message,
        });
      }
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
