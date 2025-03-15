
-- Create a function to handle gift sending as a transaction
CREATE OR REPLACE FUNCTION public.send_gift(
  p_sender_id UUID,
  p_receiver_id UUID,
  p_gift_type TEXT,
  p_amount INTEGER,
  p_battle_id UUID DEFAULT NULL
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_sender_coins INTEGER;
  v_sender_username TEXT;
  v_sender_avatar TEXT;
  v_stream_id UUID;
BEGIN
  -- Get sender's current coin balance and profile info
  SELECT coins, username, avatar_url 
  INTO v_sender_coins, v_sender_username, v_sender_avatar
  FROM profiles
  WHERE id = p_sender_id;
  
  -- Check if sender has enough coins
  IF v_sender_coins < p_amount THEN
    RAISE EXCEPTION 'Insufficient coins to send gift';
  END IF;
  
  -- Find active stream associated with receiver
  SELECT id INTO v_stream_id
  FROM streams
  WHERE user_id = p_receiver_id AND status = 'live'
  LIMIT 1;
  
  -- Begin transaction
  BEGIN
    -- Deduct coins from sender
    UPDATE profiles
    SET coins = coins - p_amount
    WHERE id = p_sender_id;
    
    -- Add coins to receiver
    UPDATE profiles
    SET coins = coins + p_amount
    WHERE id = p_receiver_id;
    
    -- Record the gift
    INSERT INTO stream_gifts (
      sender_id,
      receiver_id,
      gift_type,
      coins_amount,
      stream_id,
      battle_id
    ) VALUES (
      p_sender_id,
      p_receiver_id,
      p_gift_type,
      p_amount,
      v_stream_id,
      p_battle_id
    );
    
    -- If this is part of a battle, update the battle score
    IF p_battle_id IS NOT NULL THEN
      -- This could be expanded to update battle scores
      -- Currently handled by the real-time listener
    END IF;
  END;
END;
$$;

-- Enable row-level security on stream_gifts
ALTER TABLE IF EXISTS public.stream_gifts ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to select gifts they've sent or received
CREATE POLICY "Users can see gifts they've sent or received"
ON public.stream_gifts
FOR SELECT
USING (
  auth.uid() = sender_id OR 
  auth.uid() = receiver_id
);

-- Allow authenticated users to insert gifts they're sending
CREATE POLICY "Users can send gifts"
ON public.stream_gifts
FOR INSERT
WITH CHECK (
  auth.uid() = sender_id
);

-- Make the stream_gifts table available for real-time subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE public.stream_gifts;
ALTER TABLE public.stream_gifts REPLICA IDENTITY FULL;

-- Make the battles table available for real-time subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE public.battles;
ALTER TABLE public.battles REPLICA IDENTITY FULL;

-- Make the streams table available for real-time subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE public.streams;
ALTER TABLE public.streams REPLICA IDENTITY FULL;
