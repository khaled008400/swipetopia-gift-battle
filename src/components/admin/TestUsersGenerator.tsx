
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

const TestUsersGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const createTestUser = async (email: string, password: string, username: string, roles: string[]) => {
    try {
      // Check if user already exists by email
      const { data: existingUsers, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();
        
      if (checkError) {
        console.error(`Error checking for existing user ${email}:`, checkError);
        return null;
      }
      
      if (existingUsers) {
        console.log(`User with email ${email} already exists, skipping creation`);
        return existingUsers.id;
      }
    
      // Create the user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            roles
          }
        }
      });
      
      if (error) {
        console.error(`Failed to create ${username} user:`, error);
        return null;
      }
      
      console.log(`Created ${username} user:`, data.user?.id);
      
      if (data.user) {
        // Create profile for the new user
        const { error: profileError } = await supabase.from('profiles').insert({
          id: data.user.id,
          username,
          email,
          roles,
          role: roles[0],
          avatar_url: `https://i.pravatar.cc/150?u=${username}`,
          coins: 1000,
          followers: 0,
          following: 0
        });
        
        if (profileError) {
          console.error(`Failed to create profile for ${username}:`, profileError);
        }
        
        return data.user.id;
      }
      
      return null;
    } catch (err) {
      console.error(`Error creating user ${username}:`, err);
      return null;
    }
  };

  const generateTestUsers = async () => {
    setIsGenerating(true);
    try {
      // Temporarily sign out current user to avoid conflicts
      await supabase.auth.signOut();
      
      const users = [
        { email: 'admin@example.com', password: 'adminpassword', username: 'admin', roles: ['admin'] },
        { email: 'seller@example.com', password: 'sellerpassword', username: 'seller', roles: ['seller'] },
        { email: 'streamer@example.com', password: 'streamerpassword', username: 'streamer', roles: ['streamer'] }
      ];
      
      const results = await Promise.all(
        users.map(user => createTestUser(user.email, user.password, user.username, user.roles))
      );
      
      console.log("Test users generation results:", results);
      
      if (results.some(id => id !== null)) {
        toast({
          title: "Test Users Generated",
          description: "Test accounts created successfully.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Generation Failed",
          description: "Failed to create test users. See console for details.",
        });
      }
      
      return results.filter(id => id !== null);
    } catch (error) {
      console.error('Error generating test users:', error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Failed to create test users. See console for details.",
      });
      return [];
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-medium mb-2">Test Users Generator</h3>
      <p className="text-sm text-gray-500 mb-4">
        Create test accounts with different roles for development purposes.
      </p>
      <Button 
        onClick={generateTestUsers} 
        disabled={isGenerating}
        className="w-full"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating users...
          </>
        ) : (
          "Generate Test Users"
        )}
      </Button>
      <div className="mt-3 text-xs text-gray-500">
        <p>This will create the following accounts:</p>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>admin@example.com (Admin role)</li>
          <li>seller@example.com (Seller role)</li>
          <li>streamer@example.com (Streamer role)</li>
        </ul>
        <p className="mt-2">All passwords are set to "[role]password"</p>
      </div>
    </div>
  );
};

export default TestUsersGenerator;
