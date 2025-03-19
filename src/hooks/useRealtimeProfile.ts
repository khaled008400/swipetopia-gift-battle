
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/auth.types';
import { useToast } from '@/components/ui/use-toast';
import { fetchUserProfile } from '@/hooks/useUserProfile';

export const useRealtimeProfile = (userId: string | null) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Initial profile fetch
  useEffect(() => {
    const loadProfile = async () => {
      if (!userId) {
        setProfile(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const userProfile = await fetchUserProfile(userId);
        if (userProfile) {
          setProfile(userProfile);
        } else {
          setError('Profile not found');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile');
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load user profile'
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [userId, toast]);

  // Set up real-time subscription
  useEffect(() => {
    if (!userId) return;

    console.log('Setting up real-time profile subscription for:', userId);

    const channel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`,
        },
        async (payload) => {
          console.log('Profile update detected:', payload);
          
          // Refresh the profile when it changes
          try {
            const updatedProfile = await fetchUserProfile(userId);
            if (updatedProfile) {
              setProfile(updatedProfile);
              toast({
                title: 'Profile Updated',
                description: 'Your profile has been updated'
              });
            }
          } catch (err) {
            console.error('Error refreshing profile:', err);
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up profile subscription');
      supabase.removeChannel(channel);
    };
  }, [userId, toast]);

  return {
    profile,
    isLoading,
    error,
    refreshProfile: async () => {
      if (!userId) return;
      
      setIsLoading(true);
      try {
        const refreshedProfile = await fetchUserProfile(userId);
        if (refreshedProfile) {
          setProfile(refreshedProfile);
        }
      } catch (err) {
        console.error('Error refreshing profile:', err);
        setError('Failed to refresh profile');
      } finally {
        setIsLoading(false);
      }
    }
  };
};
