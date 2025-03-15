
export interface UserProfile {
  id: string;
  username?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  interests?: string[];
  roles?: string[];
  shop_name?: string;
  stream_key?: string;
  coins?: number;
  followers?: number;
  following?: number;
  email?: string;
}
