import { TrendingUp, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { PopularLiveSection } from "@/components/explore/PopularLiveSection";
import { TrendingVideosSection } from "@/components/explore/TrendingVideosSection";

const TrendingHashtags = () => {
  const [hashtags, setHashtags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creators, setCreators] = useState<any[]>([]);
  const [trendingVideos, setTrendingVideos] = useState<any[]>([]);
  const [topCreators, setTopCreators] = useState<any[]>([]);
  const [trendingCreators, setTrendingCreators] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch hashtags (could be from video descriptions)
        const { data: videos } = await supabase
          .from('short_videos')
          .select('description, id, view_count, thumbnail_url, title')
          .order('view_count', { ascending: false })
          .limit(10);
          
        // Extract hashtags from video descriptions
        const extractedHashtags: {tag: string, count: number}[] = [];
        const hashtagMap = new Map();
        
        videos?.forEach(video => {
          if (video.description) {
            const matches = video.description.match(/#(\w+)/g);
            if (matches) {
              matches.forEach((tag: string) => {
                const count = hashtagMap.get(tag) || 0;
                hashtagMap.set(tag, count + 1);
              });
            }
          }
        });
        
        hashtagMap.forEach((count, tag) => {
          extractedHashtags.push({ tag, count });
        });
        
        setHashtags(extractedHashtags.sort((a, b) => b.count - a.count).slice(0, 10));
        
        // Fetch live streamers for popular live section
        const { data: streams } = await supabase
          .from('streams')
          .select(`
            id, 
            title, 
            viewer_count,
            profiles:user_id (
              id, 
              username, 
              avatar_url
            )
          `)
          .eq('status', 'live')
          .order('viewer_count', { ascending: false })
          .limit(5);
          
        // Fix array access by mapping each stream individually
        const liveCreators = streams?.map(stream => ({
          id: stream.id,
          name: stream.profiles ? stream.profiles.username || 'Anonymous' : 'Anonymous',
          avatar: stream.profiles ? stream.profiles.avatar_url || '/placeholder.svg' : '/placeholder.svg',
          viewerCount: stream.viewer_count || 0,
          title: stream.title
        })) || [];
        
        setCreators(liveCreators);
        
        // Fetch trending videos
        const { data: trendingVids } = await supabase
          .from('short_videos')
          .select(`
            id,
            title,
            thumbnail_url,
            view_count,
            profiles:user_id (
              username,
              avatar_url
            )
          `)
          .order('view_count', { ascending: false })
          .limit(5);
          
        setTrendingVideos(trendingVids?.map(video => ({
          id: video.id,
          thumbnail: video.thumbnail_url || `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/300/500`,
          username: video.profiles?.username || 'Anonymous',
          viewCount: video.view_count || 0,
          title: video.title
        })) || []);
        
        // Fetch top creators
        const { data: topCreatorsData } = await supabase
          .from('users')
          .select('id, username, avatar_url')
          .order('view_count', { ascending: false })
          .limit(5);
        
        handleTopCreatorsData(topCreatorsData);
        
        // Fetch trending creators
        const { data: trendingCreatorsData } = await supabase
          .from('users')
          .select('id, username, avatar_url')
          .order('view_count', { ascending: false })
          .limit(5);
        
        handleTrendingCreatorsData(trendingCreatorsData);
        
      } catch (error) {
        console.error("Error fetching explore data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleTopCreatorsData = (data: any) => {
    if (data && Array.isArray(data)) {
      const creators = data.map(item => ({
        id: item.id,
        username: item.username,
        avatar_url: item.avatar_url
      }));
      setTopCreators(creators);
    }
  };

  const handleTrendingCreatorsData = (data: any) => {
    if (data && Array.isArray(data)) {
      const creators = data.map(item => ({
        username: item.username,
        avatar_url: item.avatar_url
      }));
      setTrendingCreators(creators);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center mb-2">
          <TrendingUp className="w-5 h-5 mr-2 text-app-yellow" />
          <h2 className="text-lg font-medium">Trending Hashtags</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-full" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-lg mt-8" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <PopularLiveSection creators={creators} />
      
      <TrendingVideosSection videos={trendingVideos} />
      
      <div>
        <div className="flex items-center mb-4">
          <TrendingUp className="w-5 h-5 mr-2 text-app-yellow" />
          <h2 className="text-lg font-medium">Trending Hashtags</h2>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {hashtags.length > 0 ? (
            hashtags.map((tag, index) => (
              <div 
                key={index} 
                className="px-3 py-1.5 bg-gradient-to-r from-app-yellow to-amber-500 rounded-full text-app-black font-medium text-sm flex items-center"
              >
                #{tag.tag.replace('#', '')}
                <span className="ml-1.5 bg-app-black bg-opacity-20 px-1.5 rounded-full text-xs">
                  {tag.count}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No trending hashtags found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrendingHashtags;
