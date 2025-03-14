
import { Play, ThumbsUp, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Mock data - would come from API in production
const mockHighlights = [
  {
    id: "1",
    title: "Summer Fashion Haul",
    thumbnail: "https://placehold.co/360x200/333/FFF?text=Fashion+Haul",
    duration: "3:45",
    views: 1250,
    likes: 342,
    comments: 56
  },
  {
    id: "2",
    title: "Makeup Tutorial - Night Out Look",
    thumbnail: "https://placehold.co/360x200/333/FFF?text=Makeup+Tutorial",
    duration: "5:20",
    views: 875,
    likes: 243,
    comments: 32
  },
  {
    id: "3",
    title: "Best Tech Gadgets Under $50",
    thumbnail: "https://placehold.co/360x200/333/FFF?text=Tech+Gadgets",
    duration: "4:15",
    views: 1540,
    likes: 412,
    comments: 78
  },
  {
    id: "4",
    title: "Home Office Setup Guide",
    thumbnail: "https://placehold.co/360x200/333/FFF?text=Office+Setup",
    duration: "6:30",
    views: 925,
    likes: 267,
    comments: 45
  }
];

const StreamHighlights = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {mockHighlights.map((highlight) => (
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
