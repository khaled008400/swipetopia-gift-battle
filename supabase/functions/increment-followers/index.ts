
// Follow-unfollow edge function with CORS support
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req: Request) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    })
  }

  try {
    // Get the request payload
    const { streamerId } = await req.json()
    
    // Create a Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || ""
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Get the JWT token from the request headers
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), { 
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      })
    }
    
    // Extract token
    const token = authHeader.replace('Bearer ', '')
    
    // Get the user ID from the JWT
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized', details: userError }), { 
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      })
    }
    
    const followerId = user.id
    
    // Check if already following
    const { data: existingFollow, error: existingError } = await supabase
      .from('followers')
      .select('*')
      .eq('follower_id', followerId)
      .eq('following_id', streamerId)
      .single()
    
    // Handle the follow or unfollow action
    let result
    
    // If already following, unfollow (delete record)
    if (existingFollow) {
      const { error: deleteError } = await supabase
        .from('followers')
        .delete()
        .eq('follower_id', followerId)
        .eq('following_id', streamerId)
        
      if (deleteError) throw deleteError
      
      // Decrement the follower count
      const { error: decrementError } = await supabase
        .rpc('decrement_followers', { user_id: streamerId })
      
      if (decrementError) throw decrementError
      
      result = { action: 'unfollowed', success: true }
    } else {
      // If not following, follow (insert record)
      const { error: insertError } = await supabase
        .from('followers')
        .insert([{ follower_id: followerId, following_id: streamerId }])
      
      if (insertError) throw insertError
      
      // Increment the follower count
      const { error: incrementError } = await supabase
        .rpc('increment_followers', { user_id: streamerId })
      
      if (incrementError) throw incrementError
      
      result = { action: 'followed', success: true }
    }
    
    // Return the result
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    })
    
  } catch (error) {
    // Return error response
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    })
  }
})
