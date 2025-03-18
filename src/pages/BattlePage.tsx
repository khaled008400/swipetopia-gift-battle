
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BattleVideoPlayer from "@/components/battle/BattleVideoPlayer";
import BattleComments from "@/components/battle/BattleComments";
import BattleVoting from "@/components/battle/BattleVoting";
import BattleLeaderboard from "@/components/battle/BattleLeaderboard";
import BattleInfo from "@/components/battle/BattleInfo";
import BattleService from "@/services/battle.service";
import { useAuth } from "@/context/AuthContext";
import { Video, BattleVideo } from "@/types/video.types";
import { convertBattleVideosToVideos, createCompleteBattleVideo } from "@/utils/video-converters";

const BattlePage = () => {
  const { battleId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [battle, setBattle] = useState<any>(null);
  const [leftVideo, setLeftVideo] = useState<BattleVideo | null>(null);
  const [rightVideo, setRightVideo] = useState<BattleVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("comments");
  const [hasVoted, setHasVoted] = useState(false);
  const [relatedBattles, setRelatedBattles] = useState<any[]>([]);

  useEffect(() => {
    const fetchBattle = async () => {
      if (!battleId) return;
      
      try {
        setLoading(true);
        const battleData = await BattleService.getBattle(battleId);
        setBattle(battleData);
        
        // Set videos
        const leftVid = battleData.videos.find((v: any) => v.position === 'left');
        const rightVid = battleData.videos.find((v: any) => v.position === 'right');
        
        if (leftVid) {
          // Use utility function to create a complete BattleVideo with proper types
          setLeftVideo(createCompleteBattleVideo(leftVid, "left"));
        }
        
        if (rightVid) {
          // Use utility function to create a complete BattleVideo with proper types
          setRightVideo(createCompleteBattleVideo(rightVid, "right"));
        }
        
        // Check if user has voted
        if (user) {
          const userVote = await BattleService.getUserVote(battleId, user.id);
          setHasVoted(!!userVote);
        }
        
        // Get related battles
        const related = await BattleService.getRelatedBattles(battleId);
        setRelatedBattles(related);
        
        setError(null);
      } catch (err) {
        console.error("Error fetching battle:", err);
        setError("Failed to load battle");
      } finally {
        setLoading(false);
      }
    };
    
    fetchBattle();
  }, [battleId, user]);

  const handleVote = async (videoId: string) => {
    if (!user) {
      // Prompt login
      navigate("/login?redirect=" + encodeURIComponent(`/battle/${battleId}`));
      return;
    }
    
    if (!battleId) return;
    
    try {
      await BattleService.voteForVideo(battleId, videoId);
      setHasVoted(true);
      
      // Update battle data to reflect new vote
      const updatedBattle = await BattleService.getBattle(battleId);
      setBattle(updatedBattle);
      
      // Update videos with the same conversions as before
      const leftVid = updatedBattle.videos.find((v: any) => v.position === 'left');
      const rightVid = updatedBattle.videos.find((v: any) => v.position === 'right');
      
      if (leftVid) {
        setLeftVideo(createCompleteBattleVideo(leftVid, "left"));
      }
      
      if (rightVid) {
        setRightVideo(createCompleteBattleVideo(rightVid, "right"));
      }
    } catch (err) {
      console.error("Error voting:", err);
    }
  };

  const mapToBattleVideos = (videos: Video[]): BattleVideo[] => {
    // Convert regular videos to battle videos with necessary properties
    return videos.map(video => ({
      ...video,
      battle_id: "mock-battle-id", // Mock battle ID
      score: Math.floor(Math.random() * 100), // Mock score
      position: Math.random() > 0.5 ? 'left' : 'right' // Random position
    }));
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error || !battle) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Battle Not Found</h2>
        <p className="text-muted-foreground mb-6">{error || "This battle doesn't exist or has been removed."}</p>
        <Button onClick={() => navigate("/battles")}>Browse Battles</Button>
      </div>
    );
  }

  return (
    <div className="h-full bg-black text-white overflow-hidden">
      <div className="flex flex-col h-full">
        <div className="p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold">{battle.title || "Battle"}</h1>
            <Badge variant="secondary">{battle.category}</Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={battle.creator?.avatar_url} />
              <AvatarFallback>{battle.creator?.username?.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>{battle.creator?.username}</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <BattleVideoPlayer 
            leftVideo={leftVideo} 
            rightVideo={rightVideo}
            onVote={handleVote}
            hasVoted={hasVoted}
            votedFor={battle.userVote?.video_id}
          />
        </div>
        
        <div className="bg-background text-foreground border-t">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start px-4 pt-2">
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="voting">Voting</TabsTrigger>
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
              <TabsTrigger value="info">Info</TabsTrigger>
            </TabsList>
            
            <TabsContent value="comments" className="p-4 h-64 overflow-y-auto">
              <BattleComments battleId={battleId || ""} />
            </TabsContent>
            
            <TabsContent value="voting" className="p-4 h-64 overflow-y-auto">
              <BattleVoting 
                leftVideo={leftVideo} 
                rightVideo={rightVideo}
                onVote={handleVote}
                hasVoted={hasVoted}
              />
            </TabsContent>
            
            <TabsContent value="leaderboard" className="p-4 h-64 overflow-y-auto">
              <BattleLeaderboard battleId={battleId || ""} />
            </TabsContent>
            
            <TabsContent value="info" className="p-4 h-64 overflow-y-auto">
              <BattleInfo battle={battle} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default BattlePage;
