
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/auth.types';
import { useToast } from '@/components/ui/use-toast';

export const useAuthMethods = () => {
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`useAuthMethods: Attempting login with email: ${email}`);
      
      // Clear any existing session first to prevent conflicts
      await supabase.auth.signOut();
      
      // Simple direct login with Supabase
      const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (supabaseError) {
        console.error("useAuthMethods: Login error:", supabaseError);
        setError(supabaseError);
        setIsLoading(false);
        return { data: null, error: supabaseError };
      }
      
      console.log("useAuthMethods: Login successful, user data:", data?.user?.id);
      
      // Add extra delay to ensure session is completely processed
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Force refresh the session to ensure it's up to date
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError) {
        console.error("useAuthMethods: Session refresh error:", refreshError);
        setError(refreshError);
        setIsLoading(false);
        return { data: null, error: refreshError };
      }
      
      console.log("useAuthMethods: Session refreshed, user exists:", !!refreshData.session);
      
      if (!refreshData.session) {
        console.error("useAuthMethods: Session refresh failed - no session returned");
        setError(new Error("Authentication succeeded but session creation failed"));
        setIsLoading(false);
        return { data: null, error: new Error("Session refresh failed") };
      }
      
      // Double-check that we actually have a valid session
      const { data: sessionCheck } = await supabase.auth.getSession();
      console.log("useAuthMethods: Final session check:", !!sessionCheck.session);
      
      setIsLoading(false);
      return { data: refreshData, error: null };
    } catch (err: any) {
      console.error("useAuthMethods: Login error:", err);
      setError(err);
      setIsLoading(false);
      return { data: null, error: err };
    } finally {
      setIsLoading(false); // Ensure loading state is reset even if there are uncaught errors
    }
  };

  const register = async (email: string, username: string, password: string, role: UserRole = 'user') => {
    setIsLoading(true);
    try {
      // First check if username already exists
      const { data: existingUsers, error: checkError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .limit(1);
      
      if (checkError) throw new Error(checkError.message);
      
      if (existingUsers && existingUsers.length > 0) {
        throw new Error("Username is already taken");
      }
      
      // Register the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            roles: [role]
          }
        }
      });

      if (error) throw new Error(error.message);

      // Create profile
      if (data.user) {
        try {
          // Check if profile already exists first
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', data.user.id)
            .single();
            
          if (existingProfile) {
            console.log('Profile already exists for user:', data.user.id);
            return { error: null };
          }

          const newProfile = {
            id: data.user.id,
            username, 
            email, 
            roles: [role],
            coins: 1000,
            followers: 0,
            following: 0,
            avatar_url: `https://i.pravatar.cc/150?u=${username}`,
          };
          
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([newProfile]);
            
          if (profileError) {
            console.error("Error creating profile during registration:", profileError);
          } else {
            console.log("Profile created successfully during registration");
          }
        } catch (profileErr) {
          console.error("Failed to create profile during registration:", profileErr);
        }
      }

      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully."
      });
      return { error: null };
    } catch (err: any) {
      setError(new Error(err.message));
      console.error("Registration error:", err);
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: err.message
      });
      return { error: err };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      console.log("Attempting to sign out user");
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Signout error:", error);
        throw error;
      }
      
      console.log("User signed out successfully");
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out."
      });
    } catch (err: any) {
      console.error("Logout error:", err);
      setError(new Error(err.message));
      toast({
        variant: "destructive",
        title: "Logout Error",
        description: "There was a problem signing out."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    register,
    logout,
    error,
    isLoading
  };
};
