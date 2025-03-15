
-- Table for virtual gifts
CREATE TABLE IF NOT EXISTS public.virtual_gifts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    price integer NOT NULL,
    value integer NOT NULL,
    icon text NOT NULL,
    color text NOT NULL,
    available boolean DEFAULT true,
    category text,
    image_url text,
    image_type text,
    has_sound boolean DEFAULT false,
    description text,
    is_premium boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Default gifts
INSERT INTO public.virtual_gifts (name, price, value, icon, color, category)
VALUES
    ('Heart', 10, 5, '❤️', '#ff0000', 'basic'),
    ('Star', 20, 10, '⭐', '#ffff00', 'basic'),
    ('Diamond', 50, 25, '💎', '#00ffff', 'premium'),
    ('Crown', 100, 50, '👑', '#ffd700', 'premium'),
    ('Rocket', 200, 100, '🚀', '#ff00ff', 'premium'),
    ('Fire', 30, 15, '🔥', '#ff4500', 'basic');

-- Gift transaction table
CREATE TABLE IF NOT EXISTS public.gift_transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id uuid REFERENCES auth.users NOT NULL,
    receiver_id uuid REFERENCES auth.users NOT NULL,
    video_id uuid,
    gift_id uuid REFERENCES public.virtual_gifts NOT NULL,
    amount integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Grant access
ALTER TABLE public.virtual_gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_transactions ENABLE ROW LEVEL SECURITY;

-- Policies for virtual_gifts
CREATE POLICY "Anyone can view virtual gifts" 
ON public.virtual_gifts 
FOR SELECT 
USING (true);

-- Policies for gift_transactions
CREATE POLICY "Authenticated users can create gift transactions" 
ON public.gift_transactions 
FOR INSERT 
TO authenticated 
WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can see their sent and received gifts" 
ON public.gift_transactions 
FOR SELECT 
TO authenticated 
USING (sender_id = auth.uid() OR receiver_id = auth.uid());

-- Add RPC functions for coin management
CREATE OR REPLACE FUNCTION public.deduct_coins(user_id uuid, coin_amount int)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles
  SET coins = coins - coin_amount
  WHERE id = user_id AND coins >= coin_amount;
END;
$$ language plpgsql;

CREATE OR REPLACE FUNCTION public.add_coins(user_id uuid, coin_amount int)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles
  SET coins = coins + coin_amount
  WHERE id = user_id;
END;
$$ language plpgsql;

-- Grant execution permissions
GRANT EXECUTE ON FUNCTION public.deduct_coins(uuid, int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.add_coins(uuid, int) TO authenticated;
