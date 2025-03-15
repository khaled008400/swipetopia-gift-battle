
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext';
import FollowerService from '@/services/follower.service';

export function useFollower(userId?: string) {
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [followerCount, setFollowerCount] = useState<number>(0);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  
  // Check follow status on mount
  useEffect(() => {
    if (!userId || !isAuthenticated) {
      setLoading(false);
      return;
    }
    
    const checkFollowStatus = async () => {
      try {
        setLoading(true);
        const following = await FollowerService.isFollowing(userId);
        setIsFollowing(following);
      } catch (error) {
        console.error('Error checking follow status:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkFollowStatus();
  }, [userId, isAuthenticated]);
  
  // Function to toggle follow
  const toggleFollow = async () => {
    if (!userId || !user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to follow users",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      const result = await FollowerService.toggleFollow(userId);
      
      setIsFollowing(result.action === 'followed');
      
      // Update follower count
      setFollowerCount(prev => 
        result.action === 'followed' ? prev + 1 : Math.max(0, prev - 1)
      );
      
      toast({
        title: result.action === 'followed' ? "Followed" : "Unfollowed",
        description: result.action === 'followed' 
          ? "You are now following this user" 
          : "You have unfollowed this user",
      });
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast({
        title: "Error",
        description: "Failed to update follow status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return {
    isFollowing,
    loading,
    toggleFollow,
    followerCount,
    setFollowerCount
  };
}
