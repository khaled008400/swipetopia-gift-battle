
import { Video } from '@/types/video.types';

export const videosMock: Video[] = [
  {
    id: '1',
    title: 'Dance Routine in the Park',
    description: 'Practicing my new dance moves outdoors! #dance #outdoors',
    video_url: 'https://example.com/videos/dance-park.mp4',
    thumbnail_url: 'https://example.com/thumbnails/dance-park.jpg',
    user_id: 'user1',
    view_count: 1200,
    likes_count: 240,
    comments_count: 36,
    shares_count: 15,
    created_at: '2023-06-15T10:30:00Z',
    hashtags: ['dance', 'outdoors', 'summer'],
    isLike: true, // Using isLike instead of is_liked
    user: {
      username: 'DanceQueen',
      avatar_url: 'https://example.com/avatars/danceQueen.jpg',
      id: 'user1',
      isFollowing: false
    }
  },
  {
    id: '2',
    title: 'Cooking my Signature Pasta',
    description: 'Easy homemade pasta recipe anyone can make! #cooking #pasta #recipe',
    video_url: 'https://example.com/videos/pasta-cooking.mp4',
    thumbnail_url: 'https://example.com/thumbnails/pasta-cooking.jpg',
    user_id: 'user2',
    view_count: 3500,
    likes_count: 520,
    comments_count: 78,
    shares_count: 42,
    created_at: '2023-06-14T15:45:00Z',
    hashtags: ['cooking', 'pasta', 'recipe', 'food'],
    isLike: false, // Using isLike instead of is_liked
    user: {
      username: 'ChefMaster',
      avatar_url: 'https://example.com/avatars/chefMaster.jpg',
      id: 'user2',
      isFollowing: true
    }
  },
  {
    id: '3',
    title: 'Morning Workout Routine',
    description: 'Start your day with this 15-minute workout! #fitness #workout #morning',
    video_url: 'https://example.com/videos/morning-workout.mp4',
    thumbnail_url: 'https://example.com/thumbnails/morning-workout.jpg',
    user_id: 'user3',
    view_count: 2100,
    likes_count: 310,
    comments_count: 45,
    shares_count: 28,
    created_at: '2023-06-13T08:20:00Z',
    hashtags: ['fitness', 'workout', 'morning', 'health'],
    isLike: true, // Using isLike instead of is_liked
    user: {
      username: 'FitCoach',
      avatar_url: 'https://example.com/avatars/fitCoach.jpg',
      id: 'user3',
      isFollowing: true
    }
  },
  {
    id: '4',
    title: 'Travel Vlog: Exploring Paris',
    description: 'Walking through the beautiful streets of Paris! #travel #paris #france',
    video_url: 'https://example.com/videos/paris-travel.mp4',
    thumbnail_url: 'https://example.com/thumbnails/paris-travel.jpg',
    user_id: 'user4',
    view_count: 5200,
    likes_count: 890,
    comments_count: 112,
    shares_count: 75,
    created_at: '2023-06-12T12:15:00Z',
    hashtags: ['travel', 'paris', 'france', 'vacation'],
    isLike: false, // Using isLike instead of is_liked
    user: {
      username: 'TravelBug',
      avatar_url: 'https://example.com/avatars/travelBug.jpg',
      id: 'user4',
      isFollowing: false
    }
  },
  {
    id: '5',
    title: 'DIY Room Decoration Ideas',
    description: 'Easy and affordable ways to spruce up your room! #diy #decor #homeimprovement',
    video_url: 'https://example.com/videos/room-diy.mp4',
    thumbnail_url: 'https://example.com/thumbnails/room-diy.jpg',
    user_id: 'user5',
    view_count: 1800,
    likes_count: 340,
    comments_count: 52,
    shares_count: 31,
    created_at: '2023-06-11T16:50:00Z',
    hashtags: ['diy', 'decor', 'homeimprovement', 'creative'],
    isLike: true, // Using isLike instead of is_liked
    user: {
      username: 'CreativeMind',
      avatar_url: 'https://example.com/avatars/creativeMind.jpg',
      id: 'user5',
      isFollowing: true
    }
  }
];

export default videosMock;
