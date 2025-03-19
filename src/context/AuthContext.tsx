
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
    console.log("Setting up auth state listener in AuthProvider");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.id);
        setSession(currentSession);
        
        if (currentSession?.user) {
          try {
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
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        setLoading(true);
        console.log("Checking for existing session...");
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession?.user) {
          console.log("Found existing session for user:", currentSession.user.id);
          setSession(currentSession);
          
          try {
            const profile = await fetchUserProfile(currentSession.user.id);
            if (profile) {
              console.log("Profile loaded from existing session:", profile.username);
              setUser(profile);
              setIsAuthenticated(true);
            } else {
              console.log("No profile found for existing session user");
            }
          } catch (err) {
            console.error("Error loading profile from existing session:", err);
          }
        } else {
          console.log("No existing session found");
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
      console.log("Cleaning up auth subscription");
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
    setUser(null);
    setSession(null);
    setIsAuthenticated(false);
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
