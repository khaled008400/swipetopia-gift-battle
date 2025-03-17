
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
    <div key={id} className="mb-3">
      <div className="flex items-start space-x-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={sender.avatar_url} />
          <AvatarFallback>{sender.username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{sender.username}</p>
          <p className="text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded-md">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
