
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/auth.types';
import { useToast } from './use-toast';

export const useAuthMethods = () => {
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`Attempting to login with: ${email}`);
      
      const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (supabaseError) {
        console.error("Supabase login error:", supabaseError);
        setError(supabaseError);
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: supabaseError.message || "Invalid email or password"
        });
        return { data: null, error: supabaseError };
      }
      
      console.log("Login successful:", data);
      toast({
        title: "Login Successful",
        description: "Welcome back!"
      });
      return { data, error: null };
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err);
      toast({
        variant: "destructive",
        title: "Login Error",
        description: err.message || "An unexpected error occurred"
      });
      return { data: null, error: err };
    } finally {
      setIsLoading(false);
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
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out."
      });
    } catch (err: any) {
      setError(new Error(err.message));
      console.error("Logout error:", err);
      toast({
        variant: "destructive",
        title: "Logout Error",
        description: "There was a problem signing out."
      });
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
