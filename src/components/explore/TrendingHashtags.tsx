import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';

interface Creator {
  id: string;
  username: string;
  avatar_url: string;
}

interface Hashtag {
  id: string;
  name: string;
  count: number;
  creators: Creator[];
}

const TrendingHashtags: React.FC = () => {
  const [popularHashtags, setPopularHashtags] = useState<Hashtag[]>([]);
  const [topCreators, setTopCreators] = useState<Creator[]>([]);

  useEffect(() => {
    fetchHashtags();
    fetchTopCreators();
  }, []);

  const fetchHashtags = async () => {
    // In a real app, this would come from an API
    // For now, we'll use mock data
    const mockHashtags: Hashtag[] = [
      {
        id: '1',
        name: 'dance',
        count: 45.2,
        creators: [
          { id: '1', username: 'dancer1', avatar_url: 'https://i.pravatar.cc/150?u=dancer1' },
          { id: '2', username: 'dancer2', avatar_url: 'https://i.pravatar.cc/150?u=dancer2' },
        ]
      },
      {
        id: '2',
        name: 'comedy',
        count: 32.8,
        creators: [
          { id: '3', username: 'comedian1', avatar_url: 'https://i.pravatar.cc/150?u=comedian1' },
          { id: '4', username: 'comedian2', avatar_url: 'https://i.pravatar.cc/150?u=comedian2' },
        ]
      },
      {
        id: '3',
        name: 'fashion',
        count: 28.5,
        creators: [
          { id: '5', username: 'fashionista', avatar_url: 'https://i.pravatar.cc/150?u=fashionista' },
        ]
      },
      {
        id: '4',
        name: 'cooking',
        count: 22.1,
        creators: [
          { id: '6', username: 'chef1', avatar_url: 'https://i.pravatar.cc/150?u=chef1' },
          { id: '7', username: 'chef2', avatar_url: 'https://i.pravatar.cc/150?u=chef2' },
        ]
      },
      {
        id: '5',
        name: 'fitness',
        count: 19.7,
        creators: [
          { id: '8', username: 'trainer1', avatar_url: 'https://i.pravatar.cc/150?u=trainer1' },
        ]
      }
    ];
    
    setPopularHashtags(mockHashtags);
  };

  const fetchTopCreators = async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .order('followers', { ascending: false })
        .limit(5);
        
      if (data && data.length > 0) {
        setTopCreators(data);
      }
    } catch (error) {
      console.error('Error fetching top creators:', error);
    }
  };

  return (
    <div className="bg-app-gray-dark rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Trending Hashtags</h3>
      
      {popularHashtags.map((tag) => (
        <div key={tag.id} className="flex items-center gap-2 mb-3">
          <div className="font-medium text-white">#{tag.name}</div>
          <div className="text-xs text-gray-400">{tag.count}k</div>
          {tag.creators && tag.creators.length > 0 && (
            <div className="flex -space-x-2 ml-auto">
              {tag.creators.map((creator, idx) => (
                <Avatar key={idx} className="border-2 border-app-black w-6 h-6">
                  <AvatarImage src={creator.avatar_url} />
                  <AvatarFallback>{creator.username?.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
            </div>
          )}
        </div>
      ))}
      
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Top Creators</h3>
        {topCreators.map((creator) => (
          <div key={creator.id} className="flex items-center gap-3 mb-3">
            <Avatar className="border-2 border-app-black w-8 h-8">
              <AvatarImage src={creator.avatar_url} />
              <AvatarFallback>{creator.username?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="font-medium text-white">@{creator.username}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingHashtags;
