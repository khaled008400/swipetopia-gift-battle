
import React, { useRef, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LiveStreamComment, LiveStreamInfo } from '@/types/livestream.types';
import { formatDistanceToNow } from 'date-fns';

interface LiveStreamSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  comments: LiveStreamComment[];
  handleSendComment: () => void;
  newComment: string;
  setNewComment: (comment: string) => void;
  streamInfo: LiveStreamInfo;
}

const LiveStreamSidebar: React.FC<LiveStreamSidebarProps> = ({
  activeTab,
  setActiveTab,
  comments,
  handleSendComment,
  newComment,
  setNewComment,
  streamInfo
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when comments change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  return (
    <div className="w-full md:w-80 bg-gray-900 flex flex-col">
      <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
        <TabsList className="grid grid-cols-3 p-0 bg-gray-800">
          <TabsTrigger value="chat" className="py-2">Chat</TabsTrigger>
          <TabsTrigger value="viewers" className="py-2">Viewers</TabsTrigger>
          <TabsTrigger value="products" className="py-2">Products</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="flex-grow flex flex-col p-0 m-0 overflow-hidden">
          <ScrollArea className="flex-grow p-4">
            {comments.map((comment) => (
              <div key={comment.id} className="mb-3">
                <div className="flex items-start">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={comment.avatarUrl} />
                    <AvatarFallback>{comment.displayName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium">
                        {comment.displayName}
                      </span>
                      {comment.isVerified && (
                        <span className="ml-1 text-app-yellow text-xs">✓</span>
                      )}
                    </div>
                    <p className={`text-sm ${comment.isGift ? 'text-app-yellow' : 'text-gray-300'}`}>
                      {comment.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </ScrollArea>
          
          <div className="p-2 border-t border-gray-800">
            <div className="flex">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="bg-gray-800 border-0"
                onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
              />
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={handleSendComment}
                disabled={!newComment.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="viewers" className="flex-grow p-4 m-0">
          <div className="mb-4">
            <h3 className="font-medium mb-2">Top Viewers</h3>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center mb-2">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={`https://i.pravatar.cc/150?img=${10 + i}`} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium">User{i + 1}</span>
                    {i < 2 && <span className="ml-1 text-app-yellow text-xs">✓</span>}
                  </div>
                  <div className="text-xs text-gray-400">Gifted: ${(100 - i * 15).toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Recently Joined</h3>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center mb-2">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={`https://i.pravatar.cc/150?img=${20 + i}`} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div>
                  <span className="text-sm">Viewer{i + 1}</span>
                  <div className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(Date.now() - i * 5 * 60 * 1000), { addSuffix: true })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="products" className="flex-grow p-4 m-0">
          <h3 className="font-medium mb-4">Featured Products</h3>
          {streamInfo.products.map((product) => (
            <div key={product.id} className="bg-gray-800 rounded-lg p-3 mb-3">
              <div className="flex">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div className="ml-3">
                  <h4 className="font-medium">{product.name}</h4>
                  <div className="flex items-center mt-1">
                    <span className="font-bold text-app-yellow">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.discountPercent > 0 && (
                      <span className="ml-2 text-xs line-through text-gray-400">
                        ${(product.price / (1 - product.discountPercent / 100)).toFixed(2)}
                      </span>
                    )}
                  </div>
                  <Button size="sm" className="mt-2">
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          <Button variant="outline" className="w-full mt-2">
            View All Products
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LiveStreamSidebar;
