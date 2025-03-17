
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { useStreamChat } from '@/hooks/useStreamChat';

interface LiveChatProps {
  streamId: string;
}

const LiveChat: React.FC<LiveChatProps> = ({ streamId }) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { messages, loading, sendMessage } = useStreamChat(streamId);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !user) return;
    
    const success = await sendMessage(message);
    if (success) {
      setMessage('');
    }
  };
  
  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 rounded-md">
      <div className="flex-1 p-3 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col space-y-3">
            <div className="flex items-start space-x-2 animate-pulse">
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-1"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </div>
            </div>
            <div className="flex items-start space-x-2 animate-pulse">
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-1"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </div>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center">
            <div className="text-gray-500">
              <p>No chat messages yet</p>
              <p className="text-sm">Be the first to say hello!</p>
            </div>
          </div>
        ) : (
          messages.map(msg => (
            <ChatMessage 
              key={msg.id} 
              id={msg.id} 
              message={msg.message} 
              sender={msg.sender} 
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <ChatInput 
        message={message}
        setMessage={setMessage}
        handleSubmit={handleSubmit}
        disabled={!user}
      />
    </div>
  );
};

export default LiveChat;
