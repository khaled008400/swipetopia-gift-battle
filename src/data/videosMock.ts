import { Video } from '@/types/video.types';

export const videosMock: Video[] = [
  {
    id: "1",
    title: "Exciting Dance Moves",
    description: "Learn these amazing dance steps in just 30 seconds!",
    video_url: "/videos/dance.mp4",
    thumbnail_url: "/thumbnails/dance.jpg",
    user_id: "user1",
    created_at: "2023-04-10T10:00:00Z",
    updated_at: "2023-04-10T10:00:00Z",
    view_count: 1200,
    likes_count: 340,
    comments_count: 56,
    shares_count: 23,
    is_live: false,
    is_private: false,
    duration: 30,
    category: "dance",
    hashtags: ["dance", "tutorial", "viral"],
    url: "/video/1",
    is_liked: true,
    user: {
      username: "dancepro",
      avatar: "/avatars/dancepro.jpg",
    }
  },
  {
    id: "2",
    url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    user: {
      username: "groovyking",
      avatar: "https://i.pravatar.cc/150?img=2",
      isFollowing: true
    },
    description: "My entry for the dance battle! Vote if you like it 🔥 #dancebattle #hiphop",
    likes: 2651,
    comments: 132,
    shares: 76,
    is_liked: false
  },
  {
    id: "3",
    url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    user: {
      username: "lipqueen",
      avatar: "https://i.pravatar.cc/150?img=3"
    },
    description: "Freestyle Rap Challenge - Round 1 🎤 #rap #freestyle #competition",
    likes: 3219,
    comments: 201,
    shares: 97,
    is_liked: false
  },
  {
    id: "4",
    url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    user: {
      username: "lyricalgenius",
      avatar: "https://i.pravatar.cc/150?img=4"
    },
    description: "Responding to @lipqueen's challenge. Let's go! 🔥 #rapbattle #bars",
    likes: 2876,
    comments: 143,
    shares: 87,
    is_liked: false
  },
  {
    id: "5",
    url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    user: {
      username: "fashionista",
      avatar: "https://i.pravatar.cc/150?img=5"
    },
    description: "Fashion Face-Off Entry 👗 #fashion #style #competition",
    likes: 4532,
    comments: 234,
    shares: 123,
    is_liked: false
  },
];

export default videosMock;
