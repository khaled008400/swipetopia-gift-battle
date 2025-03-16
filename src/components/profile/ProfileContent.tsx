
import React, { useState } from 'react';
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

interface ProfileContentProps {
  profile: UserProfile | null;
}

const ProfileContent: React.FC<ProfileContentProps> = ({ profile }) => {
  const [activeTab, setActiveTab] = useState('about');
  const navigate = useNavigate();
  
  const { videos: userVideos, isLoading: videosLoading } = useUserVideos(profile?.id || '');
  const { videos: likedVideos, isLoading: likedLoading } = useLikedVideos(profile?.id || '');
  const { videos: savedVideos, isLoading: savedLoading } = useSavedVideos(profile?.id || '');

  if (!profile) {
    return <div className="text-center py-8">Profile not found</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="about" onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto mb-4">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="videos">
            <Film className="h-4 w-4 mr-2" />
            Videos
          </TabsTrigger>
          <TabsTrigger value="liked">
            <Heart className="h-4 w-4 mr-2" />
            Liked
          </TabsTrigger>
          <TabsTrigger value="saved">
            <Bookmark className="h-4 w-4 mr-2" />
            Saved
          </TabsTrigger>
          <TabsTrigger value="activity">
            <Activity className="h-4 w-4 mr-2" />
            Activity
          </TabsTrigger>
        </TabsList>

        {/* About Tab Content */}
        <TabsContent value="about" className="space-y-6">
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
        </TabsContent>

        {/* Videos Tab Content */}
        <TabsContent value="videos">
          <UserVideosGrid 
            videos={userVideos}
            isLoading={videosLoading}
            emptyMessage="No videos uploaded yet"
            onVideoClick={(videoId) => navigate(`/video/${videoId}`)}
          />
        </TabsContent>

        {/* Liked Videos Tab Content */}
        <TabsContent value="liked">
          <UserVideosGrid 
            videos={likedVideos}
            isLoading={likedLoading}
            emptyMessage="No liked videos yet"
            onVideoClick={(videoId) => navigate(`/video/${videoId}`)}
          />
        </TabsContent>

        {/* Saved Videos Tab Content */}
        <TabsContent value="saved">
          <UserVideosGrid 
            videos={savedVideos}
            isLoading={savedLoading}
            emptyMessage="No saved videos yet"
            onVideoClick={(videoId) => navigate(`/video/${videoId}`)}
          />
        </TabsContent>
        
        {/* Activity Tab Content */}
        <TabsContent value="activity">
          <UserActivity userId={profile.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Video Grid Component for displaying videos in tabs
interface UserVideosGridProps {
  videos: Video[];
  isLoading: boolean;
  emptyMessage: string;
  onVideoClick: (videoId: string) => void;
}

const UserVideosGrid: React.FC<UserVideosGridProps> = ({ videos, isLoading, emptyMessage, onVideoClick }) => {
  if (isLoading) {
    return <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="aspect-video bg-gray-200 animate-pulse rounded-md" />
      ))}
    </div>;
  }

  if (videos.length === 0) {
    return <div className="text-center py-12 text-gray-500">{emptyMessage}</div>;
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

// Video Thumbnail Component
interface VideoThumbnailProps {
  video: Video;
  onClick: () => void;
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({ video, onClick }) => {
  return (
    <div 
      className="group relative aspect-video overflow-hidden rounded-md bg-gray-100 cursor-pointer"
      onClick={onClick}
    >
      <img 
        src={video.thumbnail_url || '/placeholder.svg'}
        alt={video.title}
        className="h-full w-full object-cover transition-transform group-hover:scale-105"
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
