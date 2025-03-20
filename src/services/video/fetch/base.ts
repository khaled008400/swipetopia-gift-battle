
import { supabase } from '../base.service';

// Common query parts
export const videoWithUserSelect = `
  *,
  user:user_id (
    id,
    username,
    avatar_url,
    avatar
  )
`;

// Helper for common error handling
export const handleFetchError = (functionName: string, error: any) => {
  console.error(`Error in ${functionName}:`, error);
  throw error;
};
