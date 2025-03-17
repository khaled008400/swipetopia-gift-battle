
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface GiftItem {
  id: string;
  name: string;
  value: number;
  imageUrl: string;
}

interface LiveStreamGiftModalProps {
  onClose: () => void;
  onSendGift: (gift: GiftItem) => void;
}

const LiveStreamGiftModal: React.FC<LiveStreamGiftModalProps> = ({
  onClose,
  onSendGift
}) => {
  const giftItems: GiftItem[] = [
    { id: 'gift1', name: 'Rose', value: 5, imageUrl: 'https://via.placeholder.com/50' },
    { id: 'gift2', name: 'Heart', value: 10, imageUrl: 'https://via.placeholder.com/50' },
    { id: 'gift3', name: 'Crown', value: 50, imageUrl: 'https://via.placeholder.com/50' },
    { id: 'gift4', name: 'Diamond', value: 100, imageUrl: 'https://via.placeholder.com/50' },
    { id: 'gift5', name: 'Rocket', value: 200, imageUrl: 'https://via.placeholder.com/50' },
    { id: 'gift6', name: 'Car', value: 500, imageUrl: 'https://via.placeholder.com/50' },
    { id: 'gift7', name: 'Castle', value: 1000, imageUrl: 'https://via.placeholder.com/50' },
    { id: 'gift8', name: 'Island', value: 5000, imageUrl: 'https://via.placeholder.com/50' },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 flex items-end justify-center z-50">
      <div className="bg-gray-900 w-full max-w-md rounded-t-xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Send a Gift</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="grid grid-cols-4 gap-3 mb-4">
          {giftItems.map(gift => (
            <div 
              key={gift.id}
              className="flex flex-col items-center p-2 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700"
              onClick={() => onSendGift(gift)}
            >
              <img src={gift.imageUrl} alt={gift.name} className="w-10 h-10 mb-1" />
              <span className="text-xs">{gift.name}</span>
              <span className="text-xs text-app-yellow">${gift.value}</span>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm">Your balance:</span>
            <span className="ml-1 font-bold text-app-yellow">$1,250.00</span>
          </div>
          <Button onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LiveStreamGiftModal;
