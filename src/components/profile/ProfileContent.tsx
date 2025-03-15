
import React from 'react';
import { UserProfile } from '@/types/auth.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MapPin, Calendar, AtSign, Tag } from 'lucide-react';

interface ProfileContentProps {
  profile: UserProfile | null;
}

const ProfileContent: React.FC<ProfileContentProps> = ({ profile }) => {
  if (!profile) {
    return <div className="text-center py-8">Profile not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Bio Section */}
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base">
            {profile.bio || "No bio information provided."}
          </p>
        </CardContent>
      </Card>

      {/* User Details */}
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile.location && (
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-gray-500" />
              <span>{profile.location}</span>
            </div>
          )}
          
          {profile.email && (
            <div className="flex items-center">
              <AtSign className="h-5 w-5 mr-2 text-gray-500" />
              <span>{profile.email}</span>
            </div>
          )}

          {profile.roles && profile.roles.length > 0 && (
            <div className="flex items-start">
              <Tag className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
              <div className="flex flex-wrap gap-2">
                {profile.roles.map((role, index) => (
                  <span 
                    key={index} 
                    className="px-2 py-1 bg-gray-100 rounded-md text-sm"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Interests Section (if available) */}
      {profile.interests && profile.interests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Interests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Streamer Information (if applicable) */}
      {profile.roles?.includes('streamer') && (
        <Card>
          <CardHeader>
            <CardTitle>Streaming Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.shop_name && (
              <div>
                <h3 className="font-medium text-gray-700">Shop Name</h3>
                <p>{profile.shop_name}</p>
              </div>
            )}
            
            <div>
              <h3 className="font-medium text-gray-700">Followers</h3>
              <p>{profile.followers?.toLocaleString() || 0}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700">Following</h3>
              <p>{profile.following?.toLocaleString() || 0}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfileContent;
