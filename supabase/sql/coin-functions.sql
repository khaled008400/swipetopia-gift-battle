
-- Function to deduct coins from a user
create or replace function deduct_coins(user_id uuid, coin_amount int)
returns void as $$
begin
  update profiles
  set coins = coins - coin_amount
  where id = user_id and coins >= coin_amount;
end;
$$ language plpgsql;

-- Function to add coins to a user
create or replace function add_coins(user_id uuid, coin_amount int)
returns void as $$
begin
  update profiles
  set coins = coins + coin_amount
  where id = user_id;
end;
$$ language plpgsql;
