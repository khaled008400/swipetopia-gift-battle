
import { Dialog, DialogContent } from "@/components/ui/dialog";
import VideoUploadForm from "./VideoUploadForm";

interface VideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (videoId: string) => void;
}

const VideoUploadModal = ({ isOpen, onClose, onSuccess }: VideoUploadModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] h-[80vh] p-0">
        <VideoUploadForm onClose={onClose} onSuccess={onSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default VideoUploadModal;
