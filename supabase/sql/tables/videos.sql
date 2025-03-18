
-- Videos table
CREATE TABLE IF NOT EXISTS videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  view_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  is_live BOOLEAN DEFAULT false,
  is_private BOOLEAN DEFAULT false,
  duration INTEGER,
  category TEXT,
  hashtags TEXT[]
);

-- Likes table for tracking which users liked which videos
CREATE TABLE IF NOT EXISTS likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(video_id, user_id)
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  likes_count INTEGER DEFAULT 0
);

-- Saved videos table
CREATE TABLE IF NOT EXISTS saved_videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(video_id, user_id)
);

-- Followers table
CREATE TABLE IF NOT EXISTS followers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(follower_id, following_id)
);

-- Views table to track unique views
CREATE TABLE IF NOT EXISTS views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies

-- Videos policies
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Videos are viewable by everyone" 
  ON videos FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own videos" 
  ON videos FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own videos" 
  ON videos FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own videos" 
  ON videos FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Likes policies
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Likes are viewable by everyone" 
  ON likes FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own likes" 
  ON likes FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" 
  ON likes FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Comments policies
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are viewable by everyone" 
  ON comments FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own comments" 
  ON comments FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
  ON comments FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
  ON comments FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Saved videos policies
ALTER TABLE saved_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Saved videos are viewable by their owners" 
  ON saved_videos FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved videos" 
  ON saved_videos FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved videos" 
  ON saved_videos FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Followers policies
ALTER TABLE followers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Followers are viewable by everyone" 
  ON followers FOR SELECT 
  USING (true);

CREATE POLICY "Users can follow others" 
  ON followers FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow" 
  ON followers FOR DELETE 
  TO authenticated 
  USING (auth.uid() = follower_id);

-- Views policies
ALTER TABLE views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Views are viewable by everyone" 
  ON views FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can insert views" 
  ON views FOR INSERT 
  WITH CHECK (true);
