
import React from 'react';
import { LiveStream } from '@/types/livestream.types';
import { Link } from 'react-router-dom';
import { Zap, Eye, User, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

export interface LiveStreamCardProps {
  stream: LiveStream;
}

const LiveStreamCard: React.FC<LiveStreamCardProps> = ({ stream }) => {
  const username = stream.username || stream.user?.username || 'User';
  const avatar = stream.avatar_url || stream.user?.avatar_url || '';
  const viewerCount = stream.currentViewers || stream.viewer_count || 0;
  
  return (
    <Link to={`/stream/${stream.id}`} className="block">
      <div className="rounded-lg overflow-hidden bg-card border shadow-sm hover:shadow transition-all">
        <div className="relative">
          {/* Thumbnail */}
          <div className="aspect-video bg-muted relative overflow-hidden">
            {/* If there's a thumbnail, use it, otherwise use a gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-slate-900" />
            
            {/* Title overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-3 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-white font-medium truncate">{stream.title}</h3>
            </div>
            
            {/* Live indicator */}
            <div className="absolute top-2 left-2 flex items-center space-x-2">
              <Badge variant="destructive" className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                <span>LIVE</span>
              </Badge>
              <Badge variant="secondary" className="flex items-center">
                <Eye className="h-3 w-3 mr-1" />
                <span>{viewerCount >= 1000 ? `${(viewerCount / 1000).toFixed(1)}K` : viewerCount}</span>
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="p-3">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatar} alt={username} />
              <AvatarFallback>{username[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{username}</p>
              <div className="flex items-center text-muted-foreground text-xs">
                <Clock className="h-3 w-3 mr-1" />
                <span>
                  {stream.started_at 
                    ? `Started ${formatDistanceToNow(new Date(stream.started_at), { addSuffix: true })}` 
                    : 'Live now'}
                </span>
              </div>
            </div>
          </div>
          
          {stream.giftsReceived && stream.giftsReceived > 0 && (
            <div className="mt-2 text-xs text-muted-foreground">
              <span className="font-medium">{stream.giftsReceived}</span> gifts received
              {stream.topGiftName && <span> • Top: {stream.topGiftName}</span>}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default LiveStreamCard;
