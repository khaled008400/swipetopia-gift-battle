
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
    const body = await req.json();
    const { action, userData, userId, role, status } = body;

    let result;

    switch (action) {
      case 'create-user':
        if (!userData) {
          throw new Error('User data is required');
        }

        // Create user in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: userData.email,
          password: userData.password,
          email_confirm: true,
          user_metadata: {
            username: userData.username,
            role: userData.role
          }
        });

        if (authError) throw authError;

        // Create profile in the profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            username: userData.username,
            email: userData.email,
            role: userData.role,
            roles: [userData.role]
          });

        if (profileError) throw profileError;

        result = { user: authData.user, success: true };
        break;

      case 'update-role':
        if (!userId || !role) {
          throw new Error('User ID and role are required');
        }

        // Update user role in the profiles table
        const { error: updateRoleError } = await supabase
          .from('profiles')
          .update({ 
            role: role,
            roles: [role]
          })
          .eq('id', userId);

        if (updateRoleError) throw updateRoleError;

        result = { success: true };
        break;

      case 'update-status':
        if (!userId || !status) {
          throw new Error('User ID and status are required');
        }

        // For now, we'll log this action since we don't have a status field
        console.log(`Updating user ${userId} status to ${status}`);

        result = { success: true };
        break;

      default:
        throw new Error('Invalid action');
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in manage-users function:', error.message);
    
    return new Response(JSON.stringify({
      error: error.message,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
