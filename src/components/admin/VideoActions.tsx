import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AdminVideo } from '@/services/admin.service';
import { 
  CheckCircle, Flag, Trash2, Ban, 
  MessageSquare, User, Shield 
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface VideoActionsProps {
  video: AdminVideo;
  onStatusChange: (videoId: string, status: 'active' | 'flagged' | 'removed') => void;
  onDeleteVideo: (videoId: string) => void;
  onSendWarning?: (videoId: string, userId: string, message: string) => void;
  onViewUserProfile?: (userId: string) => void;
  onRestrictUser?: (userId: string, reason: string) => void;
  onBanUser?: (userId: string, reason: string) => void;
  compact?: boolean;
}

const VideoActions: React.FC<VideoActionsProps> = ({ 
  video, 
  onStatusChange, 
  onDeleteVideo,
  onSendWarning,
  onViewUserProfile,
  onRestrictUser,
  onBanUser,
  compact = false
}) => {
  const [warningMessage, setWarningMessage] = useState("");
  const [restrictionReason, setRestrictionReason] = useState("");
  const [banReason, setBanReason] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [restrictDialogOpen, setRestrictDialogOpen] = useState(false);
  const [banDialogOpen, setBanDialogOpen] = useState(false);

  const handleSendWarning = () => {
    if (onSendWarning && warningMessage.trim()) {
      onSendWarning(video.id, video.user.id || video.user_id, warningMessage);
      setWarningMessage("");
      setDialogOpen(false);
    }
  };

  const handleRestrictUser = () => {
    if (onRestrictUser && restrictionReason.trim()) {
      onRestrictUser(video.user.id || video.user_id, restrictionReason);
      setRestrictionReason("");
      setRestrictDialogOpen(false);
    }
  };

  const handleBanUser = () => {
    if (onBanUser && banReason.trim()) {
      onBanUser(video.user.id || video.user_id, banReason);
      setBanReason("");
      setBanDialogOpen(false);
    }
  };

  if (compact) {
    return (
      <div className="flex space-x-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onStatusChange(video.id, 'active')}
                className="text-green-600 h-8 w-8 p-0"
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Approve Video</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onStatusChange(video.id, 'flagged')}
                className="text-yellow-600 h-8 w-8 p-0"
              >
                <Flag className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Flag Video</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDeleteVideo(video.id)}
                className="text-red-600 h-8 w-8 p-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete Video</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        onClick={() => onStatusChange(video.id, 'active')}
        className="text-green-600"
      >
        <CheckCircle className="mr-2 h-4 w-4" />
        Approve
      </Button>
      <Button
        variant="outline"
        onClick={() => onStatusChange(video.id, 'flagged')}
        className="text-yellow-600"
      >
        <Flag className="mr-2 h-4 w-4" />
        Flag
      </Button>
      <Button
        variant="outline"
        onClick={() => onDeleteVideo(video.id)}
        className="text-red-600"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </Button>

      {onViewUserProfile && (
        <Button
          variant="outline"
          onClick={() => onViewUserProfile(video.user.id || video.user_id)}
          className="text-blue-600"
        >
          <User className="mr-2 h-4 w-4" />
          View User
        </Button>
      )}

      {onSendWarning && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="text-orange-600"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Send Warning
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Warning to User</DialogTitle>
              <DialogDescription>
                This warning will be sent to {video.user.username}. They will be notified immediately.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="warning-message">Warning Message</Label>
                <Textarea
                  id="warning-message"
                  placeholder="Enter your warning message..."
                  value={warningMessage}
                  onChange={(e) => setWarningMessage(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setDialogOpen(false)} variant="outline">Cancel</Button>
              <Button onClick={handleSendWarning} variant="default">Send Warning</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {onRestrictUser && (
        <Dialog open={restrictDialogOpen} onOpenChange={setRestrictDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="text-red-600"
            >
              <Ban className="mr-2 h-4 w-4" />
              Restrict User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Restrict User</DialogTitle>
              <DialogDescription>
                This will restrict {video.user.username} from uploading new content. They will be notified about this action.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="restriction-reason">Reason for Restriction</Label>
                <Textarea
                  id="restriction-reason"
                  placeholder="Enter the reason for restriction..."
                  value={restrictionReason}
                  onChange={(e) => setRestrictionReason(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setRestrictDialogOpen(false)} variant="outline">Cancel</Button>
              <Button onClick={handleRestrictUser} variant="destructive">Restrict User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {onBanUser && (
        <Dialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="text-red-600"
            >
              <Ban className="mr-2 h-4 w-4" />
              Ban User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ban User</DialogTitle>
              <DialogDescription>
                This will permanently ban {video.user.username} from the platform. This action is severe and should be used only in cases of serious violations.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="ban-reason">Reason for Ban</Label>
                <Textarea
                  id="ban-reason"
                  placeholder="Enter the reason for ban..."
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setBanDialogOpen(false)} variant="outline">Cancel</Button>
              <Button onClick={handleBanUser} variant="destructive">Ban User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default VideoActions;
