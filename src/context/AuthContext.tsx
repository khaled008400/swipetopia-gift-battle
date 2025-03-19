
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, AuthContextType } from '@/types/auth.types';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useProfileManagement } from '@/hooks/useProfileManagement';
import { useAuthMethods } from '@/hooks/useAuthMethods';
import { hasRole, isAdmin } from '@/utils/roleUtils';

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
  const { toast } = useToast();
  
  // Use our custom hooks
  const { 
    fetchUserProfile, 
    updateProfile: updateUserProfile,
    addPaymentMethod: addUserPaymentMethod,
    removePaymentMethod: removeUserPaymentMethod
  } = useProfileManagement();
  
  const { 
    login, 
    register, 
    logout,
    isLoading 
  } = useAuthMethods();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.id);
        setSession(currentSession);
        
        if (currentSession?.user) {
          const profile = await fetchUserProfile(currentSession.user.id);
          if (profile) {
            setUser(profile);
            setIsAuthenticated(true);
          }
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
          const profile = await fetchUserProfile(currentSession.user.id);
          if (profile) {
            setUser(profile);
            setIsAuthenticated(true);
          }
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

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return false;
    
    const success = await updateUserProfile(user.id, updates);
    
    if (success) {
      setUser(prev => prev ? { ...prev, ...updates } : null);
    }
    
    return success;
  };

  const addPaymentMethod = async (method: any) => {
    if (!user) return false;
    
    const success = await addUserPaymentMethod(user.id, user.payment_methods, method);
    
    if (success) {
      setUser(prev => prev ? {
        ...prev,
        payment_methods: [...prev.payment_methods, method]
      } : null);
    }
    
    return success;
  };

  const removePaymentMethod = async (id: string) => {
    if (!user) return false;
    
    const success = await removeUserPaymentMethod(user.id, user.payment_methods, id);
    
    if (success) {
      setUser(prev => prev ? {
        ...prev,
        payment_methods: prev.payment_methods.filter(method => method.id !== id)
      } : null);
    }
    
    return success;
  };

  const userHasRole = (role: string): boolean => {
    return hasRole(user?.roles, role);
  };
  
  // Wrap the logout function to maintain the Promise<void> return type
  const handleSignOut = async () => {
    await logout();
  };

  const value: AuthContextType = {
    user,
    session,
    isAuthenticated,
    isLoading,
    signIn: login,
    signUp: register,
    signOut: handleSignOut,
    loading,
    error,
    login,
    register,
    logout: handleSignOut,
    updateProfile,
    addPaymentMethod,
    removePaymentMethod,
    requiresAuth: () => {},
    isAdmin: () => isAdmin(user?.roles),
    hasRole: userHasRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
