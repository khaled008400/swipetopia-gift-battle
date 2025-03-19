
// This is a new component to handle the video actions with auth check
import { useState } from "react";
import { Heart, Share2, MessageCircle, Flag, Download, Gift } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuthCheck } from "@/hooks/useAuthCheck";

interface VideoActionsProps {
  videoId?: string; // Made optional
  isLiked?: boolean;
  isSaved?: boolean;
  likes?: number;
  comments?: number;
  shares?: number;
  allowDownloads?: boolean;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onReport?: () => void;
  onDownload?: () => void;
  onGift?: () => void;
  onSave?: () => void;
}

const VideoActions = ({ 
  videoId = '', // Default to empty string
  isLiked = false,
  isSaved = false,
  likes,
  comments,
  shares,
  allowDownloads = true,
  onLike, 
  onComment, 
  onShare, 
  onReport, 
  onDownload,
  onGift,
  onSave
}: VideoActionsProps) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { requiresAuth, AuthDialog } = useAuthCheck();
  
  const handleAction = (action: () => void | undefined, actionName: string) => {
    if (action) {
      requiresAuth(action, `/video/${videoId}`, actionName);
    }
  };
  
  return (
    <div className="flex flex-col space-y-5 items-center">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full bg-black bg-opacity-50 text-white"
        onClick={() => handleAction(onLike, 'like')}
      >
        <Heart className={`h-6 w-6 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
        {likes !== undefined && <span className="text-white text-xs mt-1">{likes}</span>}
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full bg-black bg-opacity-50 text-white"
        onClick={() => handleAction(onComment, 'comment')}
      >
        <MessageCircle className="h-6 w-6" />
        {comments !== undefined && <span className="text-white text-xs mt-1">{comments}</span>}
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full bg-black bg-opacity-50 text-white"
        onClick={onShare || (() => {})}
      >
        <Share2 className="h-6 w-6" />
        {shares !== undefined && <span className="text-white text-xs mt-1">{shares}</span>}
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full bg-black bg-opacity-50 text-white"
        onClick={() => handleAction(onGift, 'gift')}
      >
        <Gift className="h-6 w-6" />
      </Button>
      
      {allowDownloads && (
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-black bg-opacity-50 text-white"
          onClick={() => handleAction(onDownload, 'download')}
        >
          <Download className="h-6 w-6" />
        </Button>
      )}
      
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full bg-black bg-opacity-50 text-white"
        onClick={() => handleAction(onReport, 'report')}
      >
        <Flag className="h-6 w-6" />
      </Button>
      
      {onSave && (
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-black bg-opacity-50 text-white"
          onClick={() => handleAction(onSave, 'save')}
        >
          <span className={`text-sm ${isSaved ? 'text-yellow-500' : 'text-white'}`}>
            {isSaved ? '★' : '☆'}
          </span>
        </Button>
      )}
      
      <AuthDialog />
    </div>
  );
};

export default VideoActions;
