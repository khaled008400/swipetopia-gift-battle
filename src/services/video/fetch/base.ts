
import { supabase } from '../base.service';

// Common query parts - only use fields that actually exist in the profiles table
export const videoWithUserSelect = `
  *,
  profiles:user_id (
    id,
    username,
    avatar_url
  )
`;

// Helper for common error handling
export const handleFetchError = (functionName: string, error: any) => {
  console.error(`Error in ${functionName}:`, error);
  throw error;
};

// Function to convert fetched data to Video type
export const mapVideoData = (videoData: any) => {
  if (!videoData) return null;
  
  return {
    ...videoData,
    user: {
      id: videoData.profiles?.id,
      username: videoData.profiles?.username || 'Unknown User',
      avatar: videoData.profiles?.avatar_url,
      avatar_url: videoData.profiles?.avatar_url
    }
  };
};
