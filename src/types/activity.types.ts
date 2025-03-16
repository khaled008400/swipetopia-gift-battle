
export interface UserActivity {
  id: string;
  type: 'like' | 'comment' | 'share' | 'save' | 'follow';
  target_id: string;
  target_type: 'video' | 'user' | 'product';
  user_id: string;
  created_at: string;
  content?: string;
}

export interface FormattedActivity {
  id: string;
  type: 'like' | 'comment' | 'share' | 'save' | 'follow';
  timestamp: string;
  timeAgo: string;
  content: string;
  target: {
    type: 'video' | 'user' | 'product';
    id: string;
    name: string;
    image?: string;
  };
}
