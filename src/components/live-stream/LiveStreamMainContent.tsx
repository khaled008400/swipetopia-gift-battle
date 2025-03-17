
import React, { useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { LiveStreamGift, LiveStreamInfo } from '@/types/livestream.types';
import { motion, AnimatePresence } from 'framer-motion';

interface LiveStreamMainContentProps {
  streamInfo: LiveStreamInfo;
  viewers: number;
  recentGifts: LiveStreamGift[];
}

const LiveStreamMainContent: React.FC<LiveStreamMainContentProps> = ({
  streamInfo,
  viewers,
  recentGifts
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="relative flex-grow">
      <video
        ref={videoRef}
        src={streamInfo.streamUrl}
        className="w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      />
      
      {/* Overlay for host info */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 border-2 border-app-yellow">
            <AvatarImage src={streamInfo.host.avatarUrl} />
            <AvatarFallback>{streamInfo.host.displayName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-2">
            <div className="flex items-center">
              <h3 className="font-bold text-white">{streamInfo.host.displayName}</h3>
              {streamInfo.host.isVerified && (
                <span className="ml-1 text-app-yellow">✓</span>
              )}
            </div>
            <p className="text-xs text-gray-300">{streamInfo.host.followersCount.toLocaleString()} followers</p>
          </div>
          <Button variant="secondary" size="sm" className="ml-auto">
            Follow
          </Button>
        </div>
      </div>
      
      {/* Stream info overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <h2 className="font-bold text-lg text-white mb-1">{streamInfo.title}</h2>
        <p className="text-sm text-gray-300">{streamInfo.description}</p>
        <div className="flex mt-2">
          {streamInfo.tags.map(tag => (
            <span key={tag} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full mr-2">
              #{tag}
            </span>
          ))}
        </div>
      </div>
      
      {/* Viewer count */}
      <div className="absolute top-4 right-4 bg-red-600 text-white px-2 py-1 rounded-full text-xs flex items-center">
        <Users className="w-3 h-3 mr-1" />
        {viewers.toLocaleString()}
      </div>
      
      {/* Gift animations */}
      <div className="absolute bottom-20 left-0 right-0 pointer-events-none">
        <AnimatePresence>
          {recentGifts.slice(-3).map((gift) => (
            <motion.div
              key={gift.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="flex items-center bg-black/60 backdrop-blur-sm rounded-full p-2 mb-2 mx-auto w-fit"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={gift.avatarUrl} />
                <AvatarFallback>{gift.displayName.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="mx-2 text-sm">{gift.displayName} sent</span>
              <img src={gift.giftImageUrl} alt={gift.giftName} className="h-8 w-8" />
              <span className="ml-1 text-sm font-bold text-app-yellow">{gift.giftName}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LiveStreamMainContent;
