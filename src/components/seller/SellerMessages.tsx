
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  MessageSquare,
  User,
  Send,
  MoreVertical,
  Phone,
  Video,
  AlertTriangle,
  Search,
  ChevronRight
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

// Simulate messages for demonstration
interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
}

interface Contact {
  id: string;
  username: string;
  avatar_url?: string;
  last_message?: string;
  last_message_time?: string;
  unread_count: number;
  status: 'online' | 'offline';
}

const SellerMessages = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Fetch contacts
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        if (!user) return;
        
        // In a real implementation, fetch from your database
        // For now, using mock data
        setContacts([
          {
            id: '1',
            username: 'Jane Cooper',
            avatar_url: 'https://i.pravatar.cc/150?img=1',
            last_message: 'Hi, I have a question about your product...',
            last_message_time: '2023-05-15T09:24:00Z',
            unread_count: 2,
            status: 'online'
          },
          {
            id: '2',
            username: 'Robert Fox',
            avatar_url: 'https://i.pravatar.cc/150?img=2',
            last_message: 'Thanks for the quick response!',
            last_message_time: '2023-05-14T18:35:00Z',
            unread_count: 0,
            status: 'offline'
          },
          {
            id: '3',
            username: 'Esther Howard',
            avatar_url: 'https://i.pravatar.cc/150?img=3',
            last_message: 'Do you offer international shipping?',
            last_message_time: '2023-05-14T12:10:00Z',
            unread_count: 1,
            status: 'offline'
          },
          {
            id: '4',
            username: 'Brooklyn Simmons',
            avatar_url: 'https://i.pravatar.cc/150?img=4',
            last_message: 'Order #12345 - Can I change my delivery address?',
            last_message_time: '2023-05-13T22:45:00Z',
            unread_count: 0,
            status: 'online'
          },
        ]);
      } catch (error) {
        console.error('Error fetching contacts:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your contacts. Please try again.',
          variant: 'destructive',
        });
      }
    };

    fetchContacts();
  }, [user, toast]);

  // Fetch messages for selected contact
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!user || !selectedContact) return;
        
        // Mock data for demonstration
        const mockMessages = [
          {
            id: '101',
            sender_id: selectedContact.id,
            receiver_id: user.id,
            content: 'Hello, I have a question about your wireless headphones.',
            created_at: '2023-05-15T09:15:00Z',
            read: true
          },
          {
            id: '102',
            sender_id: user.id,
            receiver_id: selectedContact.id,
            content: "Hi there! I'd be happy to help. What would you like to know?",
            created_at: '2023-05-15T09:18:00Z',
            read: true
          },
          {
            id: '103',
            sender_id: selectedContact.id,
            receiver_id: user.id,
            content: 'Do they have noise cancellation?',
            created_at: '2023-05-15T09:20:00Z',
            read: true
          },
          {
            id: '104',
            sender_id: user.id,
            receiver_id: selectedContact.id,
            content: 'Yes, they feature active noise cancellation technology that blocks out ambient noise very effectively.',
            created_at: '2023-05-15T09:22:00Z',
            read: true
          },
          {
            id: '105',
            sender_id: selectedContact.id,
            receiver_id: user.id,
            content: "That's great! And what's the battery life like?",
            created_at: '2023-05-15T09:24:00Z',
            read: false
          },
          {
            id: '106',
            sender_id: selectedContact.id,
            receiver_id: user.id,
            content: "Also, do they come with a warranty?",
            created_at: '2023-05-15T09:24:30Z',
            read: false
          }
        ];
        
        setMessages(mockMessages);
        
        // Mark messages as read
        const unreadMessages = contacts.find(c => c.id === selectedContact.id)?.unread_count || 0;
        if (unreadMessages > 0) {
          setContacts(prevContacts => 
            prevContacts.map(contact => 
              contact.id === selectedContact.id 
                ? { ...contact, unread_count: 0 } 
                : contact
            )
          );
          
          // In a real implementation, update in database
          // await supabase
          //   .from('messages')
          //   .update({ read: true })
          //   .eq('receiver_id', user.id)
          //   .eq('sender_id', selectedContact.id)
          //   .eq('read', false);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast({
          title: 'Error',
          description: 'Failed to load messages. Please try again.',
          variant: 'destructive',
        });
      }
    };

    fetchMessages();
  }, [user, selectedContact, toast, contacts]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message
  const sendMessage = async () => {
    if (!messageText.trim() || !user || !selectedContact) return;
    
    try {
      const newMessage: Message = {
        id: Date.now().toString(),
        sender_id: user.id,
        receiver_id: selectedContact.id,
        content: messageText,
        created_at: new Date().toISOString(),
        read: false
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessageText('');
      
      // Update last message in contacts
      setContacts(prevContacts => 
        prevContacts.map(contact => 
          contact.id === selectedContact.id 
            ? { 
                ...contact, 
                last_message: messageText, 
                last_message_time: new Date().toISOString() 
              } 
            : contact
        )
      );
      
      // In a real implementation, save to database
      // await supabase
      //   .from('messages')
      //   .insert({
      //     sender_id: user.id,
      //     receiver_id: selectedContact.id,
      //     content: messageText
      //   });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const filteredContacts = contacts.filter(contact => 
    contact.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-8rem)] flex">
      {/* Contacts sidebar */}
      <div className="w-full md:w-1/3 border-r">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Messages</h2>
          <div className="relative mt-2">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations"
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <ScrollArea className="h-[calc(100%-5rem)]">
          <div className="space-y-1 p-2">
            {filteredContacts.length > 0 ? (
              filteredContacts.map(contact => (
                <div
                  key={contact.id}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg cursor-pointer
                    ${selectedContact?.id === contact.id ? 'bg-secondary' : 'hover:bg-secondary/50'}
                  `}
                  onClick={() => setSelectedContact(contact)}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={contact.avatar_url} />
                      <AvatarFallback>{contact.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span 
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background
                        ${contact.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}
                      `} 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <span className="font-medium">{contact.username}</span>
                      <span className="text-xs text-muted-foreground">
                        {contact.last_message_time && format(new Date(contact.last_message_time), 'MMM d')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground truncate max-w-[180px]">
                        {contact.last_message}
                      </p>
                      {contact.unread_count > 0 && (
                        <Badge className="rounded-full h-5 min-w-[20px] flex items-center justify-center">
                          {contact.unread_count}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No conversations found
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
      
      {/* Chat area */}
      {selectedContact ? (
        <div className="flex-1 flex flex-col">
          {/* Chat header */}
          <div className="p-4 border-b flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={selectedContact.avatar_url} />
                <AvatarFallback>{selectedContact.username.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{selectedContact.username}</div>
                <div className="text-xs text-muted-foreground">
                  {selectedContact.status === 'online' ? 'Online' : 'Offline'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Phone className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View profile</DropdownMenuItem>
                  <DropdownMenuItem>Mark as unread</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Block user
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message, index) => {
                const isUser = message.sender_id === user?.id;
                const showAvatar = index === 0 || messages[index - 1].sender_id !== message.sender_id;
                
                return (
                  <div
                    key={message.id}
                    className={`flex items-start gap-2 ${isUser ? 'justify-end' : ''}`}
                  >
                    {!isUser && showAvatar && (
                      <Avatar className="h-8 w-8 mt-0.5">
                        <AvatarImage src={selectedContact.avatar_url} />
                        <AvatarFallback>{selectedContact.username.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                    {!isUser && !showAvatar && <div className="w-8" />}
                    <div className={`
                      px-3 py-2 rounded-lg max-w-[80%] break-words
                      ${isUser 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary text-secondary-foreground'
                      }
                    `}>
                      {message.content}
                      <div className="text-xs opacity-70 text-right mt-1">
                        {format(new Date(message.created_at), 'h:mm a')}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          {/* Message input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <Button onClick={sendMessage} disabled={!messageText.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-muted/50">
          <div className="text-center">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Your Messages</h3>
            <p className="text-muted-foreground mb-4 max-w-md px-4">
              Select a conversation to start messaging
            </p>
            <Button 
              variant="outline"
              className="mt-2"
              onClick={() => {
                // Redirect to new message screen
                // In a real implementation, navigate to page for creating a new message
              }}
            >
              New Message <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerMessages;
