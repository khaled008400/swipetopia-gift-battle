
import React, { useEffect, useState } from 'react';
import TrendingVideosSection from '@/components/TrendingVideosSection';
import PopularLiveSection from '@/components/PopularLiveSection';
import SearchBar from '@/components/SearchBar';
import VideoFeed from '@/components/VideoFeed';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Video } from '@/types/video.types';

interface PopularUser {
  username: string;
  avatar_url: string;
}

const HomePage = () => {
  const [trendingVideos, setTrendingVideos] = useState<Video[]>([]);
  const [liveStreams, setLiveStreams] = useState<any[]>([]);
  const [popularUsers, setPopularUsers] = useState<PopularUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [videos, setVideos] = useState<Video[]>([]);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch popular users
        const { data: usersData, error: usersError } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .order('followers', { ascending: false })
          .limit(5);

        if (usersError) {
          console.error('Error fetching popular users:', usersError);
          toast.error('Could not load popular users');
        } else {
          setPopularUsers(usersData || []);
        }
        
        // Fetch trending videos
        const { data: videosData, error: videosError } = await supabase
          .from('videos')
          .select(`
            id, 
            title, 
            description, 
            video_url,
            thumbnail_url,
            likes_count,
            comments_count,
            shares_count,
            view_count,
            hashtags,
            is_live,
            created_at,
            user_id,
            profiles:user_id(username, avatar_url)
          `)
          .order('created_at', { ascending: false })
          .limit(50);

        if (videosError) {
          console.error('Error fetching videos:', videosError);
          toast.error('Could not load videos');
        } else {
          const mappedVideos = (videosData || []).map(video => ({
            ...video,
            // Ensure required fields for components are present
            url: video.video_url,
            likes: video.likes_count || 0,
            comments: video.comments_count || 0,
            shares: video.shares_count || 0
          }));
          setTrendingVideos(mappedVideos);
          setVideos(mappedVideos);
        }

        // Fetch live streams
        const { data: liveData, error: liveError } = await supabase
          .from('streams')
          .select(`
            id,
            title,
            thumbnail_url,
            viewer_count,
            created_at,
            user_id,
            profiles:user_id(username, avatar_url)
          `)
          .eq('status', 'live')
          .order('viewer_count', { ascending: false })
          .limit(10);

        if (liveError) {
          console.error('Error fetching live streams:', liveError);
          toast.error('Could not load live streams');
        } else {
          setLiveStreams(liveData || []);
        }

      } catch (error) {
        console.error('Error in data fetching:', error);
        toast.error('Something went wrong');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Create mock creators for PopularLiveSection from liveStreams
  const creators = liveStreams.map(stream => ({
    id: stream.id,
    username: stream.profiles?.username || 'User',
    avatar: stream.profiles?.avatar_url || '',
    isLive: true,
    title: stream.title,
    thumbnailUrl: stream.thumbnail_url,
    viewers: stream.viewer_count
  }));

  return (
    <div className="pb-16 bg-black min-h-screen">
      <div className="sticky top-0 z-20 bg-black">
        <SearchBar />
      </div>

      {popularUsers.length > 0 && (
        <div className="flex overflow-x-auto py-4 px-4 gap-4 hide-scrollbar">
          {popularUsers.map((user, index) => (
            <div key={index} className="flex flex-col items-center min-w-[60px]">
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-[2px]">
                <img 
                  src={user.avatar_url || '/placeholder.svg'} 
                  alt={user.username} 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="text-white text-xs mt-1 truncate w-16 text-center">
                {user.username}
              </span>
            </div>
          ))}
        </div>
      )}
      
      <TrendingVideosSection videos={trendingVideos} />
      <PopularLiveSection creators={creators} />
      
      <VideoFeed videos={videos} activeVideoIndex={activeVideoIndex} />
    </div>
  );
};

export default HomePage;
