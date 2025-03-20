
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
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
      
      // Sign in with email and password
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (signInError) {
        console.error("useAuthMethods: Login error:", signInError);
        setError(signInError);
        return { data: null, error: signInError };
      }
      
      if (!data.user || !data.session) {
        const noUserError = new Error("Login successful but no user or session was returned");
        console.error("useAuthMethods: No user/session:", noUserError);
        setError(noUserError);
        return { data: null, error: noUserError };
      }
      
      console.log("useAuthMethods: Login successful, user ID:", data.user.id);
      console.log("useAuthMethods: User metadata:", data.user.user_metadata);
      console.log("useAuthMethods: Session acquired:", !!data.session);
      
      return { data, error: null };
    } catch (err: any) {
      console.error("useAuthMethods: Login error:", err);
      setError(err);
      return { data: null, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, username: string, password: string, role: UserRole = 'user') => {
    setIsLoading(true);
    try {
      console.log(`useAuthMethods: Attempting to register user with email: ${email}, username: ${username}`);
      
      // First check if username already exists
      const { data: existingUsers, error: checkError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .limit(1);
      
      if (checkError) {
        console.error("useAuthMethods: Error checking username:", checkError);
        throw new Error(checkError.message);
      }
      
      if (existingUsers && existingUsers.length > 0) {
        console.error("useAuthMethods: Username already taken:", username);
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

      if (error) {
        console.error("useAuthMethods: Registration error:", error);
        throw new Error(error.message);
      }

      console.log("useAuthMethods: User registered successfully:", data?.user?.id);

      // Create profile
      if (data.user) {
        try {
          // Check if profile already exists first
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', data.user.id)
            .maybeSingle();
            
          if (existingProfile) {
            console.log('useAuthMethods: Profile already exists for user:', data.user.id);
            return { error: null };
          }

          const newProfile = {
            id: data.user.id,
            username, 
            email, 
            roles: [role],
            role: role,
            coins: 1000,
            followers: 0,
            following: 0,
            avatar_url: `https://i.pravatar.cc/150?u=${username}`,
          };
          
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([newProfile]);
            
          if (profileError) {
            console.error("useAuthMethods: Error creating profile during registration:", profileError);
          } else {
            console.log("useAuthMethods: Profile created successfully during registration");
          }
        } catch (profileErr) {
          console.error("useAuthMethods: Failed to create profile during registration:", profileErr);
        }
      }

      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully. Please log in."
      });
      return { error: null };
    } catch (err: any) {
      console.error("useAuthMethods: Registration error:", err);
      setError(new Error(err.message));
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: err.message || "Failed to create account"
      });
      return { error: err };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      console.log("useAuthMethods: Attempting to sign out user");
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("useAuthMethods: Sign-out error:", error);
        throw error;
      }
      
      console.log("useAuthMethods: User signed out successfully");
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out."
      });
    } catch (err: any) {
      console.error("useAuthMethods: Logout error:", err);
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
