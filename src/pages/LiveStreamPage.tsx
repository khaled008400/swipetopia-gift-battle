import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import VideoFeed from "@/components/VideoFeed";
import BattleProgressIndicators from "@/components/battle/BattleProgressIndicators";
import { useBattleVideos } from "@/hooks/useBattleVideos";
import VideoActions from "@/components/video/VideoActions";
import { Link } from "react-router-dom";
import { ArrowLeft, Users, Gift, Zap, X, ShoppingBag } from "lucide-react";
import BattleModeSelector from "@/components/live/BattleModeSelector";
import ActiveStreamers from "@/components/live/ActiveStreamers";
import { useToast } from "@/components/ui/use-toast";
import LiveStreamService from "@/services/live-stream.service";
import { useLiveStreamRealtime, BattleRequest } from "@/hooks/useLiveStreamRealtime";
import { useAuth } from "@/context/AuthContext";
import BattleInterface from "@/components/live/BattleInterface";
import GiftAnimation from "@/components/live/GiftAnimation";
import LiveStreamIndicator from "@/components/live/LiveStreamIndicator";
import { useViewerPresence } from "@/hooks/useViewerPresence";
import StreamProducts from "@/components/live/StreamProducts";
import ProductTagger from "@/components/live/ProductTagger";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GiftService } from '@/services/streaming';

type BattleMode = 'normal' | '1v1' | '2v2';

const STREAMER_VIDEO_MAPPING: Record<string, string[]> = {
  "1": ["1", "3"],
  // dancequeen videos
  "2": ["3", "5"],
  // lipqueen videos
  "3": ["6", "2"],
  // styleicon videos
  "4": ["2", "4"],
  // beatmaker videos 
  "5": ["5", "1"] // gamerpro videos
};

interface GiftButtonProps {
  type: string;
  amount: number;
  onClick: () => void;
}

const LiveStreamPage = () => {
  const [battleMode, setBattleMode] = useState<BattleMode>('normal');
  const [selectedStreamerId, setSelectedStreamerId] = useState<string | null>(null);
  const [showGiftMenu, setShowGiftMenu] = useState<boolean>(false);
  const [showProductsMenu, setShowProductsMenu] = useState<boolean>(false);
  const [currentGiftAnimation, setCurrentGiftAnimation] = useState<any>(null);
  const [sidebarTab, setSidebarTab] = useState<'gifts' | 'products'>('gifts');
  const { toast } = useToast();
  const { user } = useAuth();
  const [battleRequests, setBattleRequests] = useState<BattleRequest[]>([]);
  const [isStreamerView, setIsStreamerView] = useState<boolean>(false);
  
  const {
    activeVideoIndex,
    setActiveVideoIndex,
    filteredVideos,
    setStreamerFilter
  } = useBattleVideos(true);
  
  const { viewerCount } = useViewerPresence(selectedStreamerId || '');
  
  const {
    incomingGifts,
    battleRequests: realtimeBattleRequests,
    activeBattle,
    streamScore,
    opponentScore
  } = useLiveStreamRealtime(selectedStreamerId || undefined);
  
  useEffect(() => {
    if (realtimeBattleRequests.length > 0) {
      setBattleRequests(realtimeBattleRequests);
    }
  }, [realtimeBattleRequests]);

  useEffect(() => {
    const checkIfStreamer = async () => {
      if (!user || !selectedStreamerId) {
        setIsStreamerView(false);
        return;
      }
      
      try {
        const { data } = await supabase
          .from('streams')
          .select('user_id')
          .eq('id', selectedStreamerId)
          .single();
          
        setIsStreamerView(data?.user_id === user.id);
      } catch (error) {
        setIsStreamerView(false);
      }
    };
    
    checkIfStreamer();
  }, [user, selectedStreamerId]);

  const handleStreamerSelect = (streamerId: string) => {
    setSelectedStreamerId(streamerId);
    const streamerVideoIds = STREAMER_VIDEO_MAPPING[streamerId] || [];
    setStreamerFilter(streamerVideoIds);
    setActiveVideoIndex(0);
    toast({
      title: "Joined Live Stream",
      description: "You're now watching this live stream",
      duration: 2000
    });
  };
  
  const handleSendGift = async (giftType: string, amount: number) => {
    if (!selectedStreamerId || !user) {
      toast({
        title: "Error",
        description: "You need to be logged in and select a streamer to send gifts.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await GiftService.sendGift(selectedStreamerId, giftType, amount, activeBattle);
      
      toast({
        title: "Gift Sent!",
        description: `You sent a ${giftType} gift worth ${amount} coins.`,
        duration: 2000
      });
      
      setShowGiftMenu(false);
    } catch (error) {
      console.error("Error sending gift:", error);
      toast({
        title: "Error",
        description: "Failed to send gift. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  useEffect(() => {
    if (incomingGifts.length > 0 && !currentGiftAnimation) {
      const latestGift = incomingGifts[0];
      setCurrentGiftAnimation({
        type: latestGift.gift_type,
        sender: latestGift.sender_username || 'A user',
        amount: latestGift.coins_amount
      });
    }
  }, [incomingGifts, currentGiftAnimation]);
  
  useEffect(() => {
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;
      if (diff > 50 && activeVideoIndex < filteredVideos.length - 1) {
        setActiveVideoIndex(prev => prev + 1);
      } else if (diff < -50 && activeVideoIndex > 0) {
        setActiveVideoIndex(prev => prev - 1);
      }
    };
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeVideoIndex, filteredVideos.length, setActiveVideoIndex]);
  
  const toggleProductsSidebar = () => {
    if (showGiftMenu) {
      setShowGiftMenu(false);
    }
    setShowProductsMenu(!showProductsMenu);
    setSidebarTab('products');
  };
  
  const toggleGiftsSidebar = () => {
    if (showProductsMenu) {
      setShowProductsMenu(false);
    }
    setShowGiftMenu(!showGiftMenu);
    setSidebarTab('gifts');
  };
  
  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden bg-gradient-to-b from-[#1A1F2C] to-black relative">
      {battleMode === 'normal' ? (
        <VideoFeed videos={filteredVideos} activeVideoIndex={activeVideoIndex} />
      ) : (
        <LiveBattleFeed videos={filteredVideos} activeVideoIndex={activeVideoIndex} mode={battleMode} />
      )}
      
      <BattleProgressIndicators videos={filteredVideos} activeIndex={activeVideoIndex} />

      <div className="absolute top-4 left-4 z-30 flex items-center">
        <Link to="/">
          <ArrowLeft className="h-6 w-6 text-white" />
        </Link>
      </div>

      <ActiveStreamers onStreamerSelect={handleStreamerSelect} selectedStreamerId={selectedStreamerId} />

      <div className="absolute top-28 right-4 z-30">
        <BattleModeSelector currentMode={battleMode} onModeChange={setBattleMode} />
      </div>
      
      <div className="absolute top-4 right-4 z-30 flex flex-col items-end space-y-2">
        {selectedStreamerId && (
          <>
            <LiveStreamIndicator viewerCount={viewerCount} />
            
            <div className="flex space-x-2">
              <button 
                onClick={toggleGiftsSidebar}
                className={`flex items-center px-3 py-1.5 rounded-full shadow-lg 
                  ${showGiftMenu ? 'bg-purple-600' : 'bg-gradient-to-r from-pink-500 to-purple-500'}`}
              >
                <Gift className="h-4 w-4 text-white mr-1" />
                <span className="text-white text-sm font-medium">Gifts</span>
              </button>
              
              <button 
                onClick={toggleProductsSidebar}
                className={`flex items-center px-3 py-1.5 rounded-full shadow-lg 
                  ${showProductsMenu ? 'bg-blue-600' : 'bg-gradient-to-r from-blue-500 to-cyan-500'}`}
              >
                <ShoppingBag className="h-4 w-4 text-white mr-1" />
                <span className="text-white text-sm font-medium">Shop</span>
              </button>
            </div>
          </>
        )}
      </div>
      
      {(showGiftMenu || showProductsMenu) && (
        <div className="absolute bottom-0 right-0 top-20 w-64 md:w-72 bg-black/80 backdrop-blur-md z-40 border-l border-white/20 flex flex-col">
          <div className="flex justify-between items-center p-3 border-b border-white/20">
            <h3 className="text-white font-medium">
              {sidebarTab === 'gifts' ? 'Send a Gift' : 'Shop Products'}
            </h3>
            <button 
              onClick={() => {
                setShowGiftMenu(false);
                setShowProductsMenu(false);
              }} 
              className="text-white/70"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <Tabs value={sidebarTab} onValueChange={(val) => setSidebarTab(val as 'gifts' | 'products')} className="flex-1 flex flex-col">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="gifts" onClick={() => {
                setShowGiftMenu(true);
                setShowProductsMenu(false);
              }}>
                <Gift className="h-4 w-4 mr-2" />
                Gifts
              </TabsTrigger>
              <TabsTrigger value="products" onClick={() => {
                setShowProductsMenu(true);
                setShowGiftMenu(false);
              }}>
                <ShoppingBag className="h-4 w-4 mr-2" />
                Shop
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="gifts" className="p-3 overflow-y-auto flex-1">
              <div className="grid grid-cols-3 gap-3">
                <GiftButton type="heart" amount={10} onClick={() => handleSendGift("heart", 10)} />
                <GiftButton type="star" amount={50} onClick={() => handleSendGift("star", 50)} />
                <GiftButton type="rocket" amount={100} onClick={() => handleSendGift("rocket", 100)} />
                <GiftButton type="crown" amount={200} onClick={() => handleSendGift("crown", 200)} />
                <GiftButton type="diamond" amount={500} onClick={() => handleSendGift("diamond", 500)} />
              </div>
            </TabsContent>
            
            <TabsContent value="products" className="flex-1 flex flex-col">
              <div className="p-3 border-b border-white/10 flex justify-between items-center">
                {isStreamerView && (
                  <ProductTagger 
                    streamId={selectedStreamerId || ''} 
                  />
                )}
                {!isStreamerView && (
                  <Badge variant="outline">Products for Sale</Badge>
                )}
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {selectedStreamerId && (
                  <StreamProducts 
                    streamId={selectedStreamerId} 
                    isStreamer={isStreamerView}
                  />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
      
      {filteredVideos[activeVideoIndex] && <VideoActions 
        likes={filteredVideos[activeVideoIndex].likes} 
        comments={filteredVideos[activeVideoIndex].comments} 
        shares={filteredVideos[activeVideoIndex].shares} 
        isLiked={filteredVideos[activeVideoIndex].isLiked || false} 
        onLike={() => {
          console.log('Video liked:', filteredVideos[activeVideoIndex]);
        }} 
      />}
      
      {battleRequests.length > 0 && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-md px-4 py-2 rounded-lg z-40 border border-purple-500/50">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="h-4 w-4 text-purple-500" />
            <span className="text-white font-medium">Battle Request</span>
          </div>
          
          <div className="flex gap-2 mt-2">
            <button 
              onClick={() => LiveStreamService.acceptBattle(battleRequests[0].id)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 px-3 py-1 rounded-md text-white text-sm"
            >
              Accept
            </button>
            <button 
              onClick={() => setBattleRequests(prev => prev.slice(1))}
              className="bg-gray-700 px-3 py-1 rounded-md text-white text-sm"
            >
              Decline
            </button>
          </div>
        </div>
      )}
      
      {activeBattle && selectedStreamerId && (
        <BattleInterface 
          streamId={selectedStreamerId}
          opponentId="opponent-id"
          opponentName="Challenger"
          battleId={activeBattle}
          onEndBattle={() => {
          }}
        />
      )}
      
      {currentGiftAnimation && (
        <GiftAnimation 
          type={currentGiftAnimation.type}
          sender={currentGiftAnimation.sender}
          amount={currentGiftAnimation.amount}
          onComplete={() => setCurrentGiftAnimation(null)}
        />
      )}

      {filteredVideos.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h2 className="text-white text-xl font-bold mb-2">No Live Streams</h2>
          <p className="text-gray-400 text-center px-8">
            There are no live streams at the moment. Please check back later or select a streamer.
          </p>
        </div>
      )}
    </div>
  );
};

const GiftButton = ({ type, amount, onClick }: GiftButtonProps) => {
  const giftIcons: Record<string, string> = {
    heart: "❤️",
    star: "⭐",
    rocket: "🚀",
    crown: "👑",
    diamond: "💎"
  };
  
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center bg-white/10 hover:bg-white/20 rounded-lg p-3 transition-colors"
    >
      <span className="text-2xl mb-1">{giftIcons[type]}</span>
      <span className="text-white text-sm">{type}</span>
      <div className="flex items-center mt-1">
        <Gift className="h-3 w-3 text-yellow-500 mr-1" />
        <span className="text-yellow-500 text-xs font-medium">{amount}</span>
      </div>
    </button>
  );
};

const LiveBattleFeed = ({
  videos,
  activeVideoIndex,
  mode
}: {
  videos: any[];
  activeVideoIndex: number;
  mode: BattleMode;
}) => {
  const activeVideo = videos[activeVideoIndex];
  if (!activeVideo) return null;
  return <div className="h-full w-full relative">
      {mode === '1v1' ? <div className="h-full w-full flex flex-col">
          <div className="h-1/2 w-full relative border-b-2 border-white/20">
            <div className="absolute top-2 left-2 z-10 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full text-white text-xs">
              {activeVideo.user.username}_1
            </div>
            <video src={activeVideo.url} className="h-full w-full object-cover" autoPlay loop muted playsInline />
          </div>
          <div className="h-1/2 w-full relative">
            <div className="absolute top-2 left-2 z-10 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full text-white text-xs">
              {activeVideo.user.username}_2
            </div>
            <video src={videos[(activeVideoIndex + 1) % videos.length].url} className="h-full w-full object-cover" autoPlay loop muted playsInline />
          </div>
        </div> : <div className="h-full w-full grid grid-cols-2 grid-rows-2 gap-1">
          <div className="relative">
            <div className="absolute top-2 left-2 z-10 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full text-white text-xs">
              Team A - {activeVideo.user.username}
            </div>
            <video src={activeVideo.url} className="h-full w-full object-cover" autoPlay loop muted playsInline />
          </div>
          
          <div className="relative">
            <div className="absolute top-2 left-2 z-10 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full text-white text-xs">
              Team A - Partner
            </div>
            <video src={videos[(activeVideoIndex + 1) % videos.length].url} className="h-full w-full object-cover" autoPlay loop muted playsInline />
          </div>
          
          <div className="relative">
            <div className="absolute top-2 left-2 z-10 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full text-white text-xs">
              Team B - Challenger
            </div>
            <video src={videos[(activeVideoIndex + 2) % videos.length].url} className="h-full w-full object-cover" autoPlay loop muted playsInline />
          </div>
          
          <div className="relative">
            <div className="absolute top-2 left-2 z-10 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full text-white text-xs">
              Team B - Partner
            </div>
            <video src={videos[(activeVideoIndex + 3) % videos.length].url} className="h-full w-full object-cover" autoPlay loop muted playsInline />
          </div>
        </div>}
      
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
        <div className="bg-black/40 backdrop-blur-md p-3 rounded-full">
          <span className="text-white font-bold animate-pulse">
            LIVE BATTLE
          </span>
        </div>
      </div>
      
      {mode !== 'normal' && <div className="absolute bottom-24 left-0 right-0 px-4 z-20 flex justify-center">
          <div className="flex space-x-4">
            <button className="bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-xl border border-white/20">
              Vote {mode === '1v1' ? activeVideo.user.username + '_1' : 'Team A'}
            </button>
            <button className="bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-xl border border-white/20">
              Vote {mode === '1v1' ? activeVideo.user.username + '_2' : 'Team B'}
            </button>
          </div>
        </div>}
      
      <div className="absolute top-14 right-4 z-20">
        <div className="flex items-center bg-black/40 backdrop-blur-md px-2 py-1 rounded-full">
          <Users className="h-4 w-4 text-red-500 mr-1" />
          <span className="text-white text-xs">{Math.floor(Math.random() * 1000) + 100}</span>
        </div>
      </div>
    </div>;
};

export default LiveStreamPage;
