
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Share, Gift, DollarSign } from 'lucide-react';

interface LiveStreamBottomBarProps {
  isLiked: boolean;
  handleLikeStream: () => void;
  setShowShareModal: (show: boolean) => void;
  setShowGiftSelector: (show: boolean) => void;
}

const LiveStreamBottomBar: React.FC<LiveStreamBottomBarProps> = ({
  isLiked,
  handleLikeStream,
  setShowShareModal,
  setShowGiftSelector
}) => {
  return (
    <div className="bg-gray-900 p-3 flex items-center justify-between">
      <div className="flex space-x-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className={isLiked ? 'text-red-500' : 'text-white'} 
          onClick={handleLikeStream}
        >
          <Heart className="h-6 w-6 fill-current" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setShowShareModal(true)}
        >
          <Share className="h-6 w-6" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setShowGiftSelector(true)}
        >
          <Gift className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="flex items-center">
        <span className="text-sm mr-2">Support the creator</span>
        <Button variant="default" size="sm" className="bg-app-yellow text-black hover:bg-yellow-400">
          <DollarSign className="h-4 w-4 mr-1" /> Donate
        </Button>
      </div>
    </div>
  );
};

export default LiveStreamBottomBar;
