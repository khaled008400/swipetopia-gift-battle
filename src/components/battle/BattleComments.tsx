
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  user: {
    username: string;
    avatar_url: string;
  };
}

interface BattleCommentsProps {
  battleId: string;
}

export const BattleComments = ({ battleId }: BattleCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!battleId) return;
    
    const fetchComments = async () => {
      try {
        const { data, error } = await supabase
          .from("video_comments")
          .select("*, user:profiles(username, avatar_url)")
          .eq("video_id", battleId)
          .order("created_at", { ascending: false });
          
        if (error) throw error;
        
        setComments(data || []);
      } catch (err) {
        console.error("Error fetching comments:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchComments();
    
    // Subscribe to new comments
    const channel = supabase
      .channel("battle-comments")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "video_comments",
          filter: `video_id=eq.${battleId}`,
        },
        (payload) => {
          // Fetch the user data for the new comment
          const fetchNewComment = async () => {
            const { data } = await supabase
              .from("profiles")
              .select("username, avatar_url")
              .eq("id", payload.new.user_id)
              .single();
              
            const newCommentWithUser: Comment = {
              ...payload.new,
              user: {
                username: data?.username || "Unknown",
                avatar_url: data?.avatar_url || ""
              }
            };
            
            setComments((prev) => [newCommentWithUser, ...prev]);
          };
          
          fetchNewComment();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [battleId]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !user) return;
    
    try {
      const { error } = await supabase.from("video_comments").insert({
        video_id: battleId,
        user_id: user.id,
        content: newComment,
      });
      
      if (error) throw error;
      
      setNewComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {user ? (
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddComment();
              }
            }}
          />
          <Button onClick={handleAddComment} size="sm">
            Post
          </Button>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center">
          Sign in to comment
        </p>
      )}

      <div className="space-y-4 max-h-[400px] overflow-y-auto">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="flex space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.user?.avatar_url} />
                <AvatarFallback>
                  {comment.user?.username?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h5 className="text-sm font-semibold">
                    {comment.user?.username || "Unknown"}
                  </h5>
                  <span className="text-xs text-muted-foreground">
                    {new Date(comment.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm">{comment.content}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-center text-muted-foreground">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
};

export default BattleComments;
