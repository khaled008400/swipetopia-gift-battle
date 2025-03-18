
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, AuthContextType } from '@/types/auth.types';
import { Session } from '@supabase/supabase-js';

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
  supabaseClient: any;
  session: Session | null;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  supabaseClient,
  session,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!session);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (session?.user) {
        try {
          const { data: profile, error: profileError } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error("Error fetching user profile:", profileError);
            setError(new Error(profileError.message));
          }

          // If profile exists, use it, otherwise check metadata for role
          if (profile) {
            console.log("Profile fetched from database:", profile);
            
            // Ensure roles is always an array
            const userRoles = profile.roles ? 
              (Array.isArray(profile.roles) ? profile.roles : [profile.roles]) : 
              ['user'] as UserRole[];
            
            const userProfile: UserProfile = {
              id: profile.id,
              username: profile.username,
              email: profile.email || session.user.email || '',
              avatar_url: profile.avatar_url,
              bio: profile.bio,
              location: profile.location,
              roles: userRoles,
              coins: profile.coins || 0,
              followers: profile.followers || 0,
              following: profile.following || 0,
              interests: profile.interests,
              stream_key: profile.stream_key,
              shop_name: profile.shop_name,
              payment_methods: profile.payment_methods || [],
              notification_preferences: profile.notification_preferences || {
                battles: true,
                orders: true,
                messages: true,
                followers: true
              }
            };
            
            setUser(userProfile);
          } else {
            // If no profile in database, use metadata from auth user
            console.log("No profile found, using auth metadata");
            
            // Extract roles from metadata
            const metadataRoles = session.user.user_metadata?.roles || 
                                [session.user.user_metadata?.role || 'user'];
            
            const userRoles = Array.isArray(metadataRoles) ? 
                              metadataRoles as UserRole[] : 
                              [metadataRoles as UserRole];
            
            const userProfile: UserProfile = {
              id: session.user.id,
              email: session.user.email || '',
              username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || '',
              roles: userRoles,
              coins: 0,
              followers: 0,
              following: 0,
              payment_methods: [],
              notification_preferences: {
                battles: true,
                orders: true,
                messages: true,
                followers: true
              }
            };
            
            console.log("Created user profile from metadata:", userProfile);
            setUser(userProfile);
          }
        } catch (err: any) {
          console.error("Unexpected error fetching profile:", err);
          setError(new Error(err.message || "Failed to load user profile"));
        } finally {
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    };

    if (session) {
      console.log("Session found, fetching user profile");
      fetchUser();
    } else {
      console.log("No session, clearing user");
      setUser(null);
      setLoading(false);
    }
  }, [session, supabaseClient]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(new Error(error.message));
        return { error };
      }
      // Full user profile will be fetched in the useEffect hook
      return { error: null };
    } catch (err: any) {
      setError(new Error(err.message));
      return { error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      setLoading(true);
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });
      if (error) {
        setError(new Error(error.message));
        return { error };
      }
      // Full user profile will be created by database trigger or fetched in useEffect
      return { error: null };
    } catch (err: any) {
      setError(new Error(err.message));
      return { error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabaseClient.auth.signOut();
      setUser(null);
    } catch (err: any) {
      setError(new Error(err.message));
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log("Attempting login with Supabase:", email);
      
      // First try Supabase login
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.log("Supabase login failed, checking mock logins:", error);
        
        // Mock login for admin@flytick.net / 123456 (owner)
        if (email === 'admin@flytick.net' && password === '123456') {
          console.log("Using owner mock login");
          // Create mock user with owner role
          const mockUser: UserProfile = {
            id: 'owner-user-456',
            email: email,
            username: 'owner',
            roles: ['admin' as UserRole],
            coins: 1000,
            followers: 0,
            following: 0,
            payment_methods: [],
            notification_preferences: {
              battles: true,
              orders: true,
              messages: true,
              followers: true
            }
          };
          
          setUser(mockUser);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(mockUser));
          return { user: mockUser };
        } 
        // Mock login for seller@example.com / seller123 (seller role)
        else if (email === 'seller@example.com' && password === 'seller123') {
          console.log("Using seller mock login");
          // Create mock user with seller role
          const mockUser: UserProfile = {
            id: 'seller-user-789',
            email: email,
            username: 'seller',
            roles: ['seller' as UserRole],
            shop_name: 'Amazing Products',
            coins: 1000,
            followers: 0,
            following: 0,
            payment_methods: [],
            notification_preferences: {
              battles: true,
              orders: true,
              messages: true,
              followers: true
            }
          };
          
          setUser(mockUser);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(mockUser));
          return { user: mockUser };
        }
        // Mock login for admin@example.com (admin role)
        else if (email === 'admin@example.com') {
          console.log("Using admin mock login");
          // Create mock user with admin role
          const mockUser: UserProfile = {
            id: 'mock-user-123',
            email: email,
            username: 'admin',
            roles: ['admin' as UserRole],
            coins: 1000,
            followers: 0,
            following: 0,
            payment_methods: [],
            notification_preferences: {
              battles: true,
              orders: true,
              messages: true,
              followers: true
            }
          };
          
          setUser(mockUser);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(mockUser));
          return { user: mockUser };
        }
        
        throw new Error(error.message);
      }
      
      // Handle successful Supabase login
      console.log("Supabase login successful, user:", data.user);
      setIsAuthenticated(true);
      
      // User profile will be fetched by the useEffect hook
      return data;
    } catch (err: any) {
      setError(new Error(err.message));
      console.error("Login error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, username: string, password: string, role: UserRole = 'user') => {
    setIsLoading(true);
    try {
      const { data, error } = await supabaseClient.auth.signUp({
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

      // Insert into profiles table (this might be redundant if you have a database trigger)
      await supabaseClient
        .from('profiles')
        .insert([
          { 
            id: data.user?.id, 
            username, 
            email: data.user?.email, 
            roles: [role],
            coins: 1000, // Default starting coins
            followers: 0,
            following: 0,
            payment_methods: [],
            notification_preferences: {
              battles: true,
              orders: true,
              messages: true,
              followers: true
            }
          }
        ]);

      // User profile will be fetched by the useEffect hook
      setIsAuthenticated(true);
      return data;
    } catch (err: any) {
      setError(new Error(err.message));
      console.error("Registration error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return false;
    
    try {
      const { error } = await supabaseClient
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
      const { error } = await supabaseClient
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
      const { error } = await supabaseClient
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

  const isAdmin = () => {
    // Extra debugging for admin check
    console.log("isAdmin check - Current user state:", user);
    console.log("isAdmin check - Local storage user:", localStorage.getItem('user'));
    
    // Try to get admin status from the user state first
    if (user) {
      const hasAdminRole = user.roles?.includes('admin' as UserRole);
      
      console.log("Checking admin status from user state:", hasAdminRole, user);
      
      if (hasAdminRole) return true;
    }
    
    // Fallback to localStorage for edge cases
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.roles?.includes('admin')) {
          console.log("Admin detected from localStorage", parsedUser);
          return true;
        }
      } catch (e) {
        console.error("Error parsing stored user:", e);
      }
    }
    
    // Check if we have a session with admin role in user metadata
    if (session?.user?.user_metadata) {
      const metadata = session.user.user_metadata;
      if ((metadata.roles && metadata.roles.includes('admin'))) {
        console.log("Admin detected from session metadata", metadata);
        return true;
      }
    }
    
    console.log("User is not an admin");
    return false;
  };

  const hasRole = (role: UserRole | string) => {
    console.log("Checking if user has role:", role, "User:", user);
    
    if (!user) return false;
    
    // Check user object first
    if (user.roles?.includes(role as UserRole)) {
      return true;
    }
    
    // Fallback to localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.roles?.includes(role)) {
          return true;
        }
      } catch (e) {
        console.error("Error parsing stored user:", e);
      }
    }
    
    // Check session metadata
    if (session?.user?.user_metadata) {
      const metadata = session.user.user_metadata;
      if (metadata.roles && metadata.roles.includes(role)) {
        return true;
      }
    }
    
    return false;
  };

  const requiresAuth = (action: () => void, redirectUrl?: string) => {
    if (user) {
      action();
    } else {
      console.log('Authentication required, redirecting to', redirectUrl || '/login');
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('auth_token');
      
      await supabaseClient.auth.signOut();
      
      setUser(null);
      setIsAuthenticated(false);
    } catch (err: any) {
      setError(new Error(err.message));
      console.error("Logout error:", err);
    }
  };

  const value: AuthContextType = {
    user,
    session,
    isAuthenticated,
    isLoading,
    signIn,
    signUp,
    signOut,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    addPaymentMethod,
    removePaymentMethod,
    requiresAuth,
    isAdmin,
    hasRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
