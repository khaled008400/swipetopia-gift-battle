
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import VideoPlayer from '@/components/VideoPlayer';
import { BattleVideo, Video } from '@/types/video.types';
import { Loader2 } from 'lucide-react';

interface Battle {
  id: string;
  created_at: string;
  videos: BattleVideo[];
}

const BattlePage = () => {
  const { battleId } = useParams<{ battleId: string }>();
  const [battleData, setBattleData] = useState<Battle | null>(null);
  const [leftVideo, setLeftVideo] = useState<BattleVideo | null>(null);
  const [rightVideo, setRightVideo] = useState<BattleVideo | null>(null);
  const [videoData, setVideoData] = useState<BattleVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBattle = async () => {
      setIsLoading(true);
      try {
        if (!battleId) {
          setError('Battle ID is missing');
          return;
        }

        const { data, error } = await supabase
          .from('battles')
          .select(`
            id,
            created_at,
            videos (
              id,
              title,
              description,
              video_url,
              thumbnail_url,
              user_id,
              created_at,
              updated_at,
              view_count,
              likes_count,
              comments_count,
              shares_count,
              is_live,
              is_private,
              duration,
              category,
              battle_id,
              score,
              position,
              url,
              profiles (
                username,
                avatar_url
              )
            )
          `)
          .eq('id', battleId)
          .single();

        if (error) {
          console.error('Error fetching battle:', error);
          setError(error.message);
          return;
        }

        // Transform the data to ensure it matches the Battle type
        const transformedData: Battle = {
          id: data.id,
          created_at: data.created_at,
          videos: data.videos.map((video: any) => ({
            ...video,
            user: {
              username: video.profiles?.username || 'Unknown',
              avatar: video.profiles?.avatar_url || '',
              avatar_url: video.profiles?.avatar_url || ''
            }
          }))
        };

        setBattleData(transformedData);
      } catch (err: any) {
        console.error('Error fetching battle:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBattle();
  }, [battleId]);

  useEffect(() => {
    if (battleData && battleData.videos) {
      setLeftVideo(battleData.videos.find(v => v.position === 'left') || null);
      setRightVideo(battleData.videos.find(v => v.position === 'right') || null);
      setVideoData(battleData.videos);
    }
  }, [battleData]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!battleData || !leftVideo || !rightVideo) {
    return <div>No battle data found.</div>;
  }

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Battle Page</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Left Video</h2>
          {leftVideo && leftVideo.url && (
            <VideoPlayer videoUrl={leftVideo.url} />
          )}
          <p>Title: {leftVideo.title}</p>
          <p>Score: {leftVideo.score}</p>
          {leftVideo.profiles && <p>Creator: {leftVideo.profiles.username}</p>}
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Right Video</h2>
          {rightVideo && rightVideo.url && (
            <VideoPlayer videoUrl={rightVideo.url} />
          )}
          <p>Title: {rightVideo.title}</p>
          <p>Score: {rightVideo.score}</p>
          {rightVideo.profiles && <p>Creator: {rightVideo.profiles.username}</p>}
        </div>
      </div>
    </div>
  );
};

export default BattlePage;
