
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import VideoService from '@/services/video.service';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThumbsUp, MessageSquare, Share2, Bookmark, Flag, ArrowLeft } from 'lucide-react';
import VideoPlayerAdapter from '@/components/VideoPlayerAdapter';
import VideoComments from '@/components/video/VideoComments';

const WatchPage: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  
  const { data: video, isLoading, error } = useQuery({
    queryKey: ['video', videoId],
    queryFn: () => VideoService.getVideoById(videoId || ''),
    enabled: !!videoId,
  });
  
  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse">
          <div className="aspect-video bg-gray-200 rounded-lg"></div>
          <div className="mt-4 h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="mt-4 flex">
            <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
            <div className="ml-3">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="mt-1 h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !video) {
    return (
      <div className="container mx-auto p-4 text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Video Not Found</h2>
        <p className="mb-8">The video you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => window.history.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }
  
  // Use default values for potentially missing properties
  const likesCount = 0; // We'll default to 0 since 'likes' property doesn't exist yet
  const commentsCount = 0; // We'll default to 0 since 'comments_count' property doesn't exist yet
  const username = video.profiles?.username || 'Anonymous';
  const avatarUrl = video.profiles?.avatar_url || '';
  const viewCount = video.view_count || 0;
  
  return (
    <div className="container mx-auto p-4">
      <Button variant="ghost" onClick={() => window.history.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="rounded-lg overflow-hidden">
            <VideoPlayerAdapter 
              videoId={video.id}
              src={video.video_url || ''} 
              poster={video.thumbnail_url || ''} 
              autoPlay={true}
            />
          </div>
          
          <div className="mt-4">
            <h1 className="text-2xl font-bold">{video.title || 'Untitled Video'}</h1>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="font-medium">{username}</p>
                  <p className="text-sm text-gray-500">{viewCount} views</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  {likesCount}
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Bookmark className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Flag className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <Card className="mt-6 p-4">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <h3>Description</h3>
              <p>{video.description || 'No description provided.'}</p>
            </div>
          </Card>
          
          <Separator className="my-8" />
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Comments ({commentsCount})</h2>
              <Button variant="outline" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                Add Comment
              </Button>
            </div>
            
            <VideoComments videoId={video.id} isOpen={true} onClose={() => {}} />
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Recommended Videos</h2>
          <div className="space-y-4">
            <p className="text-gray-500 text-center p-4">
              Related videos will appear here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;
