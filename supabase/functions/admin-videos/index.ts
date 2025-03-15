
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Create admin supabase client with service role key
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing environment variables");
    }

    // Verify admin authorization
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid authorization" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.split(" ")[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized", details: authError }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || profile?.role !== "admin") {
      return new Response(
        JSON.stringify({ error: "Forbidden: Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse the request body
    const { action, videoId, status, videoData } = await req.json();

    // Handle different actions
    switch (action) {
      case "list":
        const { data, error, count } = await supabase
          .from("videos")
          .select(`
            *,
            profiles:user_id (username, avatar_url)
          `, { count: "exact" })
          .order("created_at", { ascending: false });

        if (error) throw error;

        return new Response(
          JSON.stringify({ videos: data, total: count }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );

      case "update":
        if (!videoId) {
          return new Response(
            JSON.stringify({ error: "Video ID is required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { error: updateError } = await supabase
          .from("videos")
          .update({ 
            ...videoData,
            updated_at: new Date().toISOString() 
          })
          .eq("id", videoId);

        if (updateError) throw updateError;

        return new Response(
          JSON.stringify({ success: true, message: "Video updated successfully" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );

      case "delete":
        if (!videoId) {
          return new Response(
            JSON.stringify({ error: "Video ID is required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // First delete all interactions for this video
        const { error: intDeleteError } = await supabase
          .from("video_interactions")
          .delete()
          .eq("video_id", videoId);

        if (intDeleteError) throw intDeleteError;

        // Then delete the video
        const { error: deleteError } = await supabase
          .from("videos")
          .delete()
          .eq("id", videoId);

        if (deleteError) throw deleteError;

        return new Response(
          JSON.stringify({ success: true, message: "Video deleted successfully" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );

      default:
        return new Response(
          JSON.stringify({ error: "Invalid action" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
