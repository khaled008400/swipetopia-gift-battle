
import { AlertCircle, WifiOff, Database } from "lucide-react";
import { isSupabaseConnected } from "@/integrations/supabase/client";

interface NetworkStatusAlertProps {
  isOnline: boolean;
  isConnectedToApi: boolean;
}

const NetworkStatusAlert = ({ isOnline, isConnectedToApi }: NetworkStatusAlertProps) => {
  const supabaseDisconnected = !isSupabaseConnected();
  
  if (supabaseDisconnected && import.meta.env.DEV) {
    return (
      <div className="mb-4 p-3 bg-amber-900/30 border border-amber-800 rounded-md flex items-center">
        <Database className="h-5 w-5 text-amber-400 mr-2" />
        <p className="text-sm text-amber-300">
          Supabase is disconnected. In development mode, you can use demo credentials to log in.
        </p>
      </div>
    );
  }
  
  if (!isOnline) {
    return (
      <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-md flex items-center">
        <WifiOff className="h-5 w-5 text-red-400 mr-2" />
        <p className="text-sm text-red-300">
          You are offline. Please check your internet connection.
          {import.meta.env.DEV && " You can still use demo login in development mode."}
        </p>
      </div>
    );
  }

  if (isOnline && !isConnectedToApi) {
    return (
      <div className="mb-4 p-3 bg-amber-900/30 border border-amber-800 rounded-md flex items-center">
        <AlertCircle className="h-5 w-5 text-amber-400 mr-2" />
        <p className="text-sm text-amber-300">
          Cannot reach our servers. Some features may be unavailable.
          {import.meta.env.DEV && " In development mode, you can still log in with any credentials."}
        </p>
      </div>
    );
  }

  return null;
};

export default NetworkStatusAlert;
