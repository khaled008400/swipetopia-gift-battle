
import React, { useState, useEffect } from 'react';
import { UserProfile } from '@/types/auth.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MapPin, Calendar, AtSign, Tag, Film, Heart, Bookmark, Activity, MessageCircle } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useUserVideos } from '@/hooks/useUserVideos';
import { useLikedVideos } from '@/hooks/useLikedVideos';
import { useSavedVideos } from '@/hooks/useSavedVideos';
import UserActivity from './UserActivity';
import { Video } from '@/types/video.types';
import { useNavigate } from 'react-router-dom';

let renderCount = 0;

interface ProfileContentProps {
  profile: UserProfile | null;
}

const ProfileContent: React.FC<ProfileContentProps> = ({ profile }) => {
  renderCount++;
  console.log(`ProfileContent render #${renderCount} with profile:`, profile?.username || 'null');
  
  const [activeTab, setActiveTab] = useState('about');
  const navigate = useNavigate();
  
  const { videos: userVideos, isLoading: videosLoading } = useUserVideos(profile?.id || '');
  const { videos: likedVideos, isLoading: likedLoading } = useLikedVideos(profile?.id || '');
  const { videos: savedVideos, isLoading: savedLoading } = useSavedVideos(profile?.id || '');

  useEffect(() => {
    console.log('ProfileContent: Active tab changed to', activeTab);
  }, [activeTab]);

  useEffect(() => {
    console.log('ProfileContent: User videos loaded:', userVideos.length);
  }, [userVideos]);

  useEffect(() => {
    console.log('ProfileContent: Liked videos loaded:', likedVideos.length);
  }, [likedVideos]);

  useEffect(() => {
    console.log('ProfileContent: Saved videos loaded:', savedVideos.length);
  }, [savedVideos]);

  if (!profile) {
    console.log('ProfileContent: No profile provided');
    return <div className="text-center py-8">Profile not found</div>;
  }

  // Log when rendering the About tab content
  const logAboutTabRender = () => {
    console.log('Rendering About tab content');
    return null;
  };

  // Log when rendering the Videos tab content
  const logVideosTabRender = () => {
    console.log('Rendering Videos tab content');
    return null;
  };

  // Log when rendering the Liked tab content
  const logLikedTabRender = () => {
    console.log('Rendering Liked tab content');
    return null;
  };

  // Log when rendering the Saved tab content
  const logSavedTabRender = () => {
    console.log('Rendering Saved tab content');
    return null;
  };

  // Log when rendering the Activity tab content
  const logActivityTabRender = () => {
    console.log('Rendering Activity tab content');
    return null;
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="about" onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full bg-app-gray-dark overflow-x-auto mb-4 p-1 rounded-lg">
          <TabsTrigger value="about" className="rounded-md data-[state=active]:bg-app-yellow data-[state=active]:text-app-black">About</TabsTrigger>
          <TabsTrigger value="videos" className="rounded-md data-[state=active]:bg-app-yellow data-[state=active]:text-app-black">
            <Film className="h-4 w-4 mr-2" />
            Videos
          </TabsTrigger>
          <TabsTrigger value="liked" className="rounded-md data-[state=active]:bg-app-yellow data-[state=active]:text-app-black">
            <Heart className="h-4 w-4 mr-2" />
            Liked
          </TabsTrigger>
          <TabsTrigger value="saved" className="rounded-md data-[state=active]:bg-app-yellow data-[state=active]:text-app-black">
            <Bookmark className="h-4 w-4 mr-2" />
            Saved
          </TabsTrigger>
          <TabsTrigger value="activity" className="rounded-md data-[state=active]:bg-app-yellow data-[state=active]:text-app-black">
            <Activity className="h-4 w-4 mr-2" />
            Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="space-y-6">
          {logAboutTabRender()}
          <Card className="bg-app-gray-dark border-0">
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base">
                {profile.bio || "No bio information provided."}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-app-gray-dark border-0">
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.location && (
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-app-yellow" />
                  <span>{profile.location}</span>
                </div>
              )}
              
              {profile.email && (
                <div className="flex items-center">
                  <AtSign className="h-5 w-5 mr-2 text-app-yellow" />
                  <span>{profile.email}</span>
                </div>
              )}

              {profile.roles && profile.roles.length > 0 && (
                <div className="flex items-start">
                  <Tag className="h-5 w-5 mr-2 text-app-yellow mt-0.5" />
                  <div className="flex flex-wrap gap-2">
                    {profile.roles.map((role, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-1 bg-app-gray-light rounded-md text-sm"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {profile.interests && profile.interests.length > 0 && (
            <Card className="bg-app-gray-dark border-0">
              <CardHeader>
                <CardTitle>Interests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 bg-app-gray-light text-app-yellow rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {profile.roles?.includes('streamer') && (
            <Card className="bg-app-gray-dark border-0">
              <CardHeader>
                <CardTitle>Streaming Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.shop_name && (
                  <div>
                    <h3 className="font-medium text-app-yellow">Shop Name</h3>
                    <p>{profile.shop_name}</p>
                  </div>
                )}
                
                <div>
                  <h3 className="font-medium text-app-yellow">Followers</h3>
                  <p>{profile.followers?.toLocaleString() || 0}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-app-yellow">Following</h3>
                  <p>{profile.following?.toLocaleString() || 0}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="videos">
          {logVideosTabRender()}
          <UserVideosGrid 
            videos={userVideos}
            isLoading={videosLoading}
            emptyMessage="No videos uploaded yet"
            onVideoClick={(videoId) => {
              console.log('Video clicked:', videoId);
              navigate(`/video/${videoId}`);
            }}
          />
        </TabsContent>

        <TabsContent value="liked">
          {logLikedTabRender()}
          <UserVideosGrid 
            videos={likedVideos}
            isLoading={likedLoading}
            emptyMessage="No liked videos yet"
            onVideoClick={(videoId) => navigate(`/video/${videoId}`)}
          />
        </TabsContent>

        <TabsContent value="saved">
          {logSavedTabRender()}
          <UserVideosGrid 
            videos={savedVideos}
            isLoading={savedLoading}
            emptyMessage="No saved videos yet"
            onVideoClick={(videoId) => navigate(`/video/${videoId}`)}
          />
        </TabsContent>
        
        <TabsContent value="activity">
          {logActivityTabRender()}
          <UserActivity userId={profile.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface UserVideosGridProps {
  videos: Video[];
  isLoading: boolean;
  emptyMessage: string;
  onVideoClick: (videoId: string) => void;
}

const UserVideosGrid: React.FC<UserVideosGridProps> = ({ videos, isLoading, emptyMessage, onVideoClick }) => {
  console.log('UserVideosGrid render:', { isLoading, videoCount: videos.length });
  
  if (isLoading) {
    return <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="aspect-video bg-app-gray-light animate-pulse rounded-md" />
      ))}
    </div>;
  }

  if (videos.length === 0) {
    return <div className="text-center py-12 text-gray-400">{emptyMessage}</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {videos.map((video, index) => (
        <VideoThumbnail 
          key={`${video.id}-${index}`} 
          video={video} 
          onClick={() => onVideoClick(video.id)}
        />
      ))}
    </div>
  );
};

interface VideoThumbnailProps {
  video: Video;
  onClick: () => void;
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({ video, onClick }) => {
  const handleImageError = () => {
    console.log('Video thumbnail failed to load:', video.id, video.thumbnail_url);
  };

  return (
    <div 
      className="group relative aspect-video overflow-hidden rounded-md bg-app-gray-light cursor-pointer"
      onClick={() => {
        console.log('Thumbnail clicked:', video.id);
        onClick();
      }}
    >
      <img 
        src={video.thumbnail_url || '/placeholder.svg'}
        alt={video.title}
        className="h-full w-full object-cover transition-transform group-hover:scale-105"
        onError={handleImageError}
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
        <h3 className="text-sm font-medium text-white truncate">{video.title}</h3>
        <div className="flex items-center text-xs text-gray-300 mt-1">
          <span>{video.view_count || 0} views</span>
          <span className="mx-1">•</span>
          <span>{new Date(video.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileContent;
