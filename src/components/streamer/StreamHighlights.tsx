
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Heart, MessageSquare } from "lucide-react";

interface Highlight {
  id: string;
  title: string;
  thumbnail: string;
  video_url: string;
  duration: string;
  views: number;
  likes: number;
  comments: number;
  created_at: string;
}

const StreamHighlights = () => {
  const { user } = useAuth();
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchHighlights();
    }
  }, [user]);

  const fetchHighlights = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('stream_highlights')
        .select('*')
        .eq('streamer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setHighlights(data || []);
    } catch (error) {
      console.error("Error fetching highlights:", error);
      toast({
        title: "Error",
        description: "Failed to load stream highlights.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Stream Highlights</h2>
          <Skeleton className="h-10 w-[120px]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-[180px] w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-5 w-[80%] mb-2" />
                <Skeleton className="h-4 w-[60%]" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Stream Highlights</h2>
        <Button className="bg-app-yellow text-app-black hover:bg-app-yellow/90">
          <Plus className="mr-2 h-4 w-4" /> Add Highlight
        </Button>
      </div>

      {highlights.length === 0 ? (
        <div className="text-center py-8 bg-app-gray-dark rounded-lg">
          <p className="text-gray-400 mb-4">You don't have any highlights yet.</p>
          <Button className="bg-app-yellow text-app-black hover:bg-app-yellow/90">
            <Plus className="mr-2 h-4 w-4" /> Create Your First Highlight
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {highlights.map((highlight) => (
            <Card key={highlight.id} className="overflow-hidden bg-app-gray-dark border-app-gray-light">
              <div className="relative">
                <AspectRatio ratio={16 / 9}>
                  <img
                    src={highlight.thumbnail}
                    alt={highlight.title}
                    className="w-full h-full object-cover"
                  />
                </AspectRatio>
                <div className="absolute bottom-2 right-2 bg-black/70 rounded px-1.5 py-0.5 text-xs text-white">
                  {highlight.duration}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-white mb-1 line-clamp-1">{highlight.title}</h3>
                <div className="flex items-center text-xs text-gray-400 mt-2">
                  <span className="mr-3">{highlight.views.toLocaleString()} views</span>
                  <div className="flex items-center mr-3">
                    <Heart className="h-3 w-3 mr-1" />
                    <span>{highlight.likes.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    <span>{highlight.comments.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StreamHighlights;
