
import { useState } from "react";
import { Heart, MessageCircle, Share2, Coins, Download, Flag, Bookmark } from "lucide-react";
import VideoComments from "./VideoComments";
import { useToast } from "@/hooks/use-toast";
import VideoService from '@/services/video.service';
import ReportVideoDialog from "./ReportVideoDialog";

interface VideoActionsProps {
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  onLike: () => void;
  videoId?: string;
  allowDownloads?: boolean;
  onSave?: () => void;
  isSaved?: boolean;
}

const VideoActions = ({
  likes,
  comments,
  shares,
  isLiked,
  onLike,
  videoId = "1",
  allowDownloads = false,
  onSave,
  isSaved = false
}: VideoActionsProps) => {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [showTipOptions, setShowTipOptions] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleLikeClick = () => {
    onLike();
  };

  const handleCommentClick = () => {
    setIsCommentsOpen(true);
    toast({
      title: "Comments opened",
      description: "Join the conversation!",
      duration: 1500
    });
  };

  const handleShare = async () => {
    try {
      // Removing the reference to non-existent shareVideo method
      if (navigator.share) {
        navigator.share({
          title: 'Check out this video!',
          text: 'I found this amazing video you should watch',
          url: window.location.href
        }).then(() => console.log('Successful share')).catch(error => console.log('Error sharing:', error));
      } else {
        toast({
          title: "Link copied",
          description: "Video link copied to clipboard!",
          duration: 2000
        });

        navigator.clipboard.writeText(window.location.href).catch(err => console.error('Failed to copy:', err));
      }
    } catch (error) {
      console.error("Error sharing video:", error);
    }
  };

  const handleTipClick = () => {
    setShowTipOptions(!showTipOptions);
    
    if (!showTipOptions) {
      toast({
        title: "Tip options opened",
        description: "Choose an amount to send to the creator",
        duration: 2000
      });
    }
  };

  const sendTip = (amount: number) => {
    toast({
      title: "Thank you!",
      description: `You sent a ${amount} coin tip to the creator!`,
      duration: 3000,
    });
    setShowTipOptions(false);
  };

  const handleDownload = async () => {
    if (!allowDownloads) {
      toast({
        title: "Download not allowed",
        description: "The creator has not enabled downloads for this video",
        variant: "destructive",
        duration: 2000
      });
      return;
    }

    try {
      // Instead of calling non-existent downloadVideo method, we'll just show a toast
      toast({
        title: "Downloading video",
        description: "Your download has started",
        duration: 2000
      });
      
      // Download functionality can be implemented in the VideoService
      if (videoId) {
        const videoUrl = `${window.location.origin}/api/videos/${videoId}/download`;
        const link = document.createElement('a');
        link.href = videoUrl;
        link.setAttribute('download', `video-${videoId}.mp4`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error downloading video:", error);
      toast({
        title: "Download failed",
        description: "There was an error downloading this video",
        variant: "destructive",
        duration: 2000
      });
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave();
    }
    toast({
      title: isSaved ? "Removed from saved" : "Saved",
      description: isSaved 
        ? "Video removed from your saved videos" 
        : "Video saved to your collection",
      duration: 2000
    });
  };

  const handleReport = () => {
    setIsReportDialogOpen(true);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex flex-col items-center">
        <button 
          onClick={handleLikeClick}
          className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center"
        >
          <Heart 
            className={`h-6 w-6 ${isLiked ? "fill-red-500 text-red-500" : "text-white"}`} 
          />
        </button>
        <span className="text-white text-xs mt-1">{likes}</span>
      </div>
      
      <div className="flex flex-col items-center">
        <button 
          onClick={handleCommentClick}
          className={`w-12 h-12 rounded-full ${isCommentsOpen ? 'bg-gradient-to-r from-[#9b87f5]/80 to-[#D946EF]/80' : 'bg-black/40 backdrop-blur-md'} flex items-center justify-center transition-all duration-300`}
        >
          <MessageCircle className={`h-6 w-6 ${isCommentsOpen ? 'text-white' : 'text-white'}`} />
        </button>
        <span className="text-white text-xs mt-1">{comments}</span>
      </div>
      
      <div className="flex flex-col items-center">
        <button 
          onClick={handleShare}
          className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center"
        >
          <Share2 className="h-6 w-6 text-white" />
        </button>
        <span className="text-white text-xs mt-1">{shares}</span>
      </div>
      
      <div className="flex flex-col items-center">
        <button 
          onClick={handleSave}
          className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center"
        >
          <Bookmark className={`h-6 w-6 ${isSaved ? "fill-yellow-500 text-yellow-500" : "text-white"}`} />
        </button>
        <span className="text-white text-xs mt-1">Save</span>
      </div>
      
      {allowDownloads && (
        <div className="flex flex-col items-center">
          <button 
            onClick={handleDownload}
            className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center"
          >
            <Download className="h-6 w-6 text-white" />
          </button>
          <span className="text-white text-xs mt-1">Download</span>
        </div>
      )}
      
      <div className="flex flex-col items-center">
        <button 
          onClick={handleReport}
          className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center"
        >
          <Flag className="h-6 w-6 text-white" />
        </button>
        <span className="text-white text-xs mt-1">Report</span>
      </div>
      
      <div className="flex flex-col items-center relative">
        <button 
          onClick={handleTipClick}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-[#9b87f5] to-[#D946EF] flex items-center justify-center"
        >
          <Coins className="h-6 w-6 text-white" />
        </button>
        <span className="text-white text-xs mt-1">Tip</span>
        
        {showTipOptions && (
          <div className="absolute bottom-16 right-0 bg-black/80 backdrop-blur-md rounded-lg p-3 w-32 shadow-lg animate-in fade-in slide-in-from-bottom-5 z-50">
            <div className="flex flex-col space-y-2">
              <button 
                onClick={() => sendTip(5)} 
                className="bg-gradient-to-r from-[#9b87f5]/80 to-[#D946EF]/80 px-3 py-1.5 rounded-md text-white hover:from-[#9b87f5] hover:to-[#D946EF] transition-all"
              >
                5 Coins
              </button>
              <button 
                onClick={() => sendTip(10)} 
                className="bg-gradient-to-r from-[#9b87f5]/80 to-[#D946EF]/80 px-3 py-1.5 rounded-md text-white hover:from-[#9b87f5] hover:to-[#D946EF] transition-all"
              >
                10 Coins
              </button>
              <button 
                onClick={() => sendTip(50)} 
                className="bg-gradient-to-r from-[#9b87f5]/80 to-[#D946EF]/80 px-3 py-1.5 rounded-md text-white hover:from-[#9b87f5] hover:to-[#D946EF] transition-all"
              >
                50 Coins
              </button>
              <button 
                onClick={() => sendTip(100)} 
                className="bg-gradient-to-r from-[#9b87f5] to-[#D946EF] px-3 py-1.5 rounded-md text-white font-medium"
              >
                100 Coins 🔥
              </button>
            </div>
          </div>
        )}
      </div>
      
      {isCommentsOpen && (
        <VideoComments 
          isOpen={isCommentsOpen} 
          onClose={() => setIsCommentsOpen(false)} 
          videoId={videoId}
        />
      )}

      <ReportVideoDialog 
        isOpen={isReportDialogOpen} 
        onClose={() => setIsReportDialogOpen(false)} 
        videoId={videoId} 
      />
    </div>
  );
};

export default VideoActions;
