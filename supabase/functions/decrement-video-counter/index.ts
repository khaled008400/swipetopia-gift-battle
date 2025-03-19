
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

    // Parse the request body
    const { videoId, counterName } = await req.json();

    if (!videoId || !counterName) {
      throw new Error('videoId and counterName are required');
    }

    // First get the current value of the counter
    const { data: videoData, error: fetchError } = await supabase
      .from('videos')
      .select(counterName)
      .eq('id', videoId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    // Only decrement if the counter is greater than 0
    if (videoData && videoData[counterName] > 0) {
      // Update the counter safely
      const { error: updateError } = await supabase
        .from('videos')
        .update({ [counterName]: videoData[counterName] - 1 })
        .eq('id', videoId);

      if (updateError) {
        throw updateError;
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in decrement-video-counter function:', error.message);
    
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
