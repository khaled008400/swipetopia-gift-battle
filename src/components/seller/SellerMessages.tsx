
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { 
  Loader2, Send, Search, User, Clock, Check, Ban 
} from "lucide-react";
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "@/components/ui/tabs";
import { CustomerMessage } from "@/types/product.types";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogTrigger, DialogClose 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const SellerMessages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<{[key: string]: CustomerMessage[]}>({});
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const [reportsOpen, setReportsOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  
  useEffect(() => {
    if (user?.id) {
      fetchConversations();
      fetchBlockedUsers();
      // Subscribe to new messages
      const subscription = supabase
        .channel('messages_channel')
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'customer_messages',
          filter: `seller_id=eq.${user.id}`
        }, (payload) => {
          // Handle incoming message
          const newMessage = payload.new as CustomerMessage;
          addMessageToConversation(newMessage);
        })
        .subscribe();
        
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedConversation, conversations]);
  
  const fetchConversations = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      // Get all messages for this seller
      const { data, error } = await supabase
        .from('customer_messages')
        .select(`
          *,
          profiles:customer_id (username, avatar_url)
        `)
        .eq('seller_id', user.id)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      
      // Organize by conversation
      const conversationsMap: {[key: string]: CustomerMessage[]} = {};
      
      if (data) {
        data.forEach((msg: any) => {
          // Add customer details
          const message: CustomerMessage = {
            ...msg,
            customer_name: msg.profiles?.username || "Customer",
            customer_avatar: msg.profiles?.avatar_url
          };
          
          if (!conversationsMap[message.conversation_id]) {
            conversationsMap[message.conversation_id] = [];
          }
          conversationsMap[message.conversation_id].push(message);
        });
      }
      
      setConversations(conversationsMap);
      
      // Mark messages as read when fetched
      markConversationAsRead();
    } catch (error: any) {
      toast({
        title: "Error fetching messages",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchBlockedUsers = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('blocked_users')
        .select('blocked_user_id')
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      if (data) {
        setBlockedUsers(data.map(item => item.blocked_user_id));
      }
    } catch (error: any) {
      console.error("Error fetching blocked users:", error);
    }
  };
  
  const addMessageToConversation = (newMessage: CustomerMessage) => {
    setConversations(prev => {
      const updated = { ...prev };
      if (!updated[newMessage.conversation_id]) {
        updated[newMessage.conversation_id] = [];
      }
      
      // Only add if not already present
      if (!updated[newMessage.conversation_id].some(msg => msg.id === newMessage.id)) {
        updated[newMessage.conversation_id] = [
          ...updated[newMessage.conversation_id], 
          newMessage
        ];
      }
      
      return updated;
    });
  };
  
  const markConversationAsRead = async () => {
    if (!user?.id || !selectedConversation) return;
    
    try {
      await supabase
        .from('customer_messages')
        .update({ is_read: true })
        .eq('seller_id', user.id)
        .eq('conversation_id', selectedConversation)
        .eq('sender_type', 'customer');
        
      // Update local state as well
      setConversations(prev => {
        const updated = { ...prev };
        if (updated[selectedConversation]) {
          updated[selectedConversation] = updated[selectedConversation].map(msg => 
            msg.sender_type === 'customer' ? { ...msg, is_read: true } : msg
          );
        }
        return updated;
      });
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };
  
  const handleSendMessage = async () => {
    if (!message.trim() || !user?.id || !selectedConversation) return;
    
    try {
      const customerId = conversations[selectedConversation]?.[0]?.customer_id;
      
      if (!customerId) {
        toast({
          title: "Error",
          description: "Cannot determine customer for this conversation",
          variant: "destructive"
        });
        return;
      }
      
      const newMessage: Omit<CustomerMessage, 'id' | 'created_at'> = {
        seller_id: user.id,
        customer_id: customerId,
        content: message.trim(),
        is_read: false,
        conversation_id: selectedConversation,
        sender_type: 'seller'
      };
      
      const { data, error } = await supabase
        .from('customer_messages')
        .insert(newMessage)
        .select()
        .single();
        
      if (error) throw error;
      
      if (data) {
        addMessageToConversation(data);
        setMessage("");
      }
    } catch (error: any) {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const blockUser = async (customerId: string) => {
    if (!user?.id || !customerId) return;
    
    try {
      const { error } = await supabase
        .from('blocked_users')
        .insert({
          user_id: user.id,
          blocked_user_id: customerId,
          created_at: new Date().toISOString()
        });
        
      if (error) throw error;
      
      setBlockedUsers(prev => [...prev, customerId]);
      
      toast({
        title: "User blocked",
        description: "You will no longer receive messages from this user",
      });
    } catch (error: any) {
      toast({
        title: "Error blocking user",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const unblockUser = async (customerId: string) => {
    if (!user?.id || !customerId) return;
    
    try {
      const { error } = await supabase
        .from('blocked_users')
        .delete()
        .eq('user_id', user.id)
        .eq('blocked_user_id', customerId);
        
      if (error) throw error;
      
      setBlockedUsers(prev => prev.filter(id => id !== customerId));
      
      toast({
        title: "User unblocked",
        description: "You will now receive messages from this user",
      });
    } catch (error: any) {
      toast({
        title: "Error unblocking user",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const reportUser = async (customerId: string) => {
    if (!user?.id || !customerId || !reportReason.trim()) return;
    
    try {
      const { error } = await supabase
        .from('user_reports')
        .insert({
          reporter_id: user.id,
          reported_user_id: customerId,
          reason: reportReason,
          created_at: new Date().toISOString(),
          status: 'pending'
        });
        
      if (error) throw error;
      
      setReportsOpen(false);
      setReportReason("");
      
      toast({
        title: "Report submitted",
        description: "Your report has been submitted for review",
      });
    } catch (error: any) {
      toast({
        title: "Error reporting user",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const getConversationList = () => {
    const conversationIds = Object.keys(conversations);
    
    if (conversationIds.length === 0) {
      return (
        <div className="p-6 text-center text-muted-foreground">
          No messages found
        </div>
      );
    }
    
    return conversationIds
      .filter(id => {
        // Filter by search term
        if (searchTerm) {
          const convo = conversations[id];
          const customerName = convo[0]?.customer_name?.toLowerCase() || "";
          return customerName.includes(searchTerm.toLowerCase()) ||
            convo.some(msg => msg.content.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        
        // Filter by active tab
        if (activeTab === 'unread') {
          return conversations[id].some(msg => !msg.is_read && msg.sender_type === 'customer');
        }
        
        return true;
      })
      .map(id => {
        const convo = conversations[id];
        const lastMsg = convo[convo.length - 1];
        const customerName = convo[0]?.customer_name || "Customer";
        const avatar = convo[0]?.customer_avatar;
        const customerId = convo[0]?.customer_id;
        const hasUnread = convo.some(msg => !msg.is_read && msg.sender_type === 'customer');
        const isBlocked = customerId ? blockedUsers.includes(customerId) : false;
        
        return (
          <div 
            key={id}
            className={`p-3 border-b cursor-pointer transition-colors ${
              selectedConversation === id 
                ? "bg-app-gray-dark border-app-yellow" 
                : "hover:bg-gray-800"
            } ${hasUnread ? "bg-gray-800/40" : ""}`}
            onClick={() => {
              setSelectedConversation(id);
              markConversationAsRead();
            }}
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={avatar} />
                <AvatarFallback>{customerName.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="font-medium truncate">{customerName}</span>
                    {isBlocked && (
                      <Badge variant="outline" className="ml-2 text-xs bg-red-900/30 text-red-300">
                        Blocked
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(lastMsg.created_at), 'MMM d')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                    {lastMsg.sender_type === 'seller' ? 'You: ' : ''}{lastMsg.content}
                  </p>
                  {hasUnread && (
                    <div className="h-2 w-2 rounded-full bg-app-yellow"></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      });
  };
  
  const getSelectedConversation = () => {
    if (!selectedConversation || !conversations[selectedConversation]) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
          <User className="h-12 w-12 mb-2" />
          <p>Select a conversation to start messaging</p>
        </div>
      );
    }
    
    const messages = conversations[selectedConversation];
    const customer = messages[0]?.customer_name || "Customer";
    const customerId = messages[0]?.customer_id;
    const isBlocked = customerId ? blockedUsers.includes(customerId) : false;
    
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={messages[0]?.customer_avatar} />
              <AvatarFallback>{customer.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{customer}</span>
          </div>
          <div className="flex gap-2">
            {isBlocked ? (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => customerId && unblockUser(customerId)}
              >
                <Check className="h-4 w-4 mr-1" /> Unblock
              </Button>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => customerId && blockUser(customerId)}
                >
                  <Ban className="h-4 w-4 mr-1" /> Block
                </Button>
                <Dialog open={reportsOpen} onOpenChange={setReportsOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <ShieldAlert className="h-4 w-4 mr-1" /> Report
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Report User</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <p className="text-sm">
                        Please provide a reason for reporting this user. This will be reviewed by our moderation team.
                      </p>
                      <Input
                        placeholder="Reason for report"
                        value={reportReason}
                        onChange={(e) => setReportReason(e.target.value)}
                      />
                      <div className="flex justify-end gap-2">
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button 
                          onClick={() => customerId && reportUser(customerId)}
                          disabled={!reportReason.trim()}
                        >
                          Submit Report
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex ${msg.sender_type === 'seller' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[75%] rounded-lg p-3 ${
                  msg.sender_type === 'seller' 
                    ? 'bg-app-yellow text-black' 
                    : 'bg-app-gray-dark'
                }`}
              >
                <p>{msg.content}</p>
                <div className="text-xs mt-1 flex items-center justify-end">
                  <Clock className="h-3 w-3 mr-1" />
                  {format(new Date(msg.created_at), 'h:mm a')}
                  {msg.sender_type === 'seller' && (
                    <Check className="h-3 w-3 ml-1" />
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 border-t mt-auto">
          {isBlocked ? (
            <div className="text-center text-muted-foreground py-2">
              You have blocked this user. Unblock to send messages.
            </div>
          ) : (
            <div className="flex gap-2">
              <Input 
                placeholder="Type your message..." 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button onClick={handleSendMessage} disabled={!message.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-app-yellow" />
      </div>
    );
  }
  
  return (
    <div className="grid md:grid-cols-3 gap-4 h-[calc(100vh-240px)]">
      <Card className="md:col-span-1 overflow-hidden">
        <CardHeader className="p-4">
          <CardTitle>Conversations</CardTitle>
          <div className="relative mt-2">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search messages..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mt-2">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="p-0 overflow-y-auto" style={{ maxHeight: "calc(100vh - 300px)" }}>
          {getConversationList()}
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2 overflow-hidden flex flex-col">
        <CardContent className="p-0 flex-1 flex">
          {getSelectedConversation()}
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerMessages;
