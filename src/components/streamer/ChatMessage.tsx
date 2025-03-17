
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export interface ChatMessageProps {
  id: string;
  message: string;
  sender: {
    username: string;
    avatar_url: string;
  };
}

const ChatMessage: React.FC<ChatMessageProps> = ({ id, message, sender }) => {
  return (
    <div key={id} className="mb-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-1 rounded-lg transition-colors">
      <div className="flex items-start space-x-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={sender.avatar_url} alt={sender.username} />
          <AvatarFallback>{sender.username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="text-sm font-medium">{sender.username}</p>
          <p className="text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded-md break-words">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
