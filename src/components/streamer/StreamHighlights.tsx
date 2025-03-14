
import { useState, useEffect } from "react";
import { Play, Heart, MessageCircle, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import { useStreamHighlights, StreamHighlight } from "@/hooks/useStreamerData";

interface StreamHighlightsProps {
  streamerId?: string;
}

const StreamHighlights = ({ streamerId }: StreamHighlightsProps) => {
  const { streamHighlights, isLoading, error } = useStreamHighlights(streamerId || '');
  
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
  
  if (streamHighlights.length === 0) {
    return <div className="text-muted-foreground text-center py-8">No highlights available</div>;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {streamHighlights.map((highlight) => (
        <Card key={highlight.id} className="overflow-hidden bg-app-gray-dark border-app-gray-light hover:border-app-yellow transition-colors">
          <div className="relative">
            <AspectRatio ratio={16/9}>
              <img 
                src={highlight.thumbnail} 
                alt={highlight.title}
                className="object-cover w-full h-full"
              />
            </AspectRatio>
            <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
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
              <div className="flex items-center">
                <Heart className="h-3 w-3 mr-1" />
                {highlight.likes.toLocaleString()}
              </div>
              <div className="flex items-center">
                <MessageCircle className="h-3 w-3 mr-1" />
                {highlight.comments.toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StreamHighlights;
