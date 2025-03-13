
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Send, Heart } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface Comment {
  id: string;
  username: string;
  avatar: string;
  text: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
}

interface VideoCommentsProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
}

const VideoComments = ({ isOpen, onClose, videoId }: VideoCommentsProps) => {
  const [commentText, setCommentText] = useState("");
  
  // Demo comments - in a real app, these would come from an API
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      username: "user123",
      avatar: "https://ui-avatars.com/api/?name=U&background=random",
      text: "This is amazing! 🔥",
      timestamp: "2m ago",
      likes: 24
    },
    {
      id: "2",
      username: "video_lover",
      avatar: "https://ui-avatars.com/api/?name=V&background=random",
      text: "How did you do that trick at 0:15?",
      timestamp: "15m ago",
      likes: 7
    },
    {
      id: "3",
      username: "creative_mind",
      avatar: "https://ui-avatars.com/api/?name=C&background=random",
      text: "The editing on this is so smooth! What software do you use?",
      timestamp: "1h ago",
      likes: 42
    }
  ]);

  const handleSubmitComment = () => {
    if (!commentText.trim()) return;
    
    // Add new comment to the list
    const newComment: Comment = {
      id: Date.now().toString(),
      username: "you",
      avatar: "https://ui-avatars.com/api/?name=Y&background=random",
      text: commentText,
      timestamp: "Just now",
      likes: 0
    };
    
    setComments([newComment, ...comments]);
    setCommentText("");
  };

  const handleLikeComment = (commentId: string) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        const isLiked = comment.isLiked || false;
        return {
          ...comment,
          isLiked: !isLiked,
          likes: isLiked ? comment.likes - 1 : comment.likes + 1
        };
      }
      return comment;
    }));
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="bottom" className="h-[80vh] p-0 rounded-t-xl bg-black border-t border-app-yellow/20">
        <SheetHeader className="p-4 border-b border-app-yellow/20 bg-gradient-to-r from-[#9b87f5]/10 to-[#D946EF]/10">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-app-yellow text-xl font-bold">Comments ({comments.length})</SheetTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full hover:bg-app-yellow/10">
              <X className="h-5 w-5 text-app-yellow" />
            </Button>
          </div>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-black to-[#1a1a1a]">
          {comments.map((comment) => (
            <div key={comment.id} className="flex space-x-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
              <img 
                src={comment.avatar} 
                alt={comment.username} 
                className="w-10 h-10 rounded-full border border-app-yellow/20"
              />
              <div className="flex-1">
                <div className="glass-panel p-3">
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-sm text-app-yellow">@{comment.username}</p>
                    <span className="text-xs text-gray-400">{comment.timestamp}</span>
                  </div>
                  <p className="mt-1 text-sm text-white">{comment.text}</p>
                </div>
                <div className="mt-2 flex items-center space-x-4 text-xs text-gray-400">
                  <button 
                    className="flex items-center space-x-1 hover:text-app-yellow transition-colors"
                    onClick={() => handleLikeComment(comment.id)}
                  >
                    <Heart className={`h-3.5 w-3.5 ${comment.isLiked ? 'fill-app-yellow text-app-yellow' : ''}`} />
                    <span>{comment.likes > 0 && comment.likes}</span>
                  </button>
                  <button className="hover:text-app-yellow transition-colors">Reply</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t border-app-yellow/20 bg-black">
          <div className="flex items-center space-x-2">
            <Input 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 bg-app-gray-dark border-app-yellow/20 focus:border-app-yellow focus-visible:ring-app-yellow/20 text-white"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment()}
            />
            <Button 
              onClick={handleSubmitComment}
              size="icon"
              disabled={!commentText.trim()}
              className="bg-gradient-to-r from-[#9b87f5] to-[#D946EF] hover:opacity-90 text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default VideoComments;
