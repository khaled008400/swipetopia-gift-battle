
import { useState, useEffect } from 'react';
import { BattleVideo } from '@/types/video.types';

export function useBattleVideos(battleId?: string) {
  const [videos, setVideos] = useState<BattleVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [votingEndsAt, setVotingEndsAt] = useState<string>(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  );
  const [votesRemaining, setVotesRemaining] = useState(3);
  
  // For video filtering/sorting
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [liveVideosOnly, setLiveVideosOnly] = useState(false);
  const [streamerFilter, setStreamerFilter] = useState<string | null>(null);
  const [filteredVideos, setFilteredVideos] = useState<BattleVideo[]>([]);

  useEffect(() => {
    const fetchBattleVideos = async () => {
      try {
        setIsLoading(true);
        
        // Mock data for battle videos
        const mockVideos: BattleVideo[] = [
          {
            id: '1',
            title: 'Dance Challenge',
            videoUrl: 'https://example.com/video1.mp4',
            thumbnailUrl: 'https://example.com/thumbnail1.jpg',
            creator: {
              id: '101',
              username: 'DanceQueen',
              avatar: 'https://example.com/avatar1.jpg'
            },
            votes: 124,
            isLive: true,
            viewerCount: 1250
          },
          {
            id: '2',
            title: 'Singing Performance',
            videoUrl: 'https://example.com/video2.mp4',
            thumbnailUrl: 'https://example.com/thumbnail2.jpg',
            creator: {
              id: '102',
              username: 'VocalMaster',
              avatar: 'https://example.com/avatar2.jpg'
            },
            votes: 98,
            isLive: false,
            viewerCount: 0
          }
        ];
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setVideos(mockVideos);
        setFilteredVideos(mockVideos);
      } catch (err) {
        console.error('Error fetching battle videos:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch battle videos'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBattleVideos();
  }, [battleId]);
  
  // Filter videos based on current filters
  useEffect(() => {
    let filtered = [...videos];
    
    if (liveVideosOnly) {
      filtered = filtered.filter(video => video.isLive);
    }
    
    if (streamerFilter) {
      filtered = filtered.filter(video => video.creator.id === streamerFilter);
    }
    
    setFilteredVideos(filtered);
  }, [videos, liveVideosOnly, streamerFilter]);
  
  // Function to cast a vote for a video
  const castVote = async (videoId: string) => {
    if (votesRemaining <= 0) {
      return false;
    }
    
    // Update the videos array to increment votes for the selected video
    setVideos(prev => 
      prev.map(video => 
        video.id === videoId 
          ? { ...video, votes: video.votes + 1 } 
          : video
      )
    );
    
    // Decrement available votes
    setVotesRemaining(prev => prev - 1);
    
    return true;
  };
  
  return {
    videos,
    isLoading,
    error,
    votingEndsAt,
    votesRemaining,
    castVote,
    activeVideoIndex,
    setActiveVideoIndex,
    liveVideosOnly,
    filteredVideos,
    setStreamerFilter
  };
}
