
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Upload, Video, Mic, Camera, MessageSquareText } from "lucide-react";

interface CreateContentMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateContentMenu: React.FC<CreateContentMenuProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const navigate = useNavigate();
  
  const handleCreateContent = (type: string) => {
    onClose();
    
    switch (type) {
      case 'video':
        navigate('/videos');
        break;
      case 'live':
        navigate('/live');
        break;
      case 'post':
        // Navigate to post creation page when implemented
        break;
      default:
        break;
    }
  };
  
  return (
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
              onClick={() => {}}
            >
              <Camera className="h-5 w-5 mb-2" />
              <span className="text-xs">Photo</span>
            </Button>
            
            <Button 
              variant="ghost" 
              className="flex flex-col items-center justify-center py-4"
              onClick={() => {}}
            >
              <Mic className="h-5 w-5 mb-2" />
              <span className="text-xs">Audio</span>
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
      </SheetContent>
    </Sheet>
  );
};

export default CreateContentMenu;
