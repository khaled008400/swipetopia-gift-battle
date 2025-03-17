
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface LiveStreamShareModalProps {
  onClose: () => void;
}

const LiveStreamShareModal: React.FC<LiveStreamShareModalProps> = ({
  onClose
}) => {
  const shareOptions = [
    { name: 'Copy Link', icon: '🔗' },
    { name: 'Twitter', icon: '🐦' },
    { name: 'Facebook', icon: '👤' },
    { name: 'Instagram', icon: '📷' },
    { name: 'WhatsApp', icon: '💬' },
    { name: 'Telegram', icon: '✈️' },
    { name: 'Email', icon: '📧' },
    { name: 'Messages', icon: '💌' },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 w-full max-w-md rounded-xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Share Stream</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="grid grid-cols-4 gap-4 mb-6">
          {shareOptions.map(option => (
            <div 
              key={option.name}
              className="flex flex-col items-center p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700"
            >
              <span className="text-2xl mb-1">{option.icon}</span>
              <span className="text-xs">{option.name}</span>
            </div>
          ))}
        </div>
        
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={onClose}
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default LiveStreamShareModal;
