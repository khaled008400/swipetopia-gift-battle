
import React, { useEffect } from 'react';
import { UserProfile } from '@/types/auth.types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProfileHeaderProps {
  profile: UserProfile | null;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  useEffect(() => {
    console.log('ProfileHeader mounted with profile:', profile);
    
    return () => {
      console.log('ProfileHeader unmounted');
    };
  }, [profile]);

  if (!profile) {
    console.log('ProfileHeader: No profile, showing loading state');
    return (
      <div className="h-40 bg-app-gray-dark rounded-lg animate-pulse mb-4">
        <div className="p-6 flex items-center justify-center h-full">
          <div className="w-8 h-8 border-2 border-app-yellow border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const initials = profile.username 
    ? profile.username.charAt(0).toUpperCase() 
    : profile.email 
      ? profile.email.charAt(0).toUpperCase()
      : '?';

  console.log('ProfileHeader: Rendering with initials:', initials, 'and avatar URL:', profile.avatar_url);

  return (
    <div className="bg-app-gray-dark rounded-lg p-6 shadow-md mb-4">
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
        <Avatar className="h-24 w-24 border-2 border-app-yellow">
          <AvatarImage 
            src={profile.avatar_url || ''} 
            alt={profile.username || 'User'} 
            onError={() => console.log('Avatar image failed to load for', profile.username || profile.email)}
          />
          <AvatarFallback className="text-2xl bg-app-gray-light text-app-yellow">{initials}</AvatarFallback>
        </Avatar>
        
        <div className="text-center md:text-left flex-1">
          <h1 className="text-2xl font-bold text-white">{profile.username || 'User'}</h1>
          {profile.email && <p className="text-gray-400">{profile.email}</p>}
          
          <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
            {profile.roles?.map((role, index) => (
              <span 
                key={index} 
                className="px-2 py-1 bg-app-gray-light rounded-full text-xs capitalize"
              >
                {role}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex space-x-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{profile.followers || 0}</p>
            <p className="text-sm text-gray-400">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{profile.following || 0}</p>
            <p className="text-sm text-gray-400">Following</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
