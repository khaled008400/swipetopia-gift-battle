
import { useState, useEffect, useCallback } from 'react';
import { UserProfile } from '@/types/auth.types';
import { supabase } from '@/lib/supabase';

export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    console.log(`Fetching profile for user ID: ${userId}`);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error(`Error fetching profile for ${userId}:`, error);
      return null;
    }
    
    if (!data) {
      console.log(`No profile found for user ID: ${userId}`);
      return null;
    }
    
    console.log(`Profile found for ${userId}:`, data.username);
    return data as UserProfile;
  } catch (err) {
    console.error(`Exception fetching profile for ${userId}:`, err);
    return null;
  }
};

export const useUserProfile = (userId: string | undefined) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProfile = useCallback(async () => {
    if (!userId) {
      setProfile(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const fetchedProfile = await fetchUserProfile(userId);
      setProfile(fetchedProfile);
    } catch (err: any) {
      console.error("Error in refreshProfile:", err);
      setError(err.message || "Failed to load profile");
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const updateProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!userId) {
      setError("No user ID provided");
      return false;
    }

    try {
      setIsLoading(true);
      const { error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

      if (updateError) throw updateError;
      
      // Refresh the profile after update
      await refreshProfile();
      return true;
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setError(err.message || "Failed to update profile");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  return { profile, isLoading, error, refreshProfile, updateProfile };
};
