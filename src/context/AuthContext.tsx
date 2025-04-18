import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, AuthContextType } from '@/types/auth.types';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { useProfileManagement } from '@/hooks/useProfileManagement';
import { useAuthMethods } from '@/hooks/useAuthMethods';
import { hasRole, isAdmin } from '@/utils/roleUtils';
import { fetchUserProfile } from '@/hooks/useUserProfile';

export const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  loading: false,
  error: null,
  isAuthenticated: false,
  isLoading: false,
  login: async () => ({ error: null, data: null }),
  register: async () => ({}),
  logout: async () => {},
  updateProfile: async () => false,
  addPaymentMethod: async () => {},
  removePaymentMethod: async () => {},
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
  const { toast } = useToast();
  
  const { 
    updateProfile: updateUserProfile,
    addPaymentMethod: addUserPaymentMethod,
    removePaymentMethod: removeUserPaymentMethod
  } = useProfileManagement();
  
  const { 
    login: authLogin, 
    register, 
    logout: authLogout,
    isLoading 
  } = useAuthMethods();

  useEffect(() => {
    console.log("Setting up auth state listener in AuthProvider");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.id);
        setSession(currentSession);
        
        if (currentSession?.user) {
          try {
            console.log("Fetching profile for user ID:", currentSession.user.id);
            const profile = await fetchUserProfile(currentSession.user.id);
            
            if (profile) {
              console.log("Profile loaded in auth state change:", profile.username);
              setUser(profile);
              setIsAuthenticated(true);
            } else {
              console.log("No profile found for user in auth state change");
              setUser(null);
              setIsAuthenticated(false);
            }
          } catch (err) {
            console.error("Error fetching profile in auth state change:", err);
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          console.log("No session in auth state change, clearing user");
          setUser(null);
          setIsAuthenticated(false);
        }
        
        // Mark authentication check as complete
        setLoading(false);
      }
    );
    
    // THEN check for existing session
    const checkExistingSession = async () => {
      try {
        console.log("Checking for existing session");
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        console.log("Initial session check:", existingSession ? "Found session" : "No session");
        
        if (existingSession) {
          setSession(existingSession);
          
          try {
            console.log("Found existing session for user:", existingSession.user.id);
            const profile = await fetchUserProfile(existingSession.user.id);
            
            if (profile) {
              console.log("Profile loaded from existing session:", profile.username);
              setUser(profile);
              setIsAuthenticated(true);
            } else {
              console.log("No profile found for existing session user");
              setUser(null);
              setIsAuthenticated(false);
            }
          } catch (err) {
            console.error("Error loading profile from existing session:", err);
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          console.log("No existing session found");
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Error checking for existing session:", err);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkExistingSession();
    
    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    console.log("login called with:", email);
    setLoading(true);
    
    try {
      const result = await authLogin(email, password);
      console.log("Login result:", result);
      
      if (result.error) {
        setIsAuthenticated(false);
      } else if (result.data?.user) {
        console.log("Login successful, setting authenticated state");
        setIsAuthenticated(true);
      }
      
      setLoading(false);
      return result;
    } catch (err) {
      console.error("Error during login:", err);
      setIsAuthenticated(false);
      setLoading(false);
      return { data: null, error: err };
    }
  };
  
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return false;
    
    const success = await updateUserProfile(user.id, updates);
    
    if (success) {
      setUser(prev => prev ? { ...prev, ...updates } : null);
    }
    
    return success;
  };

  const addPaymentMethodWrapper = async (method: any): Promise<void> => {
    if (!user) return;
    await addUserPaymentMethod(user.id, user.payment_methods || [], method);
    // Update the user state with the new payment method
    setUser(prev => prev ? {
      ...prev,
      payment_methods: [...(prev.payment_methods || []), method]
    } : null);
  };

  const removePaymentMethodWrapper = async (id: string): Promise<void> => {
    if (!user || !user.payment_methods) return;
    await removeUserPaymentMethod(user.id, user.payment_methods, id);
    // Update the user state by filtering out the removed payment method
    setUser(prev => prev ? {
      ...prev,
      payment_methods: prev.payment_methods?.filter(method => method.id !== id) || []
    } : null);
  };

  const userHasRole = (role: string): boolean => {
    return hasRole(user?.roles, role);
  };
  
  // Create void-returning wrapper functions for login/logout
  const signIn = async (email: string, password: string) => {
    try {
      const result = await login(email, password);
      return { error: result.error };
    } catch (err: any) {
      return { error: err };
    }
  };
  
  const signUp = async (email: string, username: string, password: string, role: UserRole = 'user') => {
    try {
      const result = await register(email, username, password, role);
      return { error: result.error };
    } catch (err: any) {
      return { error: err };
    }
  };
  
  const signOut = async (): Promise<void> => {
    await logout();
  };
  
  // Correctly typed logout function
  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      await authLogout();
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      setLoading(false);
    } catch (err) {
      console.error("Error during logout:", err);
      setLoading(false);
    }
  };
  
  const value: AuthContextType = {
    user,
    session,
    isAuthenticated,
    isLoading,
    signIn: async (email, password) => {
      try {
        const result = await login(email, password);
        return { error: result.error };
      } catch (err: any) {
        return { error: err };
      }
    },
    signUp: async (email, username, password, role = 'user') => {
      try {
        const result = await register(email, username, password, role);
        return { error: result.error };
      } catch (err: any) {
        return { error: err };
      }
    },
    signOut: async () => {
      await logout();
    },
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    addPaymentMethod: addPaymentMethodWrapper,
    removePaymentMethod: removePaymentMethodWrapper,
    requiresAuth: () => {},
    isAdmin: () => isAdmin(user?.roles),
    hasRole: (role) => hasRole(user?.roles, role)
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
