
// This is a new component to handle the video actions with auth check
import { useState } from "react";
import { Heart, Share2, MessageCircle, Flag, Download, Gift } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface VideoActionsProps {
  videoId: string;
  isLiked?: boolean;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onReport?: () => void;
  onDownload?: () => void;
  onGift?: () => void;
}

const VideoActions = ({ 
  videoId, 
  isLiked = false,
  onLike, 
  onComment, 
  onShare, 
  onReport, 
  onDownload,
  onGift
}: VideoActionsProps) => {
  const { requiresAuth, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleAction = (action: () => void, actionName: string) => {
    requiresAuth(action, `/login?redirect=/watch/${videoId}&action=${actionName}`);
  };
  
  return (
    <div className="flex flex-col space-y-5 items-center">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full bg-black bg-opacity-50 text-white"
        onClick={() => handleAction(onLike || (() => {}), 'like')}
      >
        <Heart className={`h-6 w-6 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full bg-black bg-opacity-50 text-white"
        onClick={() => handleAction(onComment || (() => {}), 'comment')}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full bg-black bg-opacity-50 text-white"
        onClick={onShare || (() => {})}
      >
        <Share2 className="h-6 w-6" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full bg-black bg-opacity-50 text-white"
        onClick={() => handleAction(onGift || (() => {}), 'gift')}
      >
        <Gift className="h-6 w-6" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full bg-black bg-opacity-50 text-white"
        onClick={onDownload || (() => {})}
      >
        <Download className="h-6 w-6" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full bg-black bg-opacity-50 text-white"
        onClick={() => handleAction(onReport || (() => {}), 'report')}
      >
        <Flag className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default VideoActions;
