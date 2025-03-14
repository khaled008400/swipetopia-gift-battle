
import { Video } from "@/types/video.types";

export const VIDEOS: Video[] = [
  {
    id: "1",
    url: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    user: {
      username: "dancequeen",
      avatar: "https://i.pravatar.cc/150?img=1",
      isFollowing: false
    },
    description: "Dance Battle Finals 🏆 #dance #competition #finals",
    likes: 1432,
    comments: 87,
    shares: 34,
    isLiked: false
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
    isLiked: false
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
    isLiked: false
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
    isLiked: false
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
    isLiked: false
  },
];
