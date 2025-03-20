
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserVideos } from '@/hooks/useUserVideos';
import { UserProfile } from '@/types/auth.types';
import { Card, CardContent } from '@/components/ui/card';
import VideoCard from '@/components/cards/VideoCard';
import { Loader2 } from 'lucide-react';

interface ProfileContentProps {
  profile: UserProfile;
  isOwnProfile?: boolean;
  activeTab?: string;
}

const ProfileContent: React.FC<ProfileContentProps> = ({ profile, isOwnProfile = false, activeTab = 'videos' }) => {
  const { videos, isLoading, error } = useUserVideos(profile.id);
  
  return (
    <Tabs defaultValue={activeTab} className="w-full mt-6">
      <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3">
        <TabsTrigger value="videos">Videos</TabsTrigger>
        <TabsTrigger value="saved">Saved</TabsTrigger>
        <TabsTrigger value="liked">Liked</TabsTrigger>
      </TabsList>
      
      <TabsContent value="videos" className="mt-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">{error}</p>
            </CardContent>
          </Card>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {videos.map(video => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No videos uploaded yet</p>
            </CardContent>
          </Card>
        )}
      </TabsContent>
      
      <TabsContent value="saved" className="mt-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Saved videos will appear here</p>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="liked" className="mt-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Liked videos will appear here</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ProfileContent;
