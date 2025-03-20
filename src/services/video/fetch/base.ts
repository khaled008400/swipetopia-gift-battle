
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
  // Return the error rather than throwing it, to allow the caller to handle it
  return error;
};

// Function to convert fetched data to Video type
export const mapVideoData = (videoData: any) => {
  if (!videoData) return null;
  
  // Ensure we handle all required properties of the Video type
  return {
    ...videoData,
    user: {
      id: videoData.profiles?.id,
      username: videoData.profiles?.username || 'Unknown User',
      avatar_url: videoData.profiles?.avatar_url
    },
    // Ensure these fields are always present
    likes_count: videoData.likes_count || 0,
    comments_count: videoData.comments_count || 0,
    shares_count: videoData.shares_count || 0,
    view_count: videoData.view_count || 0
  };
};
