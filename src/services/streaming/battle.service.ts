
import { supabase } from '@/integrations/supabase/client';
import { Battle } from './stream.types';

/**
 * Service for handling battle operations
 */
class BattleService {
  /**
   * Create a new battle
   */
  async createBattle(streamAId: string, streamBId: string): Promise<string> {
    try {
      // Create a new battle record
      const { data, error } = await supabase
        .from('battles')
        .insert({
          stream_a_id: streamAId,
          stream_b_id: streamBId,
          status: 'pending',
          started_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return data.id;
    } catch (error) {
      console.error('Error creating battle:', error);
      throw error;
    }
  }

  /**
   * Accept a battle
   */
  async acceptBattle(battleId: string): Promise<void> {
    try {
      // Update the battle record
      const { error } = await supabase
        .from('battles')
        .update({ status: 'active' })
        .eq('id', battleId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error accepting battle:', error);
      throw error;
    }
  }

  /**
   * End a battle
   */
  async endBattle(battleId: string, winnerId?: string): Promise<void> {
    try {
      // Update the battle record
      const { error } = await supabase
        .from('battles')
        .update({
          status: 'completed',
          ended_at: new Date().toISOString(),
          winner_id: winnerId
        })
        .eq('id', battleId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error ending battle:', error);
      throw error;
    }
  }

  /**
   * Get battle by ID
   */
  async getBattleById(battleId: string): Promise<Battle | null> {
    try {
      const { data, error } = await supabase
        .from('battles')
        .select('*')
        .eq('id', battleId)
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching battle:', error);
      return null;
    }
  }

  /**
   * Get active battles
   */
  async getActiveBattles(): Promise<Battle[]> {
    try {
      const { data, error } = await supabase
        .from('battles')
        .select('*')
        .eq('status', 'active')
        .order('started_at', { ascending: false });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching active battles:', error);
      return [];
    }
  }
}

export default new BattleService();
