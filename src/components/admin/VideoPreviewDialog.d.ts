
import { AdminVideo } from '@/services/admin.service';

export interface VideoPreviewDialogProps {
  video: AdminVideo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange?: (videoId: string, status: "active" | "flagged" | "removed") => void;
  onDeleteVideo?: (videoId: string) => void;
}
