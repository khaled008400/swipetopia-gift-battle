
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Upload, Video, Mic, Camera, MessageSquareText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { StreamService } from "@/services/streaming";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { useState } from "react";
import VideoUploadModal from "@/components/upload/VideoUploadModal";
import VideoService from "@/services/video";

interface CreateContentMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateContentMenu: React.FC<CreateContentMenuProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const { requiresAuth, AuthDialog } = useAuthCheck();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  const handleCreateContent = async (type: string) => {
    onClose();
    
    switch (type) {
      case 'video':
        requiresAuth(() => {
          console.log("Opening upload modal");
          setIsUploadModalOpen(true);
        });
        break;
      case 'live':
        requiresAuth(async () => {
          try {
            if (!user) return;
            
            // Use StreamService to start a live stream
            const streamTitle = `${user.username || user.email}'s Live Stream`;
            const stream = await StreamService.startStream(
              streamTitle,
              `Live stream by ${user.username || user.email}`
            );
            
            if (stream) {
              toast({
                title: "Going live!",
                description: "Your stream is being prepared.",
              });
              
              navigate(`/live/${stream.id}`);
            }
          } catch (error) {
            console.error('Error starting live stream:', error);
            toast({
              title: "Error",
              description: "Failed to start live stream. Please try again.",
              variant: "destructive",
            });
          }
        });
        break;
      case 'shop':
        navigate('/shop');
        break;
      case 'wallet':
        navigate('/wallet');
        break;
      case 'post':
        requiresAuth(() => {
          toast({
            title: "Coming soon",
            description: "Post creation feature is coming soon!",
          });
        });
        break;
      default:
        break;
    }
  };
  
  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  const handleVideoUploadSuccess = (videoId: string) => {
    console.log('Video uploaded successfully, ID:', videoId);
    
    toast({
      title: 'Success!',
      description: 'Your video has been uploaded and will appear shortly',
    });
    
    // Refresh the homepage to show the new video
    window.location.href = '/';
  };
  
  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="bottom" className="p-0 rounded-t-3xl">
          <div className="py-6 px-4">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />
            
            <h3 className="text-xl font-bold text-center mb-6">Create</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center h-24 border-2 border-dashed"
                onClick={() => handleCreateContent('video')}
              >
                <Upload className="h-6 w-6 mb-2" />
                <span>Upload Video</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center h-24 border-2 border-dashed"
                onClick={() => handleCreateContent('live')}
              >
                <Video className="h-6 w-6 mb-2" />
                <span>Go Live</span>
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <Button 
                variant="ghost" 
                className="flex flex-col items-center justify-center py-4"
                onClick={() => handleCreateContent('shop')}
              >
                <Camera className="h-5 w-5 mb-2" />
                <span className="text-xs">Shop</span>
              </Button>
              
              <Button 
                variant="ghost" 
                className="flex flex-col items-center justify-center py-4"
                onClick={() => handleCreateContent('wallet')}
              >
                <Mic className="h-5 w-5 mb-2" />
                <span className="text-xs">Wallet</span>
              </Button>
              
              <Button 
                variant="ghost" 
                className="flex flex-col items-center justify-center py-4"
                onClick={() => handleCreateContent('post')}
              >
                <MessageSquareText className="h-5 w-5 mb-2" />
                <span className="text-xs">Post</span>
              </Button>
            </div>
          </div>
          <AuthDialog />
        </SheetContent>
      </Sheet>

      <VideoUploadModal 
        isOpen={isUploadModalOpen} 
        onClose={handleCloseUploadModal} 
        onSuccess={handleVideoUploadSuccess}
      />
    </>
  );
};

export default CreateContentMenu;
