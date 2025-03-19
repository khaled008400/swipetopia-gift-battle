
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileContent from '@/components/profile/ProfileContent';
import ProfileEdit from '@/components/profile/ProfileEdit';
import { Button } from '@/components/ui/button';
import { Edit, LogOut, RefreshCcw } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const { toast } = useToast();
  
  // If userId is provided in URL, show that profile, else show current user's profile
  const profileId = userId || user?.id || '';
  const { profile, isLoading, refreshProfile, error, updateProfile } = useUserProfile(profileId);
  
  const isCurrentUserProfile = !!user && user.id === profileId;

  // Debug logging
  useEffect(() => {
    console.log('ProfilePage mounted:', { 
      profileId, 
      hasUser: !!user,
      userId: user?.id,
      hasProfile: !!profile,
      isLoading 
    });
    
    return () => {
      console.log('ProfilePage unmounted');
    };
  }, [profileId, user, profile, isLoading]);

  // If we have an error, show toast
  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error loading profile",
        description: error
      });
    }
  }, [error, toast]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleEditComplete = () => {
    console.log('Edit completed, refreshing profile');
    setIsEditing(false);
    refreshProfile();
  };

  const handleRefresh = () => {
    console.log('Manual refresh triggered');
    refreshProfile();
  };

  useEffect(() => {
    // Refresh profile when the component mounts or profileId changes
    if (profileId) {
      console.log('ProfilePage useEffect: Refreshing profile for ID:', profileId);
      refreshProfile();
    }
  }, [profileId, refreshProfile]);

  if (isLoading) {
    console.log('ProfilePage: Showing loading skeleton');
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Skeleton className="h-48 w-full rounded-lg mb-6" />
        <Skeleton className="h-8 w-1/4 rounded mb-4" />
        <Skeleton className="h-64 w-full rounded" />
      </div>
    );
  }

  if (!profile && !isLoading) {
    console.log('ProfilePage: Profile not found');
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4 text-center">
        <h2 className="text-xl font-medium mb-2">Profile Not Found</h2>
        <p className="text-gray-500 mb-4">The user profile you're looking for doesn't exist or is not available.</p>
        
        <div className="flex justify-center gap-2">
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCcw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          
          {user && (
            <Button onClick={() => navigate(`/profile`)}>
              Go to Your Profile
            </Button>
          )}
          
          {!user && (
            <Button onClick={() => navigate('/login')}>
              Sign In
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 space-y-6">
      {profile && (
        <>
          <ProfileHeader profile={profile} />
          {console.log('ProfilePage: Rendering ProfileHeader')}
        </>
      )}
      
      {isCurrentUserProfile && !isEditing && (
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCcw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          
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
        <>
          {console.log('ProfilePage: Rendering ProfileEdit')}
          <ProfileEdit onComplete={handleEditComplete} profile={profile} />
        </>
      ) : (
        profile && (
          <>
            {console.log('ProfilePage: Rendering ProfileContent')}
            <ProfileContent profile={profile} isOwnProfile={isCurrentUserProfile} />
          </>
        )
      )}
    </div>
  );
};

export default ProfilePage;
