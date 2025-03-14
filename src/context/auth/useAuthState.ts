
import { useState, useEffect } from "react";
import { AppUser } from "@/services/auth.service";
import { supabase } from "@/integrations/supabase/client";
import AuthService from "@/services/auth.service";

export function useAuthState() {
  const [user, setUser] = useState<AppUser | null>(null);
  
  console.log("useAuthState initialized");
  
  // Check if user is logged in on component mount and listen for auth changes
  useEffect(() => {
    console.log("Running auth effect");
    
    // Check for stored user first (for faster initial render)
    const storedUser = AuthService.getCurrentUser();
    if (storedUser) {
      console.log("Found stored user:", storedUser.username);
      setUser(storedUser);
    }
    
    const checkCurrentSession = async () => {
      try {
        console.log("Checking current session");
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Session data:", session ? "Session exists" : "No session");
        
        if (session) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
            
          console.log("Profile data from session check:", profileData);
            
          // If no profile exists, create one
          if (!profileData) {
            console.log("No profile found, creating one");
            const { data: newProfileData, error: createError } = await supabase
              .from('profiles')
              .upsert({
                id: session.user.id,
                username: session.user.email?.split('@')[0] || 'user',
                avatar_url: '/placeholder.svg',
                coins: 0
              })
              .select()
              .maybeSingle();
              
            if (createError) {
              console.error("Profile creation error:", createError);
            } else {
              console.log("Created profile:", newProfileData);
            }
          }
            
          // Update local user state
          const updatedUser: AppUser = {
            id: session.user.id,
            username: profileData?.username || session.user.email?.split('@')[0] || 'user',
            email: session.user.email || '',
            avatar: profileData?.avatar_url || '/placeholder.svg',
            coins: profileData?.coins || 0,
            // Set default values since these fields don't exist in the database yet
            followers: 0,
            following: 0
          };
          
          console.log("Setting user from session:", updatedUser.username);
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      } catch (error) {
        console.error("Session check error:", error);
      }
    };
    
    // Check the current session after checking for stored user
    checkCurrentSession();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session ? "Session exists" : "No session");
        if (event === 'SIGNED_IN' && session) {
          // Get the user profile when signed in
          try {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();
              
            // If no profile exists, create one
            if (!profileData) {
              console.log("No profile found during auth state change, creating one");
              const { data: newProfileData, error: createError } = await supabase
                .from('profiles')
                .upsert({
                  id: session.user.id,
                  username: session.user.email?.split('@')[0] || 'user',
                  avatar_url: '/placeholder.svg',
                  coins: 0
                })
                .select()
                .maybeSingle();
                
              if (createError) {
                console.error("Profile creation error:", createError);
              } else {
                console.log("Created profile:", newProfileData);
              }
            }
              
            // Update local user state
            const updatedUser: AppUser = {
              id: session.user.id,
              username: profileData?.username || session.user.email?.split('@')[0] || 'user',
              email: session.user.email || '',
              avatar: profileData?.avatar_url || '/placeholder.svg',
              coins: profileData?.coins || 0,
              // Set default values for followers and following since they don't exist in the database
              followers: 0,
              following: 0
            };
            
            console.log("Auth state change - setting user:", updatedUser.username);
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
          } catch (error) {
            console.error('Error fetching profile:', error);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log("User signed out, clearing state");
          setUser(null);
          localStorage.removeItem('user');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, setUser };
}
