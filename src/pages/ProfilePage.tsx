
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileContent from '@/components/profile/ProfileContent';
import ProfileEdit from '@/components/profile/ProfileEdit';
import { Button } from '@/components/ui/button';
import { Edit, LogOut } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  
  // If userId is provided in URL, show that profile, else show current user's profile
  const profileId = userId || user?.id || '';
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
    if (profileId) {
      refreshProfile();
    }
  }, [profileId, refreshProfile]);

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Skeleton className="h-48 w-full rounded-lg mb-6" />
        <Skeleton className="h-8 w-1/4 rounded mb-4" />
        <Skeleton className="h-64 w-full rounded" />
      </div>
    );
  }

  if (!profile && !isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4 text-center">
        <h2 className="text-xl font-medium mb-2">Profile Not Found</h2>
        <p className="text-gray-500">The user profile you're looking for doesn't exist or is not available.</p>
        {user && (
          <Button className="mt-4" onClick={() => navigate(`/profile/${user.id}`)}>
            Go to Your Profile
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 space-y-6">
      {profile && <ProfileHeader profile={profile} />}
      
      {isCurrentUserProfile && !isEditing && (
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
          <Button variant="destructive" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      )}

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
