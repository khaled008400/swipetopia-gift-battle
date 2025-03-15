
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { UserProfile, UserRole, NotificationPreferences } from "@/types/auth.types";
import { useToast } from "@/components/ui/use-toast";

export const fetchUserProfile = async (authUser: User | string): Promise<UserProfile | null> => {
  try {
    const userId = typeof authUser === 'string' ? authUser : authUser.id;
    
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
  const loadProfile = async () => {
    if (!authUser) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const userProfile = await fetchUserProfile(authUser);
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
  };

  // Initial load
  useEffect(() => {
    loadProfile();
  }, [authUser]);

  // Set up real-time subscriptions for profile updates
  useEffect(() => {
    if (!authUser) return;
    
    const userId = typeof authUser === 'string' ? authUser : authUser.id;
    
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
        () => {
          // Refresh the profile when changes are detected
          loadProfile();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(profileSubscription);
    };
  }, [authUser]);

  // Function to update profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!authUser || !profile) {
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
      
      // Prepare the data for update, excluding fields that aren't in the database schema
      const { payment_methods, notification_preferences, ...dbUpdates } = updates;
      
      const { error } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('id', userId);

      if (error) throw error;
      
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
