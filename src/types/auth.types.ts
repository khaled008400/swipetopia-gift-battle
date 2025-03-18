
export interface User {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
  role?: string;
  tokens?: string[];
}
