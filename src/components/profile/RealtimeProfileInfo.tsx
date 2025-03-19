
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useProfileWithRealtime } from '@/hooks/useProfileWithRealtime';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

const RealtimeProfileInfo: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id || null;
  
  const { profile, isLoading, error, refreshProfile } = useProfileWithRealtime(userId);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded-md text-red-600">
        <p className="font-medium">Error loading profile</p>
        <p className="text-sm">{error}</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2"
          onClick={() => refreshProfile()}
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  if (!profile) {
    return <p>No profile data available</p>;
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Profile Info (Real-time)</h3>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => refreshProfile()}
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm">
        <span className="font-medium">Username:</span>
        <span>{profile.username}</span>
        
        <span className="font-medium">Email:</span>
        <span>{profile.email}</span>
        
        <span className="font-medium">Coins:</span>
        <span>{profile.coins}</span>
        
        <span className="font-medium">Followers:</span>
        <span>{profile.followers}</span>
        
        <span className="font-medium">Following:</span>
        <span>{profile.following}</span>
        
        <span className="font-medium">Roles:</span>
        <span>{profile.roles.join(', ')}</span>
        
        {profile.bio && (
          <>
            <span className="font-medium">Bio:</span>
            <span>{profile.bio}</span>
          </>
        )}
        
        {profile.location && (
          <>
            <span className="font-medium">Location:</span>
            <span>{profile.location}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default RealtimeProfileInfo;
