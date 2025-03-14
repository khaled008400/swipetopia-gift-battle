
import { useState, useEffect } from "react";
import { Play, Heart, MessageCircle, Eye, Share2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import { useStreamHighlights, StreamHighlight } from "@/hooks/useStreamerData";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface StreamHighlightsProps {
  streamerId?: string;
}

interface LikeState {
  [key: string]: boolean;
}

const StreamHighlights = ({ streamerId }: StreamHighlightsProps) => {
  const { streamHighlights, isLoading, error } = useStreamHighlights(streamerId || '');
  const [likedVideos, setLikedVideos] = useState<LikeState>({});
  const [highlightData, setHighlightData] = useState<StreamHighlight[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Update local highlights data when the fetched data changes
  useEffect(() => {
    if (streamHighlights) {
      setHighlightData(streamHighlights);
    }
  }, [streamHighlights]);

  // Simulate a view count increment when user clicks play
  const handlePlay = async (highlightId: string) => {
    // In a real app, this would be handled by a server-side view counting mechanism
    // For demo purposes, we're directly updating the highlight record

    try {
      // Find the current highlight
      const currentHighlight = highlightData.find(h => h.id === highlightId);
      if (!currentHighlight) return;

      // Optimistically update the UI
      setHighlightData(prev => 
        prev.map(h => 
          h.id === highlightId 
            ? {...h, views: h.views + 1} 
            : h
        )
      );

      // Update the views count in Supabase
      const { error } = await supabase
        .from('stream_highlights')
        .update({ views: currentHighlight.views + 1 })
        .eq('id', highlightId);

      if (error) throw error;
    } catch (err) {
      console.error("Error updating view count:", err);
      toast({
        title: "Error",
        description: "Failed to update view count",
        variant: "destructive",
      });
    }
  };

  // Handle like/unlike action
  const handleLike = async (highlightId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to like videos",
        variant: "destructive",
      });
      return;
    }

    try {
      const isLiked = likedVideos[highlightId];
      
      // Find the current highlight
      const currentHighlight = highlightData.find(h => h.id === highlightId);
      if (!currentHighlight) return;

      // Optimistically update UI
      setLikedVideos(prev => ({
        ...prev,
        [highlightId]: !isLiked
      }));

      setHighlightData(prev => 
        prev.map(h => 
          h.id === highlightId 
            ? {...h, likes: isLiked ? h.likes - 1 : h.likes + 1} 
            : h
        )
      );

      if (isLiked) {
        // Remove like
        const { error } = await supabase
          .from('video_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('video_id', highlightId);

        if (error) throw error;
      } else {
        // Add like
        const { error } = await supabase
          .from('video_likes')
          .insert({
            user_id: user.id,
            video_id: highlightId
          });

        if (error) throw error;
      }

      // Update the likes count in the highlight record
      await supabase
        .from('stream_highlights')
        .update({ 
          likes: isLiked ? currentHighlight.likes - 1 : currentHighlight.likes + 1 
        })
        .eq('id', highlightId);

    } catch (err) {
      console.error("Error handling like:", err);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    }
  };

  // When user is authenticated, load their liked status
  useEffect(() => {
    if (!user) return;

    const fetchLikedStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('video_likes')
          .select('video_id')
          .eq('user_id', user.id);

        if (error) throw error;

        const likes: LikeState = {};
        data.forEach(item => {
          likes[item.video_id] = true;
        });

        setLikedVideos(likes);
      } catch (err) {
        console.error("Error fetching liked status:", err);
      }
    };

    fetchLikedStatus();
  }, [user]);
  
  const shareHighlight = (highlight: StreamHighlight) => {
    if (navigator.share) {
      navigator.share({
        title: highlight.title,
        text: 'Check out this great stream highlight!',
        url: highlight.video_url,
      })
      .then(() => {
        toast({
          title: "Shared successfully",
          description: "Thanks for sharing this content!",
        });
      })
      .catch(error => {
        console.error("Error sharing:", error);
      });
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(highlight.video_url)
        .then(() => {
          toast({
            title: "Link copied",
            description: "Video link copied to clipboard",
          });
        })
        .catch(error => {
          console.error("Error copying:", error);
        });
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="overflow-hidden bg-app-gray-dark border-app-gray-light">
            <Skeleton className="h-48 w-full" />
            <CardContent className="p-4">
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  if (error) {
    return <div className="text-red-500">Failed to load stream highlights</div>;
  }
  
  if (highlightData.length === 0) {
    return <div className="text-muted-foreground text-center py-8">No highlights available</div>;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {highlightData.map((highlight) => (
        <Card key={highlight.id} className="overflow-hidden bg-app-gray-dark border-app-gray-light hover:border-app-yellow transition-colors">
          <div className="relative">
            <AspectRatio ratio={16/9}>
              <img 
                src={highlight.thumbnail} 
                alt={highlight.title}
                className="object-cover w-full h-full"
              />
            </AspectRatio>
            <div 
              className="absolute inset-0 bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
              onClick={() => handlePlay(highlight.id)}
            >
              <div className="rounded-full bg-app-yellow p-3">
                <Play className="h-6 w-6 text-app-black" />
              </div>
            </div>
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded text-xs">
              {highlight.duration}
            </div>
          </div>
          
          <CardContent className="p-4">
            <h3 className="font-medium text-sm mb-2 line-clamp-2">{highlight.title}</h3>
            <div className="flex text-xs text-muted-foreground gap-3">
              <div className="flex items-center">
                <Eye className="h-3 w-3 mr-1" />
                {highlight.views.toLocaleString()}
              </div>
              <div 
                className={`flex items-center cursor-pointer ${likedVideos[highlight.id] ? 'text-red-500' : ''}`}
                onClick={() => handleLike(highlight.id)}
              >
                <Heart className={`h-3 w-3 mr-1 ${likedVideos[highlight.id] ? 'fill-red-500' : ''}`} />
                {highlight.likes.toLocaleString()}
              </div>
              <div className="flex items-center">
                <MessageCircle className="h-3 w-3 mr-1" />
                {highlight.comments.toLocaleString()}
              </div>
              <div 
                className="flex items-center cursor-pointer ml-auto" 
                onClick={() => shareHighlight(highlight)}
              >
                <Share2 className="h-3 w-3" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StreamHighlights;
