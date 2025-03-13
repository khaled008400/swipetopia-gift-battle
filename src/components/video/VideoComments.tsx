
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Send } from "lucide-react";
import { useState } from "react";

interface Comment {
  id: string;
  username: string;
  avatar: string;
  text: string;
  timestamp: string;
  likes: number;
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle>Comments ({comments.length})</DialogTitle>
            <DialogClose className="h-6 w-6 rounded-full hover:bg-muted">
              <X className="h-4 w-4" />
            </DialogClose>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex space-x-3">
              <img 
                src={comment.avatar} 
                alt={comment.username} 
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-sm">@{comment.username}</p>
                    <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                  </div>
                  <p className="mt-1 text-sm">{comment.text}</p>
                </div>
                <div className="mt-1 flex items-center space-x-4 text-xs text-muted-foreground">
                  <button className="hover:text-foreground">Like {comment.likes > 0 && `(${comment.likes})`}</button>
                  <button className="hover:text-foreground">Reply</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t mt-auto">
          <div className="flex items-center space-x-2">
            <Input 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment()}
            />
            <Button 
              onClick={handleSubmitComment}
              size="icon"
              disabled={!commentText.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoComments;
