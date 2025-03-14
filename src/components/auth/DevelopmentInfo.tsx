
import { isSupabaseConnected } from "@/integrations/supabase/client";

const DevelopmentInfo = () => {
  if (!import.meta.env.DEV) return null;
  
  const supabaseDisconnected = !isSupabaseConnected();
  
  return (
    <div className="mt-4 p-3 bg-blue-900/30 rounded-md">
      <p className="text-xs text-blue-400">
        Development mode: You can use any credentials for login, or use the demo email "demo@example.com" with password "password"
        {supabaseDisconnected && " (Supabase is disconnected, all auth operations will be mocked)"}
      </p>
    </div>
  );
};

export default DevelopmentInfo;
