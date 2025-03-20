
import React from 'react';
import { Link } from 'react-router-dom';
import { Video } from '@/types/video.types';
import { Eye, MessageSquare, ThumbsUp } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

export interface VideoCardProps {
  video: Video;
  onClickVideo?: (video: Video) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onClickVideo }) => {
  console.log('VideoCard rendering with video:', video);
  
  // Make sure we have the user data in the expected format
  const username = video.profiles?.username || 
                  video.user?.username || 
                  'Unknown User';
                  
  const avatarUrl = video.profiles?.avatar_url || 
                   video.user?.avatar_url || 
                   '';
  
  console.log('Using username:', username, 'and avatar:', avatarUrl);

  const handleClick = () => {
    if (onClickVideo) {
      onClickVideo(video);
    }
  };

  return (
    <div 
      className="rounded-lg overflow-hidden bg-card border shadow-sm hover:shadow-md transition-all"
      onClick={handleClick}
    >
      <Link to={`/video/${video.id}`} className="block">
        <div className="relative">
          {/* Thumbnail */}
          <div className="aspect-video bg-muted">
            <img 
              src={video.thumbnail_url} 
              alt={video.title} 
              className="w-full h-full object-cover"
            />
            
            {/* Duration indicator */}
            {video.duration && (
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
              </div>
            )}
          </div>
        </div>
        
        <div className="p-3">
          <h3 className="font-medium text-sm line-clamp-2">{video.title}</h3>
          
          <div className="mt-2 flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={avatarUrl} alt={username} />
              <AvatarFallback>{username[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{username}</span>
          </div>
          
          <div className="mt-2 flex text-xs text-muted-foreground space-x-3">
            <div className="flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              <span>{video.view_count >= 1000 ? `${(video.view_count / 1000).toFixed(1)}K` : video.view_count}</span>
            </div>
            <div className="flex items-center">
              <ThumbsUp className="h-3 w-3 mr-1" />
              <span>{video.likes_count >= 1000 ? `${(video.likes_count / 1000).toFixed(1)}K` : video.likes_count}</span>
            </div>
            <div className="flex items-center">
              <MessageSquare className="h-3 w-3 mr-1" />
              <span>{video.comments_count >= 1000 ? `${(video.comments_count / 1000).toFixed(1)}K` : video.comments_count}</span>
            </div>
            <div>
              {video.created_at && formatDistanceToNow(new Date(video.created_at), { addSuffix: true })}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default VideoCard;
