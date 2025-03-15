import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileContent from '@/components/profile/ProfileContent';
import ProfileEdit from '@/components/profile/ProfileEdit';
import { Button } from '@/components/ui/button';
import { Edit, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { profile, loading } = useUserProfile(user?.id || null);
  
  // Remove the reference to session in the line below
  const isCurrentUserProfile = !!user && !!profile;

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <ProfileHeader profile={profile} />
      <div className="flex justify-end mb-4">
        {isCurrentUserProfile && !isEditing ? (
          <>
            <Button variant="outline" className="mr-2" onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
            <Button variant="destructive" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </>
        ) : null}
      </div>

      {isEditing && profile ? (
        <ProfileEdit
          onComplete={() => setIsEditing(false)}
        />
      ) : (
        <ProfileContent profile={profile} />
      )}
    </div>
  );
};

export default ProfilePage;
