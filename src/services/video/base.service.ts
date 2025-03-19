
import { supabase } from "@/integrations/supabase/client";

// Base utility functions for video services
export const getAuthenticatedUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    throw new Error("User not authenticated");
  }
  
  return user;
};

// Export supabase for other video services
export { supabase };
