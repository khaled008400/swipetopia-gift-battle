
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/auth.types';
import { useToast } from '@/components/ui/use-toast';
import { useRealtimeProfile } from './useRealtimeProfile';

export const useProfileWithRealtime = (userId: string | null) => {
  const { profile, isLoading, error, refreshProfile } = useRealtimeProfile(userId);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!userId || !profile) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to update your profile"
      });
      return false;
    }

    try {
      setIsUpdating(true);
      
      // Prepare the data for update
      const { payment_methods, notification_preferences, ...dbUpdates } = updates;
      
      const { error } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('id', userId);

      if (error) throw error;
      
      // No need to update local state as the real-time subscription will handle that
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully"
      });
      
      return true;
    } catch (err: any) {
      console.error("Error updating profile:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to update profile"
      });
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    profile,
    isLoading: isLoading || isUpdating,
    error,
    updateProfile,
    refreshProfile
  };
};
