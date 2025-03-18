
-- Function to increment video views
CREATE OR REPLACE FUNCTION increment_video_views(video_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE videos
  SET view_count = view_count + 1
  WHERE id = video_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment video likes
CREATE OR REPLACE FUNCTION increment_video_likes(video_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE videos
  SET likes_count = likes_count + 1
  WHERE id = video_id;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement video likes
CREATE OR REPLACE FUNCTION decrement_video_likes(video_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE videos
  SET likes_count = GREATEST(likes_count - 1, 0)
  WHERE id = video_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment video comments
CREATE OR REPLACE FUNCTION increment_video_comments(video_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE videos
  SET comments_count = comments_count + 1
  WHERE id = video_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment video shares
CREATE OR REPLACE FUNCTION increment_video_shares(video_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE videos
  SET shares_count = shares_count + 1
  WHERE id = video_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment comment likes
CREATE OR REPLACE FUNCTION increment_comment_likes(comment_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE comments
  SET likes_count = likes_count + 1
  WHERE id = comment_id;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement comment likes
CREATE OR REPLACE FUNCTION decrement_comment_likes(comment_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE comments
  SET likes_count = GREATEST(likes_count - 1, 0)
  WHERE id = comment_id;
END;
$$ LANGUAGE plpgsql;
