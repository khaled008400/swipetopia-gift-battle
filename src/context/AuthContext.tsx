import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, AuthContextType } from '@/types/auth.types';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  loading: false,
  error: null,
  isAuthenticated: false,
  isLoading: false,
  login: async () => null,
  register: async () => ({}),
  logout: async () => {},
  updateProfile: async () => false,
  addPaymentMethod: async () => false,
  removePaymentMethod: async () => false,
  requiresAuth: () => {},
  session: null,
  isAdmin: () => false,
  hasRole: () => false
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.id);
        setSession(currentSession);
        
        if (currentSession?.user) {
          await fetchUserProfile(currentSession.user.id);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        setLoading(true);
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession?.user) {
          setSession(currentSession);
          await fetchUserProfile(currentSession.user.id);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "There was a problem connecting to the authentication service."
        });
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
        const userProfile: UserProfile = {
          id: profile.id,
          username: profile.username || 'User',
          email: profile.email || '',
          avatar_url: profile.avatar_url,
          coins: profile.coins || 0,
          followers: profile.followers || 0,
          following: profile.following || 0,
          roles: Array.isArray(profile.roles) ? profile.roles : [profile.role as UserRole] || ['user'],
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
        setUser(userProfile);
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
      
      // Create a new profile
      const newProfile = {
        id: userId,
        username: username,
        email: authUser.email || '',
        avatar_url: `https://i.pravatar.cc/150?u=${username}`,
        coins: 1000,
        followers: 0,
        following: 0,
        roles: ['user'],
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
      
      setUser(userProfile);
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

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      console.log(`Attempting to login with: ${email}`);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Supabase login error:", error);
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: error.message
        });
        throw error;
      }
      
      console.log("Login successful:", data);
      setIsAuthenticated(true);
      
      if (data.user) {
        await fetchUserProfile(data.user.id);
      }
      
      return { error: null };
    } catch (err: any) {
      console.error("Login error:", err);
      setError(new Error(err.message));
      return { error: err };
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
            // Set the user immediately after successful registration and profile creation
            setUser({
              ...newProfile,
              interests: [],
              payment_methods: [],
              notification_preferences: {
                battles: true,
                orders: true, 
                messages: true,
                followers: true
              }
            });
            setIsAuthenticated(true);
          }
        } catch (profileErr) {
          console.error("Failed to create profile during registration:", profileErr);
        }
      }

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

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
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

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
      
      if (error) throw new Error(error.message);
      
      setUser(prev => prev ? { ...prev, ...updates } : null);
      return true;
    } catch (err: any) {
      setError(new Error(err.message));
      return false;
    }
  };

  const addPaymentMethod = async (method: any) => {
    if (!user) return false;
    
    try {
      // Clone the current payment methods array
      const updatedPaymentMethods = [...user.payment_methods, method];
      
      // Update the profile with the new payment methods array
      const { error } = await supabase
        .from('profiles')
        .update({ payment_methods: updatedPaymentMethods })
        .eq('id', user.id);
      
      if (error) throw new Error(error.message);
      
      // Update local state
      setUser(prev => prev ? {
        ...prev,
        payment_methods: updatedPaymentMethods
      } : null);
      
      return true;
    } catch (err: any) {
      setError(new Error(err.message));
      return false;
    }
  };

  const removePaymentMethod = async (id: string) => {
    if (!user) return false;
    
    try {
      // Filter out the payment method to be removed
      const updatedPaymentMethods = user.payment_methods.filter(method => method.id !== id);
      
      // Update the profile with the filtered payment methods array
      const { error } = await supabase
        .from('profiles')
        .update({ payment_methods: updatedPaymentMethods })
        .eq('id', user.id);
      
      if (error) throw new Error(error.message);
      
      // Update local state
      setUser(prev => prev ? {
        ...prev,
        payment_methods: updatedPaymentMethods
      } : null);
      
      return true;
    } catch (err: any) {
      setError(new Error(err.message));
      return false;
    }
  };

  const hasRole = (role: string): boolean => {
    if (!user || !user.roles) return false;
    return user.roles.includes(role as UserRole);
  };

  const value: AuthContextType = {
    user,
    session,
    isAuthenticated,
    isLoading,
    signIn: login,
    signUp: register,
    signOut: logout,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    addPaymentMethod,
    removePaymentMethod,
    requiresAuth: () => {},
    isAdmin: () => hasRole('admin'),
    hasRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
