
import { Play, ThumbsUp, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface StreamHighlight {
  id: string;
  title: string;
  thumbnail: string;
  video_url: string;
  duration: string;
  views: number;
  likes: number;
  comments: number;
}

interface StreamHighlightsProps {
  streamerId?: string;
}

const StreamHighlights = ({ streamerId }: StreamHighlightsProps) => {
  const [streamHighlights, setStreamHighlights] = useState<StreamHighlight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStreamHighlights = async () => {
      if (!streamerId) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("stream_highlights")
          .select("*")
          .eq("streamer_id", streamerId)
          .order("created_at", { ascending: false });

        if (error) throw error;
        
        setStreamHighlights(data || []);
      } catch (err) {
        console.error("Error fetching stream highlights:", err);
        setError("Failed to load stream highlights");
        toast({
          title: "Error",
          description: "Failed to load highlight videos",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStreamHighlights();
  }, [streamerId, toast]);

  const handleAddHighlight = () => {
    // This would open a modal to add a new highlight
    // Placeholder for now - would require a form and upload handling
    toast({
      title: "Feature Coming Soon",
      description: "Adding new highlights will be available soon!",
    });
  };

  if (error) {
    return <div className="text-red-500">Failed to load stream highlights</div>;
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-app-gray-dark overflow-hidden">
            <Skeleton className="h-40 w-full" />
            <CardContent className="p-3">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Highlight Videos</h2>
        <Button 
          onClick={handleAddHighlight}
          className="bg-app-yellow text-app-black hover:bg-app-yellow/90"
        >
          Add New Highlight
        </Button>
      </div>

      {!streamHighlights.length ? (
        <div className="text-center py-12 bg-app-gray-dark rounded-lg">
          <h3 className="text-lg font-medium mb-2">No Highlights Yet</h3>
          <p className="text-muted-foreground mb-6">
            Upload your best stream moments to showcase to your audience
          </p>
          <Button 
            onClick={handleAddHighlight}
            className="bg-app-yellow text-app-black hover:bg-app-yellow/90"
          >
            Upload Your First Highlight
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {streamHighlights.map((highlight: StreamHighlight) => (
            <Card key={highlight.id} className="bg-app-gray-dark overflow-hidden group cursor-pointer">
              <div className="relative">
                <img 
                  src={highlight.thumbnail} 
                  alt={highlight.title}
                  className="w-full aspect-video object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-app-yellow rounded-full p-3">
                    <Play className="h-5 w-5 text-app-black" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 px-2 py-0.5 rounded text-xs">
                  {highlight.duration}
                </div>
              </div>
              
              <CardContent className="p-3">
                <h3 className="font-medium line-clamp-2 mb-2">{highlight.title}</h3>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{highlight.views.toLocaleString()} views</span>
                  <div className="flex gap-3">
                    <div className="flex items-center">
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      {highlight.likes}
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="h-3 w-3 mr-1" />
                      {highlight.comments}
                    </div>
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
