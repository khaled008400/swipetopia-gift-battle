
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2, BookmarkIcon } from 'lucide-react';
import { BattleVideo } from '@/types/video.types';

export interface ActionButtonsProps {
  battleId?: string;
  videos: BattleVideo[];
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ battleId, videos }) => {
  return (
    <div className="fixed bottom-20 right-4 flex flex-col gap-5 items-center">
      <Button variant="ghost" size="icon" className="bg-black/30 hover:bg-black/50 rounded-full p-3">
        <Heart className="h-6 w-6 text-white" />
        <span className="sr-only">Like</span>
      </Button>
      
      <Button variant="ghost" size="icon" className="bg-black/30 hover:bg-black/50 rounded-full p-3">
        <MessageCircle className="h-6 w-6 text-white" />
        <span className="sr-only">Comment</span>
      </Button>
      
      <Button variant="ghost" size="icon" className="bg-black/30 hover:bg-black/50 rounded-full p-3">
        <BookmarkIcon className="h-6 w-6 text-white" />
        <span className="sr-only">Save</span>
      </Button>
      
      <Button variant="ghost" size="icon" className="bg-black/30 hover:bg-black/50 rounded-full p-3">
        <Share2 className="h-6 w-6 text-white" />
        <span className="sr-only">Share</span>
      </Button>
    </div>
  );
};

export default ActionButtons;
