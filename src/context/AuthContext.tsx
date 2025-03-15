
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
  signup: async () => {},
  logout: async () => {},
  isAdmin: () => false,
  hasRole: () => false,
  requiresAuth: () => {},
  session: null
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
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState(!!session);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
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
            setError(profileError.message);
          }

          setUser(profile || null);
        } catch (err: any) {
          console.error("Unexpected error fetching profile:", err);
          setError(err.message || "Failed to load user profile");
        } finally {
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    };

    fetchUser();
  }, [session, supabaseClient]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
        return { error };
      }
      setUser(data.user as any);
      return { error: null };
    } catch (err: any) {
      setError(err.message);
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
        setError(error.message);
        return { error };
      }
      setUser(data.user as any);
      return { error: null };
    } catch (err: any) {
      setError(err.message);
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      setUser(data.user as any);
      setIsAuthenticated(true);
      return data;
    } catch (err: any) {
      setError(err.message);
      console.error("Login error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, username: string, password: string, roles: UserRole[] = ['user']) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            roles
          }
        }
      });

      if (error) throw error;

      // Create user profile in 'profiles' table
      await supabaseClient
        .from('profiles')
        .insert([
          { id: data.user?.id, username, email: data.user?.email, roles: roles }
        ]);

      setUser(data.user as any);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.message);
      console.error("Signup error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await supabaseClient.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
    } catch (err: any) {
      setError(err.message);
      console.error("Logout error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = () => {
    return user?.roles?.includes('admin');
  };

  const hasRole = (role: UserRole | string) => {
    return user?.roles?.includes(role);
  };

  const requiresAuth = (action: () => void, redirectUrl = '/login') => {
    if (isAuthenticated) {
      action();
    } else {
      window.location.href = redirectUrl;
    }
  };

  // When setting the context value, ensure it includes all the properties
  const value: AuthContextType = {
    user,
    signIn,
    signUp,
    signOut,
    loading,
    error,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
    isAdmin,
    hasRole,
    requiresAuth,
    session
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
