import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Loader2, Send, MoreVertical, AlertTriangle, 
  ShieldAlert, MessageSquare
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CustomerMessage } from "@/types/product.types";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase";

interface MessageData {
  id: string;
  sender_type: "customer" | "seller";
  customer_id: string;
  seller_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
  conversation_id: string;
  customer_name?: string;
  customer_avatar?: string;
}

const SellerMessages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<CustomerMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.id) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation);
    }
  }, [activeConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const mockConversations = [
        {
          id: "conv-1",
          customer_id: "user-1",
          customer_name: "Sarah Johnson",
          customer_avatar: "https://i.pravatar.cc/150?u=sarah",
          last_message: "Do you have this in blue?",
          last_message_time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          unread_count: 3,
        },
        {
          id: "conv-2",
          customer_id: "user-2",
          customer_name: "Mike Chen",
          customer_avatar: "https://i.pravatar.cc/150?u=mike",
          last_message: "Thanks for the quick shipping!",
          last_message_time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          unread_count: 0,
        },
        {
          id: "conv-3",
          customer_id: "user-3",
          customer_name: "Emma Wilson",
          customer_avatar: "https://i.pravatar.cc/150?u=emma",
          last_message: "When will my order arrive?",
          last_message_time: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          unread_count: 1,
        },
        {
          id: "conv-4",
          customer_id: "user-4",
          customer_name: "James Taylor",
          customer_avatar: "https://i.pravatar.cc/150?u=james",
          last_message: "Is this product still available?",
          last_message_time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          unread_count: 0,
        },
      ];
      
      setConversations(mockConversations);
      if (mockConversations.length > 0 && !activeConversation) {
        setActiveConversation(mockConversations[0].id);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast({
        title: "Error",
        description: "Could not load conversations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const conversation = conversations.find(c => c.id === conversationId);
      if (!conversation) return;
      
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv.id === conversationId 
            ? { ...conv, unread_count: 0 } 
            : conv
        )
      );
      
      const mockMessages: MessageData[] = [
        {
          id: `msg-${conversationId}-1`,
          sender_type: "customer",
          customer_id: conversation.customer_id,
          seller_id: user?.id || "",
          content: "Hi, I'm interested in one of your products.",
          created_at: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
          is_read: true,
          conversation_id: conversationId,
          customer_name: conversation.customer_name,
          customer_avatar: conversation.customer_avatar,
        },
        {
          id: `msg-${conversationId}-2`,
          sender_type: "seller",
          customer_id: conversation.customer_id,
          seller_id: user?.id || "",
          content: "Hello! Which product are you interested in?",
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          is_read: true,
          conversation_id: conversationId,
        },
        {
          id: `msg-${conversationId}-3`,
          sender_type: "customer",
          customer_id: conversation.customer_id,
          seller_id: user?.id || "",
          content: "I'm looking at the black leather jacket. Do you have it in size medium?",
          created_at: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
          is_read: true,
          conversation_id: conversationId,
          customer_name: conversation.customer_name,
          customer_avatar: conversation.customer_avatar,
        },
        {
          id: `msg-${conversationId}-4`,
          sender_type: "seller",
          customer_id: conversation.customer_id,
          seller_id: user?.id || "",
          content: "Yes, we do have the black leather jacket in medium. It's currently in stock and ready to ship!",
          created_at: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
          is_read: true,
          conversation_id: conversationId,
        },
      ];
      
      if (conversation.last_message) {
        mockMessages.push({
          id: `msg-${conversationId}-latest`,
          sender_type: "customer",
          customer_id: conversation.customer_id,
          seller_id: user?.id || "",
          content: conversation.last_message,
          created_at: conversation.last_message_time,
          is_read: conversation.unread_count === 0,
          conversation_id: conversationId,
          customer_name: conversation.customer_name,
          customer_avatar: conversation.customer_avatar,
        });
      }
      
      mockMessages.sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      
      const transformedMessages: CustomerMessage[] = mockMessages.map(msg => ({
        id: msg.id,
        sender_id: msg.sender_type === "customer" ? msg.customer_id : msg.seller_id,
        receiver_id: msg.sender_type === "customer" ? msg.seller_id : msg.customer_id,
        content: msg.content,
        read: msg.is_read,
        created_at: msg.created_at,
        updated_at: msg.created_at,
        sender_type: msg.sender_type,
        customer_id: msg.customer_id,
        seller_id: msg.seller_id,
        is_read: msg.is_read,
        conversation_id: msg.conversation_id,
        customer_name: msg.customer_name,
        customer_avatar: msg.customer_avatar
      }));
      
      setMessages(transformedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Error",
        description: "Could not load messages. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return;
    
    setSending(true);
    try {
      const conversation = conversations.find(c => c.id === activeConversation);
      if (!conversation) return;
      
      const newMessageObj: CustomerMessage = {
        id: `msg-${Date.now()}`,
        sender_id: user?.id || "",
        receiver_id: conversation.customer_id,
        content: newMessage,
        read: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        sender_type: "seller",
        customer_id: conversation.customer_id,
        seller_id: user?.id || "",
        is_read: false,
        conversation_id: activeConversation,
      };
      
      setMessages(prevMessages => [...prevMessages, newMessageObj]);
      
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv.id === activeConversation 
            ? {
                ...conv,
                last_message: newMessage,
                last_message_time: new Date().toISOString(),
                unread_count: 0
              } 
            : conv
        )
      );
      
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const handleBlockUser = (userId: string) => {
    setBlockedUsers(prev => [...prev, userId]);
    toast({
      title: "User blocked",
      description: "You will no longer receive messages from this user.",
    });
  };

  const handleUnblockUser = (userId: string) => {
    setBlockedUsers(prev => prev.filter(id => id !== userId));
    toast({
      title: "User unblocked",
      description: "You will now receive messages from this user.",
    });
  };

  const handleReportUser = (userId: string) => {
    toast({
      title: "User reported",
      description: "Thank you for your report. Our team will review it.",
    });
  };

  const isUserBlocked = (userId: string) => {
    return blockedUsers.includes(userId);
  };

  if (loading && conversations.length === 0) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-app-yellow" />
      </div>
    );
  }

  const getActiveConversation = () => {
    return conversations.find(c => c.id === activeConversation);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Conversations</CardTitle>
        </CardHeader>
        <CardContent>
          {conversations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No conversations yet
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-300px)]">
              <div className="space-y-4">
                {conversations.map((conversation) => (
                  <div 
                    key={conversation.id}
                    className={`flex items-center space-x-4 p-3 rounded-lg cursor-pointer hover:bg-app-gray-dark transition-colors ${
                      activeConversation === conversation.id ? 'bg-app-gray-dark' : ''
                    }`}
                    onClick={() => setActiveConversation(conversation.id)}
                  >
                    <Avatar>
                      <AvatarImage src={conversation.customer_avatar} />
                      <AvatarFallback>
                        {conversation.customer_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium truncate">
                          {conversation.customer_name}
                        </h4>
                        <span className="text-xs text-gray-400">
                          {format(new Date(conversation.last_message_time), 'hh:mm a')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 truncate">
                        {conversation.last_message}
                      </p>
                    </div>
                    {conversation.unread_count > 0 && (
                      <div className="bg-app-yellow text-app-black text-xs font-bold h-5 w-5 rounded-full flex items-center justify-center">
                        {conversation.unread_count}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2">
        <CardHeader className="pb-3">
          {activeConversation ? (
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={getActiveConversation()?.customer_avatar} />
                  <AvatarFallback>
                    {getActiveConversation()?.customer_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">
                    {getActiveConversation()?.customer_name}
                  </CardTitle>
                  {isUserBlocked(getActiveConversation()?.customer_id) && (
                    <span className="text-xs text-red-500 flex items-center">
                      <ShieldAlert className="w-3 h-3 mr-1" />
                      Blocked
                    </span>
                  )}
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isUserBlocked(getActiveConversation()?.customer_id) ? (
                    <DropdownMenuItem 
                      onClick={() => handleUnblockUser(getActiveConversation()?.customer_id)}
                    >
                      Unblock User
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem 
                      onClick={() => handleBlockUser(getActiveConversation()?.customer_id)}
                      className="text-red-500"
                    >
                      Block User
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    onClick={() => handleReportUser(getActiveConversation()?.customer_id)}
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Report User
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <CardTitle>Select a conversation</CardTitle>
          )}
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          {!activeConversation ? (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-300px)] text-gray-500">
              <MessageSquare className="h-12 w-12 mb-4 opacity-30" />
              <p>Select a conversation to view messages</p>
            </div>
          ) : (
            <>
              <ScrollArea className="h-[calc(100vh-380px)] pr-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender_type === "seller" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {message.sender_type === "customer" && (
                        <Avatar className="mr-2 mt-1">
                          <AvatarImage src={message.customer_avatar} />
                          <AvatarFallback>
                            {message.customer_name?.charAt(0) || "C"}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <div
                          className={`max-w-md rounded-lg p-3 ${
                            message.sender_type === "seller"
                              ? "bg-app-yellow text-app-black"
                              : "bg-app-gray-dark text-white"
                          }`}
                        >
                          {message.content}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {format(new Date(message.created_at), 'MMM d, hh:mm a')}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              <div className="mt-4">
                {isUserBlocked(getActiveConversation()?.customer_id) ? (
                  <div className="bg-red-500/10 text-red-500 p-3 rounded-lg text-center">
                    You have blocked this user. Unblock to send messages.
                  </div>
                ) : (
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex space-x-2"
                  >
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1"
                    />
                    <Button 
                      type="submit" 
                      disabled={sending || !newMessage.trim()}
                      className="bg-app-yellow text-app-black hover:bg-yellow-500"
                    >
                      {sending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerMessages;
