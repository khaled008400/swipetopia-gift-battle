export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_actions: {
        Row: {
          action_type: string
          admin_id: string | null
          created_at: string | null
          id: string
          reason: string | null
          target_id: string | null
        }
        Insert: {
          action_type: string
          admin_id?: string | null
          created_at?: string | null
          id?: string
          reason?: string | null
          target_id?: string | null
        }
        Update: {
          action_type?: string
          admin_id?: string | null
          created_at?: string | null
          id?: string
          reason?: string | null
          target_id?: string | null
        }
        Relationships: []
      }
      battle_history: {
        Row: {
          created_at: string | null
          date: string
          id: string
          opponent_avatar: string | null
          opponent_id: string
          opponent_username: string
          result: string
          streamer_id: string
          view_count: number
          votes_opponent: number
          votes_received: number
        }
        Insert: {
          created_at?: string | null
          date?: string
          id?: string
          opponent_avatar?: string | null
          opponent_id: string
          opponent_username: string
          result: string
          streamer_id: string
          view_count?: number
          votes_opponent?: number
          votes_received?: number
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          opponent_avatar?: string | null
          opponent_id?: string
          opponent_username?: string
          result?: string
          streamer_id?: string
          view_count?: number
          votes_opponent?: number
          votes_received?: number
        }
        Relationships: [
          {
            foreignKeyName: "battle_history_opponent_id_fkey"
            columns: ["opponent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "battle_history_streamer_id_fkey"
            columns: ["streamer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      battles: {
        Row: {
          ended_at: string | null
          id: string
          started_at: string | null
          status: string | null
          stream_a_id: string
          stream_b_id: string
          winner_id: string | null
        }
        Insert: {
          ended_at?: string | null
          id?: string
          started_at?: string | null
          status?: string | null
          stream_a_id: string
          stream_b_id: string
          winner_id?: string | null
        }
        Update: {
          ended_at?: string | null
          id?: string
          started_at?: string | null
          status?: string | null
          stream_a_id?: string
          stream_b_id?: string
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "battles_stream_a_id_fkey"
            columns: ["stream_a_id"]
            isOneToOne: false
            referencedRelation: "streams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "battles_stream_b_id_fkey"
            columns: ["stream_b_id"]
            isOneToOne: false
            referencedRelation: "streams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "battles_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "streams"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          created_at: string
          id: string
          message: string
          sender_id: string
          stream_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          sender_id: string
          stream_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          sender_id?: string
          stream_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_stream_id_fkey"
            columns: ["stream_id"]
            isOneToOne: false
            referencedRelation: "streams"
            referencedColumns: ["id"]
          },
        ]
      }
      followers: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
      }
      gift_transactions: {
        Row: {
          amount: number
          created_at: string
          gift_id: string
          id: string
          receiver_id: string
          sender_id: string
          video_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          gift_id: string
          id?: string
          receiver_id: string
          sender_id: string
          video_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          gift_id?: string
          id?: string
          receiver_id?: string
          sender_id?: string
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gift_transactions_gift_id_fkey"
            columns: ["gift_id"]
            isOneToOne: false
            referencedRelation: "virtual_gifts"
            referencedColumns: ["id"]
          },
        ]
      }
      gifts: {
        Row: {
          color: string
          created_at: string | null
          icon: string
          id: string
          name: string
          price: number
          value: number
        }
        Insert: {
          color: string
          created_at?: string | null
          icon: string
          id?: string
          name: string
          price: number
          value: number
        }
        Update: {
          color?: string
          created_at?: string | null
          icon?: string
          id?: string
          name?: string
          price?: number
          value?: number
        }
        Relationships: []
      }
      limited_offers: {
        Row: {
          created_at: string | null
          discount_percentage: number
          end_date: string
          id: string
          product_id: string
          start_date: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          discount_percentage: number
          end_date: string
          id?: string
          product_id: string
          start_date?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          discount_percentage?: number
          end_date?: string
          id?: string
          product_id?: string
          start_date?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "limited_offers_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      live_sellers: {
        Row: {
          id: string
          is_live: boolean | null
          started_at: string | null
          stream_key: string | null
          thumbnail_url: string | null
          title: string | null
          updated_at: string | null
          user_id: string
          viewers: number | null
        }
        Insert: {
          id?: string
          is_live?: boolean | null
          started_at?: string | null
          stream_key?: string | null
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string | null
          user_id: string
          viewers?: number | null
        }
        Update: {
          id?: string
          is_live?: boolean | null
          started_at?: string | null
          stream_key?: string | null
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string
          viewers?: number | null
        }
        Relationships: []
      }
      live_stream_products: {
        Row: {
          created_at: string | null
          discount_percentage: number | null
          featured: boolean | null
          id: string
          product_id: string
          stream_id: string
        }
        Insert: {
          created_at?: string | null
          discount_percentage?: number | null
          featured?: boolean | null
          id?: string
          product_id: string
          stream_id: string
        }
        Update: {
          created_at?: string | null
          discount_percentage?: number | null
          featured?: boolean | null
          id?: string
          product_id?: string
          stream_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "live_stream_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "live_stream_products_stream_id_fkey"
            columns: ["stream_id"]
            isOneToOne: false
            referencedRelation: "streams"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          id: string
          status: string | null
          total_amount: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          status?: string | null
          total_amount: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          status?: string | null
          total_amount?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          name: string
          price: number
          seller_id: string | null
          status: string | null
          stock_quantity: number | null
          suction_score: number | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          name: string
          price: number
          seller_id?: string | null
          status?: string | null
          stock_quantity?: number | null
          suction_score?: number | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          name?: string
          price?: number
          seller_id?: string | null
          status?: string | null
          stock_quantity?: number | null
          suction_score?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          coins: number | null
          created_at: string | null
          email: string | null
          followers: number | null
          following: number | null
          id: string
          interests: string[] | null
          location: string | null
          role: string | null
          roles: string[] | null
          shop_name: string | null
          stream_key: string | null
          updated_at: string | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          coins?: number | null
          created_at?: string | null
          email?: string | null
          followers?: number | null
          following?: number | null
          id: string
          interests?: string[] | null
          location?: string | null
          role?: string | null
          roles?: string[] | null
          shop_name?: string | null
          stream_key?: string | null
          updated_at?: string | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          coins?: number | null
          created_at?: string | null
          email?: string | null
          followers?: number | null
          following?: number | null
          id?: string
          interests?: string[] | null
          location?: string | null
          role?: string | null
          roles?: string[] | null
          shop_name?: string | null
          stream_key?: string | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      scheduled_streams: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_battle: boolean | null
          opponent_id: string | null
          scheduled_time: string
          status: string | null
          streamer_id: string
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_battle?: boolean | null
          opponent_id?: string | null
          scheduled_time: string
          status?: string | null
          streamer_id: string
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_battle?: boolean | null
          opponent_id?: string | null
          scheduled_time?: string
          status?: string | null
          streamer_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_streams_opponent_id_fkey"
            columns: ["opponent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_streams_streamer_id_fkey"
            columns: ["streamer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      short_videos: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          thumbnail_url: string | null
          title: string
          user_id: string
          video_url: string
          view_count: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          thumbnail_url?: string | null
          title: string
          user_id: string
          video_url: string
          view_count?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          thumbnail_url?: string | null
          title?: string
          user_id?: string
          video_url?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "short_videos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      stream_gifts: {
        Row: {
          coins_amount: number
          created_at: string | null
          gift_type: string
          id: string
          receiver_id: string
          sender_id: string
          stream_id: string
        }
        Insert: {
          coins_amount: number
          created_at?: string | null
          gift_type: string
          id?: string
          receiver_id: string
          sender_id: string
          stream_id: string
        }
        Update: {
          coins_amount?: number
          created_at?: string | null
          gift_type?: string
          id?: string
          receiver_id?: string
          sender_id?: string
          stream_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stream_gifts_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stream_gifts_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stream_gifts_stream_id_fkey"
            columns: ["stream_id"]
            isOneToOne: false
            referencedRelation: "streams"
            referencedColumns: ["id"]
          },
        ]
      }
      stream_highlights: {
        Row: {
          comments: number
          created_at: string | null
          duration: string
          id: string
          likes: number
          streamer_id: string
          thumbnail: string
          title: string
          video_url: string
          views: number
        }
        Insert: {
          comments?: number
          created_at?: string | null
          duration: string
          id?: string
          likes?: number
          streamer_id: string
          thumbnail: string
          title: string
          video_url: string
          views?: number
        }
        Update: {
          comments?: number
          created_at?: string | null
          duration?: string
          id?: string
          likes?: number
          streamer_id?: string
          thumbnail?: string
          title?: string
          video_url?: string
          views?: number
        }
        Relationships: [
          {
            foreignKeyName: "stream_highlights_streamer_id_fkey"
            columns: ["streamer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      stream_history: {
        Row: {
          coins_earned: number
          created_at: string | null
          date: string
          duration: number
          gifts_earned: number
          id: string
          streamer_id: string
          title: string
          view_count: number
        }
        Insert: {
          coins_earned?: number
          created_at?: string | null
          date?: string
          duration: number
          gifts_earned?: number
          id?: string
          streamer_id: string
          title: string
          view_count?: number
        }
        Update: {
          coins_earned?: number
          created_at?: string | null
          date?: string
          duration?: number
          gifts_earned?: number
          id?: string
          streamer_id?: string
          title?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "stream_history_streamer_id_fkey"
            columns: ["streamer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      streaming_config: {
        Row: {
          agora_app_certificate: string | null
          agora_app_id: string | null
          agora_enabled: boolean | null
          created_at: string | null
          id: string
          max_stream_duration: number | null
          streamer_cooldown: number | null
          updated_at: string | null
        }
        Insert: {
          agora_app_certificate?: string | null
          agora_app_id?: string | null
          agora_enabled?: boolean | null
          created_at?: string | null
          id?: string
          max_stream_duration?: number | null
          streamer_cooldown?: number | null
          updated_at?: string | null
        }
        Update: {
          agora_app_certificate?: string | null
          agora_app_id?: string | null
          agora_enabled?: boolean | null
          created_at?: string | null
          id?: string
          max_stream_duration?: number | null
          streamer_cooldown?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      streams: {
        Row: {
          description: string | null
          ended_at: string | null
          id: string
          started_at: string | null
          status: string | null
          thumbnail_url: string | null
          title: string
          user_id: string
          viewer_count: number | null
        }
        Insert: {
          description?: string | null
          ended_at?: string | null
          id?: string
          started_at?: string | null
          status?: string | null
          thumbnail_url?: string | null
          title: string
          user_id: string
          viewer_count?: number | null
        }
        Update: {
          description?: string | null
          ended_at?: string | null
          id?: string
          started_at?: string | null
          status?: string | null
          thumbnail_url?: string | null
          title?: string
          user_id?: string
          viewer_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "streams_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      top_supporters: {
        Row: {
          created_at: string | null
          gift_amount: number
          id: string
          streamer_id: string
          supporter_avatar: string | null
          supporter_id: string
          supporter_username: string
        }
        Insert: {
          created_at?: string | null
          gift_amount?: number
          id?: string
          streamer_id: string
          supporter_avatar?: string | null
          supporter_id: string
          supporter_username: string
        }
        Update: {
          created_at?: string | null
          gift_amount?: number
          id?: string
          streamer_id?: string
          supporter_avatar?: string | null
          supporter_id?: string
          supporter_username?: string
        }
        Relationships: [
          {
            foreignKeyName: "top_supporters_streamer_id_fkey"
            columns: ["streamer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "top_supporters_supporter_id_fkey"
            columns: ["supporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      video_bookmarks: {
        Row: {
          created_at: string
          id: string
          user_id: string
          video_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
          video_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
          video_id?: string
        }
        Relationships: []
      }
      video_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          user_id: string
          video_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          user_id: string
          video_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          user_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_comments_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "short_videos"
            referencedColumns: ["id"]
          },
        ]
      }
      video_interactions: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          interaction_type: string
          user_id: string
          video_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          interaction_type: string
          user_id: string
          video_id: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          interaction_type?: string
          user_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_interactions_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      video_likes: {
        Row: {
          created_at: string | null
          id: string
          user_id: string
          video_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          user_id: string
          video_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          user_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_likes_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "short_videos"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          comments_count: number | null
          created_at: string | null
          description: string | null
          hashtags: string[] | null
          id: string
          is_live: boolean | null
          is_private: boolean | null
          likes_count: number | null
          shares_count: number | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          user_id: string
          video_url: string
          view_count: number | null
        }
        Insert: {
          comments_count?: number | null
          created_at?: string | null
          description?: string | null
          hashtags?: string[] | null
          id?: string
          is_live?: boolean | null
          is_private?: boolean | null
          likes_count?: number | null
          shares_count?: number | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          user_id: string
          video_url: string
          view_count?: number | null
        }
        Update: {
          comments_count?: number | null
          created_at?: string | null
          description?: string | null
          hashtags?: string[] | null
          id?: string
          is_live?: boolean | null
          is_private?: boolean | null
          likes_count?: number | null
          shares_count?: number | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
          video_url?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "videos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      virtual_gifts: {
        Row: {
          available: boolean | null
          category: string | null
          color: string
          created_at: string
          description: string | null
          has_sound: boolean | null
          icon: string
          id: string
          image_type: string | null
          image_url: string | null
          is_premium: boolean | null
          name: string
          price: number
          value: number
        }
        Insert: {
          available?: boolean | null
          category?: string | null
          color: string
          created_at?: string
          description?: string | null
          has_sound?: boolean | null
          icon: string
          id?: string
          image_type?: string | null
          image_url?: string | null
          is_premium?: boolean | null
          name: string
          price: number
          value: number
        }
        Update: {
          available?: boolean | null
          category?: string | null
          color?: string
          created_at?: string
          description?: string | null
          has_sound?: boolean | null
          icon?: string
          id?: string
          image_type?: string | null
          image_url?: string | null
          is_premium?: boolean | null
          name?: string
          price?: number
          value?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      decrement_followers: {
        Args: {
          user_id: string
        }
        Returns: undefined
      }
      get_streaming_config: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          agora_app_id: string
          agora_app_certificate: string
          agora_enabled: boolean
          max_stream_duration: number
          streamer_cooldown: number
          created_at: string
          updated_at: string
        }[]
      }
      increment_counter: {
        Args: {
          row_id: string
          counter_name: string
        }
        Returns: number
      }
      increment_followers: {
        Args: {
          user_id: string
        }
        Returns: undefined
      }
      increment_video_counter: {
        Args: {
          video_id: string
          counter_name: string
        }
        Returns: undefined
      }
      log_admin_action: {
        Args: {
          p_action_type: string
          p_target_id: string
          p_reason: string
        }
        Returns: undefined
      }
      update_streaming_config: {
        Args: {
          p_app_id: string
          p_app_certificate: string
          p_enabled: boolean
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
