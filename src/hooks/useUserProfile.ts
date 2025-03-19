
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { UserProfile, UserRole, NotificationPreferences } from "@/types/auth.types";
import { useToast } from "@/components/ui/use-toast";

export const fetchUserProfile = async (authUser: User | string): Promise<UserProfile | null> => {
  try {
    const userId = typeof authUser === 'string' ? authUser : authUser.id;
    console.log('fetchUserProfile called for user ID:', userId);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
    
    if (data) {
      console.log('Profile data fetched successfully:', data);
      // Get roles from database if available, otherwise from metadata, or default to "user"
      let userRoles: UserRole[] = [];
      
      // Check if roles exists in database (array format)
      if (data.roles && Array.isArray(data.roles)) {
        userRoles = data.roles as UserRole[];
      } 
      // Handle legacy single role field in database
      else if (data.role) {
        userRoles = [data.role as UserRole];
      } 
      // Default role if none found
      else {
        userRoles = ["user"]; // Default role
      }

      const userEmail = typeof authUser === 'string' ? data.email : authUser.email;

      return {
        id: data.id,
        username: data.username,
        email: userEmail || '',
        avatar_url: data.avatar_url,
        coins: data.coins || 0,
        roles: userRoles,
        bio: data.bio || undefined,
        location: data.location || undefined,
        followers: data.followers || 0,
        following: data.following || 0,
        interests: data.interests || undefined,
        shop_name: data.shop_name || undefined,
        stream_key: data.stream_key || undefined,
        payment_methods: [], // Default empty array
        notification_preferences: {
          battles: true,
          orders: true,
          messages: true,
          followers: true
        } // Default notification preferences
      };
    }
    console.log('No profile data found for user ID:', userId);
    return null;
  } catch (error) {
    console.error("Unexpected error fetching profile:", error);
    return null;
  }
};

export const useUserProfile = (authUser: User | string | null) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Function to load the profile
  const loadProfile = useCallback(async () => {
    if (!authUser) {
      console.log('useUserProfile: No authUser provided, clearing profile');
      setProfile(null);
      setIsLoading(false);
      return;
    }

    console.log('loadProfile started for:', typeof authUser === 'string' ? authUser : authUser.id);
    setIsLoading(true);
    try {
      const userProfile = await fetchUserProfile(authUser);
      console.log('loadProfile result:', userProfile ? 'Profile loaded' : 'No profile found');
      setProfile(userProfile);
      setError(null);
    } catch (err) {
      console.error("Error in useUserProfile:", err);
      setError("Failed to load user profile");
      toast({
        variant: "destructive",
        title: "Error loading profile",
        description: "Please try again later"
      });
    } finally {
      setIsLoading(false);
    }
  }, [authUser, toast]);

  // Initial load
  useEffect(() => {
    console.log('useUserProfile useEffect triggered with authUser:', authUser ? 'exists' : 'null');
    loadProfile();
  }, [authUser, loadProfile]);

  // Set up real-time subscriptions for profile updates
  useEffect(() => {
    if (!authUser) return;
    
    const userId = typeof authUser === 'string' ? authUser : authUser.id;
    console.log('Setting up real-time profile subscription for user ID:', userId);
    
    const profileSubscription = supabase
      .channel('profile-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          console.log('Real-time profile update received:', payload);
          // Refresh the profile when changes are detected
          loadProfile();
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up profile subscription');
      supabase.removeChannel(profileSubscription);
    };
  }, [authUser, loadProfile]);

  // Function to update profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!authUser || !profile) {
      console.error('updateProfile: No authUser or profile');
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to update your profile"
      });
      return { success: false, error: "Not authenticated" };
    }

    try {
      setIsLoading(true);
      
      const userId = typeof authUser === 'string' ? authUser : authUser.id;
      console.log('Updating profile for user ID:', userId, 'with data:', updates);
      
      // Prepare the data for update, excluding fields that aren't in the database schema
      const { payment_methods, notification_preferences, ...dbUpdates } = updates;
      
      const { error } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('id', userId);

      if (error) throw error;
      
      console.log('Profile update successful');
      
      // Update local state optimistically
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully"
      });
      
      return { success: true };
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setError(err.message || "Failed to update profile");
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to update profile"
      });
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    refreshProfile: loadProfile,
  };
};
