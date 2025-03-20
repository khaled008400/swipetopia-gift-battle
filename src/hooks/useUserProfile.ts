
import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const getProfile = async () => {
      if (!userId) {
        setProfile(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const fetchedProfile = await fetchUserProfile(userId);
        setProfile(fetchedProfile);
        setError(null);
      } catch (err: any) {
        console.error("Error in useUserProfile:", err);
        setError(err.message || "Failed to load profile");
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    getProfile();
  }, [userId]);

  return { profile, isLoading, error };
};
