
import { Play, ThumbsUp, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useStreamHighlights, StreamHighlight } from "@/hooks/useStreamerData";
import { Skeleton } from "@/components/ui/skeleton";

interface StreamHighlightsProps {
  streamerId?: string;
}

const StreamHighlights = ({ streamerId }: StreamHighlightsProps) => {
  const { streamHighlights, isLoading, error } = useStreamHighlights(streamerId || '');

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

  if (!streamHighlights.length) {
    return <div className="text-muted-foreground">No stream highlights available</div>;
  }

  return (
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
  );
};

export default StreamHighlights;
