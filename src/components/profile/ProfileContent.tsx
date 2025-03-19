
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileVideo, Share2, ShoppingBag, Ticket, Heart, Clock, Award, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useFollower } from "@/hooks/useFollower";
import { useUserVideos } from "@/hooks/useUserVideos";
import VideoCard from "@/components/cards/VideoCard"; // Fixed import
import { Skeleton } from "@/components/ui/skeleton";
import { UserProfile } from '@/types/auth.types';
import { useAuth } from '@/context/AuthContext';
import { useFollowerRealtime } from '@/hooks/useFollowerRealtime';
import ProfileStats from './ProfileStats';
import NotificationPreferences from './NotificationPreferences';
import PaymentMethods from './PaymentMethods';
import StreamerFields from './StreamerFields';
import UserActivity from './UserActivity';
import WalletSection from './WalletSection';
import RolesDisplay from './RolesDisplay';

type ProfileContentProps = {
  profile: UserProfile;
  isOwnProfile: boolean;
};

const ProfileContent = ({ profile, isOwnProfile }: ProfileContentProps) => {
  const [activeTab, setActiveTab] = useState("videos");
  const { user, hasRole } = useAuth();
  
  const { isFollowing, toggleFollow, loading: followLoading, followerCount } = useFollower(profile.id);
  const { videos, isLoading: videosLoading } = useUserVideos(profile.id);
  const { followerCount: realtimeFollowerCount, recentFollowers } = useFollowerRealtime(profile.id);
  
  const userIsSeller = profile.roles?.includes('seller');
  
  const handleFollow = async () => {
    await toggleFollow();
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto pt-8 px-4">
      <Card className="border-none shadow-sm mb-8 bg-transparent">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Avatar and Stats Section */}
            <div className="flex flex-col items-center">
              <Avatar className="w-24 h-24 md:w-32 md:h-32 border-2 border-app-yellow">
                <AvatarImage src={profile.avatar_url || 'https://i.pravatar.cc/150?u=' + profile.username} />
                <AvatarFallback>{profile.username?.charAt(0)?.toUpperCase()}</AvatarFallback>
              </Avatar>
              
              <div className="mt-3 text-center">
                <h2 className="text-xl font-bold">{profile.username}</h2>
                
                <RolesDisplay roles={profile.roles || ['user']} />
                
                {profile.bio && (
                  <p className="text-sm text-gray-400 mt-2">{profile.bio}</p>
                )}
                
                {!isOwnProfile && (
                  <Button 
                    onClick={handleFollow} 
                    className="mt-4" 
                    variant={isFollowing ? "outline" : "default"}
                    disabled={followLoading}
                  >
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </Button>
                )}
              </div>
              
              <div className="flex space-x-6 mt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{followerCount || 0}</p>
                  <p className="text-sm text-gray-400">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{profile.following || 0}</p>
                  <p className="text-sm text-gray-400">Following</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{videos?.length || 0}</p>
                  <p className="text-sm text-gray-400">Videos</p>
                </div>
              </div>
              
              {/* Show Wallet for own profile */}
              {isOwnProfile && (
                <div className="mt-6 w-full">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Wallet Balance</h3>
                    <p className="text-2xl font-bold">{profile.coins || 0} coins</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Recent Followers */}
            <div className="flex-1">
              <h3 className="text-lg font-medium mb-4">Recent Followers</h3>
              {recentFollowers.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {recentFollowers.map((follower) => (
                    <Card key={follower.follower_id} className="bg-gray-800">
                      <CardContent className="p-3 flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={follower.profiles?.avatar_url || 'https://i.pravatar.cc/150?u=' + follower.profiles?.username} />
                          <AvatarFallback>{follower.profiles?.username?.charAt(0)?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{follower.profiles?.username}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(follower.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No followers yet</p>
              )}
              
              {/* Only show Activity for own profile */}
              {isOwnProfile && (
                <div className="mt-6">
                  <UserActivity userId={profile.id} />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Profile Tabs */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mt-8">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="videos">
            <FileVideo className="w-4 h-4 mr-2" /> Videos
          </TabsTrigger>
          <TabsTrigger value="liked">
            <Heart className="w-4 h-4 mr-2" /> Liked
          </TabsTrigger>
          
          {isOwnProfile && (
            <TabsTrigger value="settings">
              <Clock className="w-4 h-4 mr-2" /> Settings
            </TabsTrigger>
          )}
          
          {userIsSeller && (
            <TabsTrigger value="shop">
              <ShoppingBag className="w-4 h-4 mr-2" /> Shop
            </TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="videos" className="mt-0">
          {videosLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-md bg-gray-800" />
              ))}
            </div>
          ) : videos && videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileVideo className="w-12 h-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-xl font-medium">No Videos Yet</h3>
              <p className="mt-2 text-gray-500">Videos uploaded will appear here</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="liked" className="mt-0">
          <div className="text-center py-12">
            <Heart className="w-12 h-12 mx-auto text-gray-400" />
            <h3 className="mt-4 text-xl font-medium">Liked Videos</h3>
            <p className="mt-2 text-gray-500">Videos liked by this user will appear here</p>
          </div>
        </TabsContent>
        
        {isOwnProfile && (
          <TabsContent value="settings" className="mt-0">
            <div className="space-y-8">
              {/* Notification Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Battle notifications</span>
                      <input type="checkbox" defaultChecked={profile.notification_preferences?.battles} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Order notifications</span>
                      <input type="checkbox" defaultChecked={profile.notification_preferences?.orders} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Message notifications</span>
                      <input type="checkbox" defaultChecked={profile.notification_preferences?.messages} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Follower notifications</span>
                      <input type="checkbox" defaultChecked={profile.notification_preferences?.followers} />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Payment Methods Management */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  {profile.payment_methods && profile.payment_methods.length > 0 ? (
                    <div className="space-y-4">
                      {profile.payment_methods.map((method) => (
                        <div key={method.id} className="flex items-center justify-between">
                          <span>{method.name || method.type}</span>
                          <Button variant="destructive" size="sm">Remove</Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No payment methods added yet</p>
                  )}
                  <Button className="mt-4">Add Payment Method</Button>
                </CardContent>
              </Card>
              
              {/* Seller or Streamer Additional Fields */}
              {hasRole && hasRole('seller') && (
                <Card>
                  <CardHeader>
                    <CardTitle>Seller Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="mb-2 font-medium">Stream Key</h4>
                        <div className="flex">
                          <input
                            type="password"
                            value={profile.stream_key || ''}
                            readOnly
                            className="flex-1 bg-gray-700 p-2 rounded-l"
                          />
                          <Button className="rounded-l-none">Show</Button>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">This is your private streaming key. Do not share it.</p>
                      </div>
                      
                      <div>
                        <h4 className="mb-2 font-medium">Shop Name</h4>
                        <input
                          type="text"
                          value={profile.shop_name || ''}
                          className="w-full bg-gray-700 p-2 rounded"
                        />
                      </div>
                      
                      <Button>Update Settings</Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        )}
        
        {userIsSeller && (
          <TabsContent value="shop" className="mt-0">
            <div className="text-center py-12">
              <ShoppingBag className="w-12 h-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-xl font-medium">Shop</h3>
              <p className="mt-2 text-gray-500">Products from this seller will appear here</p>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default ProfileContent;
