
import { supabase } from "@/integrations/supabase/client";

const DemoService = {
  generateRandomData: async (streamerId: string) => {
    try {
      // Generate random top supporters
      const supporterNames = [
        'FashionFan', 'TechGuru', 'GamingPro', 'MusicLover', 
        'FoodieLife', 'TravelBug', 'FitnessFreak', 'BeautyBoss',
        'CraftMaster', 'BookWorm', 'CodingWiz', 'ArtCreator'
      ];
      
      const supporters = supporterNames.map((name, index) => ({
        id: crypto.randomUUID(),
        supporter_id: crypto.randomUUID(),
        supporter_username: name,
        supporter_avatar: `https://i.pravatar.cc/150?img=${index + 1}`,
        streamer_id: streamerId,
        gift_amount: Math.floor(Math.random() * 10000) + 100
      }));
      
      // Insert top supporters
      const { error: supportersError } = await supabase
        .from('top_supporters')
        .insert(supporters);
        
      if (supportersError) throw supportersError;
      
      // Generate random stream history
      const streamTitles = [
        'Fashion Week Special', 'Tech Talk Tuesday', 'Gaming Marathon',
        'Music Jam Session', 'Cooking Class Live', 'Travel Vlog',
        'Workout Session', 'Beauty Tips and Tricks', 'DIY Crafts',
        'Book Club Discussion', 'Coding Challenge', 'Art Creation'
      ];
      
      const streams = streamTitles.map((title) => {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));
        
        return {
          id: crypto.randomUUID(),
          title,
          streamer_id: streamerId,
          date: date.toISOString(),
          duration: Math.floor(Math.random() * 120) + 30,
          view_count: Math.floor(Math.random() * 5000) + 100,
          gifts_earned: Math.floor(Math.random() * 50) + 5,
          coins_earned: Math.floor(Math.random() * 2000) + 100
        };
      });
      
      // Insert stream history
      const { error: streamsError } = await supabase
        .from('stream_history')
        .insert(streams);
        
      if (streamsError) throw streamsError;
      
      // Generate random stream highlights
      const highlights = [
        'Best Fashion Tips', 'Tech Gadget Review', 'Epic Game Win',
        'Live Music Performance', 'Delicious Recipe', 'Amazing Destination',
        'Fitness Challenge', 'Makeup Tutorial', 'Creative DIY Project',
        'Book Review', 'Coding Project Demo', 'Art Showcase'
      ].map((title, index) => ({
        id: crypto.randomUUID(),
        title,
        streamer_id: streamerId,
        thumbnail: `https://picsum.photos/600/400?random=${index}`,
        video_url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        duration: `${Math.floor(Math.random() * 10) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        views: Math.floor(Math.random() * 10000) + 500,
        likes: Math.floor(Math.random() * 1000) + 50,
        comments: Math.floor(Math.random() * 100) + 10
      }));
      
      // Insert stream highlights
      const { error: highlightsError } = await supabase
        .from('stream_highlights')
        .insert(highlights);
        
      if (highlightsError) throw highlightsError;
      
      // Generate random scheduled streams
      const scheduled = [
        'Upcoming Fashion Show', 'Tech News Roundup', 'Gaming Tournament',
        'Live Concert', 'Cooking Show', 'Travel Planning'
      ].map((title, index) => {
        const date = new Date();
        date.setDate(date.getDate() + Math.floor(Math.random() * 14) + 1);
        date.setHours(12 + index % 10, 0, 0);
        
        return {
          id: crypto.randomUUID(),
          title,
          streamer_id: streamerId,
          scheduled_time: date.toISOString(),
          is_battle: index % 3 === 0, // Every third stream is a battle
          opponent_id: index % 3 === 0 ? crypto.randomUUID() : null,
          status: 'scheduled'
        };
      });
      
      // Insert scheduled streams
      const { error: scheduledError } = await supabase
        .from('scheduled_streams')
        .insert(scheduled);
        
      if (scheduledError) throw scheduledError;
      
      return { success: true };
    } catch (error) {
      console.error("Error generating demo data:", error);
      throw error;
    }
  },
  
  clearDemoData: async (streamerId: string) => {
    try {
      // Delete all data for this streamer
      await supabase.from('top_supporters').delete().eq('streamer_id', streamerId);
      await supabase.from('stream_history').delete().eq('streamer_id', streamerId);
      await supabase.from('stream_highlights').delete().eq('streamer_id', streamerId);
      await supabase.from('scheduled_streams').delete().eq('streamer_id', streamerId);
      
      return { success: true };
    } catch (error) {
      console.error("Error clearing demo data:", error);
      throw error;
    }
  }
};

export default DemoService;
