// battle.service.ts

// Fix the array access in the getRelatedBattles method
const getRelatedBattles = async (battleId: string) => {
  try {
    // This is a placeholder implementation
    // In a real scenario, you'd fetch related battles from your API
    const mockRelatedBattles = [
      {
        id: 'battle-1',
        title: 'Dance Battle Challenge',
        creator: [{ username: 'dancer1', avatar_url: '/avatars/dancer1.jpg' }],
        thumbnail_url: '/thumbnails/dance.jpg'
      },
      {
        id: 'battle-2',
        title: 'Rap Battle Showdown',
        creator: [{ username: 'rapper1', avatar_url: '/avatars/rapper1.jpg' }],
        thumbnail_url: '/thumbnails/rap.jpg'
      }
    ];

    // Fix array access - each item in the array has an id property
    return mockRelatedBattles.filter(battle => battle.id !== battleId);
  } catch (error) {
    console.error('Error fetching related battles:', error);
    return [];
  }
};

const getBattle = async (battleId: string) => {
  try {
    // Mock implementation - replace with actual API call
    const mockBattle = {
      id: battleId,
      title: 'Epic Dance Battle',
      category: 'Dance',
      creator: {
        username: 'battle_master',
        avatar_url: '/avatars/battle_master.jpg'
      },
      videos: [
        {
          id: 'video-1',
          battle_id: battleId,
          user_id: 'user-1',
          url: 'https://example.com/video1.mp4',
          thumbnail_url: '/thumbnails/video1.jpg',
          likes_count: 120,
          view_count: 5000,
          position: 'left'
        },
        {
          id: 'video-2',
          battle_id: battleId,
          user_id: 'user-2',
          url: 'https://example.com/video2.mp4',
          thumbnail_url: '/thumbnails/video2.jpg',
          likes_count: 150,
          view_count: 6200,
          position: 'right'
        }
      ]
    };

    return mockBattle;
  } catch (error) {
    console.error('Error fetching battle:', error);
    throw error;
  }
};

const getUserVote = async (battleId: string, userId: string) => {
  try {
    // Mock implementation - replace with actual API call
    // Simulating that the user has not voted
    return null;
  } catch (error) {
    console.error('Error fetching user vote:', error);
    return null;
  }
};

const voteForVideo = async (battleId: string, videoId: string) => {
  try {
    // Mock implementation - replace with actual API call
    console.log(`User voted for video ${videoId} in battle ${battleId}`);
    return true; // Simulating successful vote
  } catch (error) {
    console.error('Error voting for video:', error);
    return false;
  }
};

const BattleService = {
  getBattle,
  getUserVote,
  voteForVideo,
  getRelatedBattles,
};

export default BattleService;
