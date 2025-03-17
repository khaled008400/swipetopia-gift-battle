
import React from 'react';
import { Button } from '@/components/ui/button';
import { Share, MessageSquare, Heart } from 'lucide-react';
import { BattleVideo } from '@/types/video.types';

interface ActionButtonsProps {
  battleId?: string;
  videos: BattleVideo[];
}

const ActionButtons = ({ battleId, videos }: ActionButtonsProps) => {
  return (
    <div className="flex justify-around mt-6 px-4">
      <Button variant="ghost" className="flex flex-col items-center">
        <Heart className="h-6 w-6 mb-1" />
        <span className="text-xs">Like</span>
      </Button>
      <Button variant="ghost" className="flex flex-col items-center">
        <MessageSquare className="h-6 w-6 mb-1" />
        <span className="text-xs">Comment</span>
      </Button>
      <Button variant="ghost" className="flex flex-col items-center">
        <Share className="h-6 w-6 mb-1" />
        <span className="text-xs">Share</span>
      </Button>
    </div>
  );
};

export default ActionButtons;
