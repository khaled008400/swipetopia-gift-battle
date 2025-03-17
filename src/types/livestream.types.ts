
export interface LiveStreamHost {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  isVerified: boolean;
  followersCount: number;
}

export interface StreamProduct {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  discountPercent: number;
}

export interface LiveStreamInfo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  streamUrl: string;
  startedAt: string;
  status: 'live' | 'ended' | 'scheduled';
  viewersCount: number;
  likesCount: number;
  host: LiveStreamHost;
  tags: string[];
  products: StreamProduct[];
}

export interface LiveStreamComment {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  content: string;
  createdAt: string;
  isVerified: boolean;
  isGift?: boolean;
}

export interface LiveStreamGift {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  giftId: string;
  giftName: string;
  giftImageUrl: string;
  giftValue: number;
  createdAt: string;
}
