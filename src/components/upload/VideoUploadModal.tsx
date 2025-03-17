
import { Dialog, DialogContent } from "@/components/ui/dialog";
import VideoUploadForm from "./VideoUploadForm";
import { ScrollArea } from "@/components/ui/scroll-area";

interface VideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (videoId: string) => void;
}

const VideoUploadModal = ({ isOpen, onClose, onSuccess }: VideoUploadModalProps) => {
  if (!isOpen) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] h-[90vh] max-h-[90vh] p-0">
        <ScrollArea className="h-full max-h-full">
          <VideoUploadForm onClose={onClose} onSuccess={onSuccess} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default VideoUploadModal;
