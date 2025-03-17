
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import LiveStreamMainContent from '@/components/live-stream/LiveStreamMainContent';
import LiveStreamSidebar from '@/components/live-stream/LiveStreamSidebar';
import LiveStreamBottomBar from '@/components/live-stream/LiveStreamBottomBar';
import LiveStreamGiftModal from '@/components/live-stream/LiveStreamGiftModal';
import LiveStreamShareModal from '@/components/live-stream/LiveStreamShareModal';
import { LiveStreamComment, LiveStreamGift, LiveStreamInfo } from '@/types/livestream.types';
import { Loader2 } from 'lucide-react';

const LiveStreamPage: React.FC = () => {
  const { streamId } = useParams<{ streamId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [streamInfo, setStreamInfo] = useState<LiveStreamInfo | null>(null);
  const [comments, setComments] = useState<LiveStreamComment[]>([]);
  const [viewers, setViewers] = useState<number>(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showGiftSelector, setShowGiftSelector] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [recentGifts, setRecentGifts] = useState<LiveStreamGift[]>([]);
  const [activeTab, setActiveTab] = useState('chat');
  const [newComment, setNewComment] = useState('');
  
  // Mock data for development
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
        <button onClick={() => navigate('/')}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Main Content */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        <LiveStreamMainContent 
          streamInfo={streamInfo} 
          viewers={viewers}
          recentGifts={recentGifts}
        />
        
        <LiveStreamSidebar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          comments={comments}
          handleSendComment={handleSendComment}
          newComment={newComment}
          setNewComment={setNewComment}
          streamInfo={streamInfo}
        />
      </div>
      
      <LiveStreamBottomBar 
        isLiked={isLiked}
        handleLikeStream={handleLikeStream}
        setShowShareModal={setShowShareModal}
        setShowGiftSelector={setShowGiftSelector}
      />
      
      {showGiftSelector && (
        <LiveStreamGiftModal
          onClose={() => setShowGiftSelector(false)}
          onSendGift={handleSendGift}
        />
      )}
      
      {showShareModal && (
        <LiveStreamShareModal 
          onClose={() => setShowShareModal(false)} 
        />
      )}
    </div>
  );
};

export default LiveStreamPage;
