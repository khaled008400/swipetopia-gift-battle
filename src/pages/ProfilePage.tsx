
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileContent from '@/components/profile/ProfileContent';
import ProfileEdit from '@/components/profile/ProfileEdit';
import { Button } from '@/components/ui/button';
import { Edit, LogOut } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  
  // If userId is provided in URL, show that profile, else show current user's profile
  const profileId = userId || user?.id || null;
  const { profile, isLoading, refreshProfile } = useUserProfile(profileId);
  
  const isCurrentUserProfile = !!user && user.id === profileId;

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleEditComplete = () => {
    setIsEditing(false);
    refreshProfile();
  };

  useEffect(() => {
    // Refresh profile when the component mounts or profileId changes
    refreshProfile();
  }, [profileId, refreshProfile]);

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-6"></div>
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!profile && !isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4 text-center">
        <h2 className="text-xl font-medium mb-2">Profile Not Found</h2>
        <p className="text-gray-500">The user profile you're looking for doesn't exist or is not available.</p>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      {profile && <ProfileHeader profile={profile} />}
      
      <div className="flex justify-end mb-4">
        {isCurrentUserProfile && !isEditing && (
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
        )}
      </div>

      {isEditing && profile ? (
        <ProfileEdit
          onComplete={handleEditComplete}
        />
      ) : (
        profile && <ProfileContent profile={profile} />
      )}
    </div>
  );
};

export default ProfilePage;
