
-- Table for tracking follower relationships
CREATE TABLE IF NOT EXISTS public.followers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id uuid REFERENCES auth.users NOT NULL,
    following_id uuid REFERENCES auth.users NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    
    -- Ensure we don't have duplicate follow relationships
    CONSTRAINT followers_unique_constraint UNIQUE (follower_id, following_id)
);

-- Grant access to authenticated users
ALTER TABLE public.followers ENABLE ROW LEVEL SECURITY;

-- Policies for followers table
CREATE POLICY "Anyone can view followers" 
ON public.followers 
FOR SELECT 
USING (true);

CREATE POLICY "Users can follow others" 
ON public.followers 
FOR INSERT 
TO authenticated 
WITH CHECK (follower_id = auth.uid());

CREATE POLICY "Users can unfollow others" 
ON public.followers 
FOR DELETE 
TO authenticated 
USING (follower_id = auth.uid());
