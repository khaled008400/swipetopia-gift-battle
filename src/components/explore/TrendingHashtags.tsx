
import { Hash, ChevronRight, Activity, Video } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const TrendingHashtags = () => {
  // Mock data for trending hashtags
  const trendingHashtags = [
    { name: "dance", count: "1.2M", videos: 12500 },
    { name: "viral", count: "986K", videos: 8700 },
    { name: "challenge", count: "752K", videos: 6300 },
    { name: "music", count: "684K", videos: 5900 },
    { name: "comedy", count: "547K", videos: 4800 },
  ];
  
  // Mock data for trending categories
  const trendingCategories = [
    { name: "Live Streams", icon: Activity },
    { name: "Latest Videos", icon: Video },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">Trending Hashtags</h2>
          <Button variant="ghost" className="text-sm text-gray-400">
            See all
          </Button>
        </div>
        
        <div className="space-y-2">
          {trendingHashtags.map((tag, index) => (
            <Card key={index} className="bg-app-gray-dark border-none p-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-app-gray flex items-center justify-center mr-3">
                    <Hash className="h-5 w-5 text-app-yellow" />
                  </div>
                  <div>
                    <h3 className="font-medium">#{tag.name}</h3>
                    <p className="text-xs text-gray-400">{tag.count} views • {tag.videos} videos</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </Card>
          ))}
        </div>
      </div>
      
      <Separator className="bg-app-gray-dark" />
      
      <div>
        <h2 className="text-xl font-semibold mb-3">Explore Categories</h2>
        <div className="grid grid-cols-2 gap-3">
          {trendingCategories.map((category, index) => (
            <Card key={index} className="bg-app-gray-dark border-none p-4">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-app-gray flex items-center justify-center mb-2">
                  <category.icon className="h-6 w-6 text-app-yellow" />
                </div>
                <h3 className="font-medium text-center">{category.name}</h3>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingHashtags;
