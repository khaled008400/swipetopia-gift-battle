
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { RtcTokenBuilder, RtcRole } from 'https://esm.sh/agora-token@2.0.2';

// This function handles the token generation for Agora
serve(async (req) => {
  // Parse request body
  const { channelName, uid, role, expirationTimeInSeconds = 3600 } = await req.json();
  
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Content-Type': 'application/json',
  };

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers });
  }

  try {
    const appID = Deno.env.get('AGORA_APP_ID');
    const appCertificate = Deno.env.get('AGORA_APP_CERTIFICATE');
    
    if (!appID || !appCertificate) {
      throw new Error('AGORA_APP_ID and AGORA_APP_CERTIFICATE must be set');
    }
    
    // Use 0 for userId if not provided (will generate a random one)
    const userId = uid || 0;
    
    // Determine the appropriate role
    const userRole = role === 'publisher' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;
    
    // Get current timestamp
    const currentTimestamp = Math.floor(Date.now() / 1000);
    
    // Set token expiration
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
    
    // Build the token
    const token = RtcTokenBuilder.buildTokenWithUid(
      appID,
      appCertificate,
      channelName,
      userId,
      userRole,
      privilegeExpiredTs
    );
    
    // Return the token
    return new Response(
      JSON.stringify({ 
        token,
        uid: userId,
        appId: appID
      }),
      { headers }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers }
    );
  }
});
