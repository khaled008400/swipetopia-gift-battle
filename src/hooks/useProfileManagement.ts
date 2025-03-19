
import { useState } from 'react';
import { UserProfile, UserRole } from '@/types/auth.types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useProfileManagement = () => {
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user ID:", userId);
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileError) {
        console.error("Error fetching profile:", profileError);
        
        // If profile doesn't exist, create one
        if (profileError.code === 'PGRST116') {
          console.log("Profile not found, attempting to create one");
          return await createDefaultProfile(userId);
        }
        
        throw profileError;
      }

      if (profile) {
        console.log("Profile fetched successfully:", profile);
        // Convert roles to UserRole[] type - fixing the TS error
        const userRoles: UserRole[] = Array.isArray(profile.roles) 
          ? profile.roles.map(role => role as UserRole)
          : profile.role 
            ? [profile.role as UserRole]
            : ['user' as UserRole]; // Fixed: explicitly cast 'user' to UserRole

        const userProfile: UserProfile = {
          id: profile.id,
          username: profile.username || 'User',
          email: profile.email || '',
          avatar_url: profile.avatar_url,
          coins: profile.coins || 0,
          followers: profile.followers || 0,
          following: profile.following || 0,
          roles: userRoles,
          bio: profile.bio,
          location: profile.location,
          interests: profile.interests || [],
          shop_name: profile.shop_name,
          stream_key: profile.stream_key,
          payment_methods: profile.payment_methods || [],
          notification_preferences: profile.notification_preferences || {
            battles: true,
            orders: true,
            messages: true,
            followers: true
          }
        };
        return userProfile;
      } else {
        console.log("No profile found, creating default profile");
        return await createDefaultProfile(userId);
      }
    } catch (err) {
      console.error("Error in fetchUserProfile:", err);
      toast({
        variant: "destructive",
        title: "Profile Error",
        description: "Failed to load your profile. Please try refreshing the page."
      });
      return null;
    }
  };

  const createDefaultProfile = async (userId: string) => {
    try {
      console.log("Creating default profile for:", userId);
      
      // Get user details from auth
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        console.error("No auth user found while trying to create profile");
        return null;
      }
      
      const username = authUser.user_metadata?.username || 
                     authUser.email?.split('@')[0] || 
                     `user_${Math.floor(Math.random() * 10000)}`;
      
      // Create a new profile with properly typed roles
      const newProfile = {
        id: userId,
        username: username,
        email: authUser.email || '',
        avatar_url: `https://i.pravatar.cc/150?u=${username}`,
        coins: 1000,
        followers: 0,
        following: 0,
        roles: ['user' as UserRole],
        interests: [],
        payment_methods: []
      };
      
      const { data, error } = await supabase
        .from('profiles')
        .insert([newProfile])
        .select()
        .single();
      
      if (error) {
        console.error("Error creating profile:", error);
        throw error;
      }
      
      console.log("Created default profile:", data);
      
      const userProfile: UserProfile = {
        ...newProfile,
        notification_preferences: {
          battles: true,
          orders: true,
          messages: true,
          followers: true
        }
      };
      
      return userProfile;
    } catch (err) {
      console.error("Error creating default profile:", err);
      toast({
        variant: "destructive",
        title: "Profile Creation Failed",
        description: "Failed to create your profile. Please try again."
      });
      return null;
    }
  };

  const updateProfile = async (userId: string, updates: Partial<UserProfile>) => {
    if (!userId) return false;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);
      
      if (error) throw new Error(error.message);
      
      return true;
    } catch (err: any) {
      setError(new Error(err.message));
      return false;
    }
  };

  const addPaymentMethod = async (userId: string, currentMethods: any[], method: any) => {
    if (!userId) return false;
    
    try {
      // Clone the current payment methods array
      const updatedPaymentMethods = [...currentMethods, method];
      
      // Update the profile with the new payment methods array
      const { error } = await supabase
        .from('profiles')
        .update({ payment_methods: updatedPaymentMethods })
        .eq('id', userId);
      
      if (error) throw new Error(error.message);
      
      return true;
    } catch (err: any) {
      setError(new Error(err.message));
      return false;
    }
  };

  const removePaymentMethod = async (userId: string, currentMethods: any[], id: string) => {
    if (!userId) return false;
    
    try {
      // Filter out the payment method to be removed
      const updatedPaymentMethods = currentMethods.filter(method => method.id !== id);
      
      // Update the profile with the filtered payment methods array
      const { error } = await supabase
        .from('profiles')
        .update({ payment_methods: updatedPaymentMethods })
        .eq('id', userId);
      
      if (error) throw new Error(error.message);
      
      return true;
    } catch (err: any) {
      setError(new Error(err.message));
      return false;
    }
  };

  return {
    fetchUserProfile,
    createDefaultProfile,
    updateProfile,
    addPaymentMethod,
    removePaymentMethod,
    error
  };
};
