import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Heart, Share, Gift, Send, DollarSign, Users, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LiveStreamComment, LiveStreamGift, LiveStreamInfo } from '@/types/livestream.types';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

const LiveStreamPage: React.FC = () => {
  const { streamId } = useParams<{ streamId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [streamInfo, setStreamInfo] = useState<LiveStreamInfo | null>(null);
  const [comments, setComments] = useState<LiveStreamComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [viewers, setViewers] = useState<number>(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showGiftSelector, setShowGiftSelector] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [recentGifts, setRecentGifts] = useState<LiveStreamGift[]>([]);
  const [activeTab, setActiveTab] = useState('chat');
  
  const mockStreamInfo: LiveStreamInfo = {
    id: streamId || '1',
    title: 'Live Dance Session',
    description: 'Join me for some awesome dance moves!',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    startedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
    status: 'live',
    viewersCount: 1245,
    likesCount: 8723,
    host: {
      id: '123',
      username: 'dancequeen',
      displayName: 'Dance Queen',
      avatarUrl: 'https://i.pravatar.cc/150?img=1',
      isVerified: true,
      followersCount: 125000
    },
    tags: ['dance', 'hiphop', 'tutorial'],
    products: [
      {
        id: '1',
        name: 'Dance Shoes',
        price: 89.99,
        imageUrl: 'https://i.pravatar.cc/150?img=2',
        discountPercent: 15
      },
      {
        id: '2',
        name: 'Training Kit',
        price: 129.99,
        imageUrl: 'https://i.pravatar.cc/150?img=3',
        discountPercent: 0
      }
    ]
  };
  
  const mockComments: LiveStreamComment[] = [
    {
      id: '1',
      userId: '101',
      username: 'fan123',
      displayName: 'Dance Fan',
      avatarUrl: 'https://i.pravatar.cc/150?img=4',
      content: 'Loving the moves! 🔥',
      createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
      isVerified: false
    },
    {
      id: '2',
      userId: '102',
      username: 'groovyuser',
      displayName: 'Groovy',
      avatarUrl: 'https://i.pravatar.cc/150?img=5',
      content: 'Can you show that step again?',
      createdAt: new Date(Date.now() - 1 * 60 * 1000).toISOString(), // 1 minute ago
      isVerified: true
    }
  ];
  
  useEffect(() => {
    const loadStreamData = async () => {
      setIsLoading(true);
      try {
        // In a real app, fetch from API
        // const data = await LiveStreamService.getStreamById(streamId);
        
        // Using mock data for now
        setTimeout(() => {
          setStreamInfo(mockStreamInfo);
          setComments(mockComments);
          setViewers(mockStreamInfo.viewersCount);
          setLikesCount(mockStreamInfo.likesCount);
          setIsLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error('Error loading stream:', error);
        toast({
          title: 'Error',
          description: 'Failed to load the live stream. Please try again.',
          variant: 'destructive'
        });
        setIsLoading(false);
      }
    };
    
    loadStreamData();
    
    // Simulate new comments coming in
    const commentInterval = setInterval(() => {
      const newMockComment: LiveStreamComment = {
        id: Date.now().toString(),
        userId: Math.floor(Math.random() * 1000).toString(),
        username: `user${Math.floor(Math.random() * 100)}`,
        displayName: `User ${Math.floor(Math.random() * 100)}`,
        avatarUrl: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
        content: [
          'Amazing stream! 🔥',
          'Love your content!',
          'Hello from Brazil! 🇧🇷',
          'Can you do a tutorial on that?',
          'You're so talented!',
          '👏👏👏',
          'First time watching, instant follow!',
          'What song is this?'
        ][Math.floor(Math.random() * 8)],
        createdAt: new Date().toISOString(),
        isVerified: Math.random() > 0.9
      };
      
      setComments(prev => [...prev, newMockComment]);
    }, 5000);
    
    // Simulate viewer count changes
    const viewerInterval = setInterval(() => {
      setViewers(prev => {
        const change = Math.floor(Math.random() * 10) - 3; // -3 to +6
        return Math.max(1000, prev + change);
      });
    }, 3000);
    
    return () => {
      clearInterval(commentInterval);
      clearInterval(viewerInterval);
    };
  }, [streamId, toast]);
  
  const handleSendComment = () => {
    if (!newComment.trim()) return;
    
    const userComment: LiveStreamComment = {
      id: Date.now().toString(),
      userId: user?.id || 'guest',
      username: user?.username || 'guest',
      displayName: user?.username || 'Guest User',
      avatarUrl: user?.avatar_url || '',
      content: newComment,
      createdAt: new Date().toISOString(),
      isVerified: false
    };
    
    setComments(prev => [...prev, userComment]);
    setNewComment('');
  };
  
  const handleLikeStream = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    
    // In a real app, send to API
    // LiveStreamService.likeStream(streamId);
    
    if (!isLiked) {
      toast({
        title: 'Liked!',
        description: 'You liked this stream',
      });
    }
  };
  
  const handleSendGift = (gift: any) => {
    setShowGiftSelector(false);
    
    const newGift: LiveStreamGift = {
      id: Date.now().toString(),
      userId: user?.id || 'guest',
      username: user?.username || 'guest',
      displayName: user?.username || 'Guest User',
      avatarUrl: user?.avatar_url || '',
      giftId: gift.id,
      giftName: gift.name,
      giftImageUrl: gift.imageUrl,
      giftValue: gift.value,
      createdAt: new Date().toISOString()
    };
    
    setRecentGifts(prev => [...prev, newGift]);
    
    // In a real app, send to API
    // LiveStreamService.sendGift(streamId, gift.id);
    
    toast({
      title: 'Gift Sent!',
      description: `You sent a ${gift.name} worth $${gift.value}`,
    });
    
    // Add a comment about the gift
    const giftComment: LiveStreamComment = {
      id: `gift-${Date.now()}`,
      userId: user?.id || 'guest',
      username: user?.username || 'guest',
      displayName: user?.username || 'Guest User',
      avatarUrl: user?.avatar_url || '',
      content: `Sent a ${gift.name} 🎁`,
      createdAt: new Date().toISOString(),
      isVerified: false,
      isGift: true
    };
    
    setComments(prev => [...prev, giftComment]);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <Loader2 className="w-12 h-12 animate-spin text-app-yellow" />
      </div>
    );
  }
  
  if (!streamInfo) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black p-4">
        <h1 className="text-2xl font-bold mb-4">Stream Not Found</h1>
        <p className="mb-6">The live stream you're looking for doesn't exist or has ended.</p>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Main Content */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Video Area */}
        <div className="relative flex-grow">
          <video
            ref={videoRef}
            src={streamInfo.streamUrl}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
          
          {/* Overlay for host info */}
          <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 border-2 border-app-yellow">
                <AvatarImage src={streamInfo.host.avatarUrl} />
                <AvatarFallback>{streamInfo.host.displayName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-2">
                <div className="flex items-center">
                  <h3 className="font-bold text-white">{streamInfo.host.displayName}</h3>
                  {streamInfo.host.isVerified && (
                    <span className="ml-1 text-app-yellow">✓</span>
                  )}
                </div>
                <p className="text-xs text-gray-300">{streamInfo.host.followersCount.toLocaleString()} followers</p>
              </div>
              <Button variant="secondary" size="sm" className="ml-auto">
                Follow
              </Button>
            </div>
          </div>
          
          {/* Stream info overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <h2 className="font-bold text-lg text-white mb-1">{streamInfo.title}</h2>
            <p className="text-sm text-gray-300">{streamInfo.description}</p>
            <div className="flex mt-2">
              {streamInfo.tags.map(tag => (
                <span key={tag} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full mr-2">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
          
          {/* Viewer count */}
          <div className="absolute top-4 right-4 bg-red-600 text-white px-2 py-1 rounded-full text-xs flex items-center">
            <Users className="w-3 h-3 mr-1" />
            {viewers.toLocaleString()}
          </div>
          
          {/* Gift animations */}
          <div className="absolute bottom-20 left-0 right-0 pointer-events-none">
            <AnimatePresence>
              {recentGifts.slice(-3).map((gift) => (
                <motion.div
                  key={gift.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center bg-black/60 backdrop-blur-sm rounded-full p-2 mb-2 mx-auto w-fit"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={gift.avatarUrl} />
                    <AvatarFallback>{gift.displayName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="mx-2 text-sm">{gift.displayName} sent</span>
                  <img src={gift.giftImageUrl} alt={gift.giftName} className="h-8 w-8" />
                  <span className="ml-1 text-sm font-bold text-app-yellow">{gift.giftName}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Sidebar */}
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
      </div>
      
      {/* Bottom Action Bar */}
      <div className="bg-gray-900 p-3 flex items-center justify-between">
        <div className="flex space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className={isLiked ? 'text-red-500' : 'text-white'} 
            onClick={handleLikeStream}
          >
            <Heart className="h-6 w-6 fill-current" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setShowShareModal(true)}
          >
            <Share className="h-6 w-6" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setShowGiftSelector(true)}
          >
            <Gift className="h-6 w-6" />
          </Button>
        </div>
        
        <div className="flex items-center">
          <span className="text-sm mr-2">Support the creator</span>
          <Button variant="default" size="sm" className="bg-app-yellow text-black hover:bg-yellow-400">
            <DollarSign className="h-4 w-4 mr-1" /> Donate
          </Button>
        </div>
      </div>
      
      {/* Gift Selector Modal */}
      {showGiftSelector && (
        <div className="fixed inset-0 bg-black/70 flex items-end justify-center z-50">
          <div className="bg-gray-900 w-full max-w-md rounded-t-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Send a Gift</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowGiftSelector(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="grid grid-cols-4 gap-3 mb-4">
              {[
                { id: 'gift1', name: 'Rose', value: 5, imageUrl: 'https://via.placeholder.com/50' },
                { id: 'gift2', name: 'Heart', value: 10, imageUrl: 'https://via.placeholder.com/50' },
                { id: 'gift3', name: 'Crown', value: 50, imageUrl: 'https://via.placeholder.com/50' },
                { id: 'gift4', name: 'Diamond', value: 100, imageUrl: 'https://via.placeholder.com/50' },
                { id: 'gift5', name: 'Rocket', value: 200, imageUrl: 'https://via.placeholder.com/50' },
                { id: 'gift6', name: 'Car', value: 500, imageUrl: 'https://via.placeholder.com/50' },
                { id: 'gift7', name: 'Castle', value: 1000, imageUrl: 'https://via.placeholder.com/50' },
                { id: 'gift8', name: 'Island', value: 5000, imageUrl: 'https://via.placeholder.com/50' },
              ].map(gift => (
                <div 
                  key={gift.id}
                  className="flex flex-col items-center p-2 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700"
                  onClick={() => handleSendGift(gift)}
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
              <Button onClick={() => setShowGiftSelector(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 w-full max-w-md rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Share Stream</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowShareModal(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { name: 'Copy Link', icon: '🔗' },
                { name: 'Twitter', icon: '🐦' },
                { name: 'Facebook', icon: '👤' },
                { name: 'Instagram', icon: '📷' },
                { name: 'WhatsApp', icon: '💬' },
                { name: 'Telegram', icon: '✈️' },
                { name: 'Email', icon: '📧' },
                { name: 'Messages', icon: '💌' },
              ].map(option => (
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
              onClick={() => setShowShareModal(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveStreamPage;

