
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  disabled: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  message,
  setMessage,
  handleSubmit,
  disabled
}) => {
  return (
    <form onSubmit={handleSubmit} className="p-3 border-t flex gap-2">
      <Input
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={disabled}
      />
      <Button type="submit" size="sm" disabled={disabled || !message.trim()}>
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default ChatInput;
