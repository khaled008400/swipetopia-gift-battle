
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Video } from "@/services/video.service";
import { toast } from "sonner";

interface CompleteStepProps {
  onClose: () => void;
  onReset: () => void;
  videoData?: Video;
}

const CompleteStep = ({ onClose, onReset, videoData }: CompleteStepProps) => {
  const navigate = useNavigate();

  const handleViewVideo = () => {
    if (videoData?.id) {
      toast.success("Navigating to your video");
      navigate(`/videos`);
    }
    onClose();
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-full mb-6">
        <Check className="h-12 w-12 text-green-600 dark:text-green-400" />
      </div>
      
      <h3 className="text-2xl font-bold mb-2">Upload successful!</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
        Your video has been successfully uploaded to Supabase and is now being processed. It will be available soon.
      </p>
      
      {videoData && (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-8 max-w-md w-full">
          <h4 className="font-medium mb-2 text-left">Video details:</h4>
          <div className="text-left text-sm">
            <p><span className="font-medium">Title:</span> {videoData.title || "Untitled"}</p>
            {videoData.description && (
              <p><span className="font-medium">Description:</span> {videoData.description}</p>
            )}
            {videoData.hashtags && videoData.hashtags.length > 0 && (
              <p><span className="font-medium">Tags:</span> {videoData.hashtags.join(", ")}</p>
            )}
            <p>
              <span className="font-medium">Visibility:</span> {videoData.isPublic ? "Public" : "Private"}
            </p>
            <p>
              <span className="font-medium">ID:</span> {videoData.id.substring(0, 8)}...
            </p>
          </div>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Button variant="outline" onClick={onReset} className="flex-1">
          Upload another
        </Button>
        <Button onClick={handleViewVideo} className="flex-1 gap-1">
          View your video <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CompleteStep;
