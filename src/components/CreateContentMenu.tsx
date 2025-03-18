
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Upload, Video, Mic, Camera, MessageSquareText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

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
  const { user } = useAuth();
  
  const handleCreateContent = async (type: string) => {
    onClose();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create content",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    switch (type) {
      case 'video':
        navigate('/videos');
        break;
      case 'live':
        try {
          // Check if user already has an active stream
          const { data: existingStream, error: checkError } = await supabase
            .from('streams')
            .select('id')
            .eq('user_id', user.id)
            .eq('status', 'online')
            .maybeSingle();
          
          if (checkError) {
            console.error('Error checking for active streams:', checkError);
            throw checkError;
          }
          
          if (existingStream) {
            // If there's an existing stream, navigate to it
            navigate(`/live/${existingStream.id}`);
            toast({
              title: "Resuming stream",
              description: "Reconnecting to your active stream.",
            });
          } else {
            // Create a new stream and navigate to it
            const { data: newStream, error: createError } = await supabase
              .from('streams')
              .insert({
                title: `${user.username || user.email}'s Live Stream`,
                user_id: user.id,
                status: 'online'
              })
              .select()
              .single();
            
            if (createError) {
              console.error('Error creating stream:', createError);
              throw createError;
            }
            
            toast({
              title: "Going live!",
              description: "Your stream is being prepared.",
            });
            
            navigate(`/live/${newStream.id}`);
          }
        } catch (error) {
          console.error('Error starting live stream:', error);
          toast({
            title: "Error",
            description: "Failed to start live stream. Please try again.",
            variant: "destructive",
          });
        }
        break;
      case 'post':
        toast({
          title: "Coming soon",
          description: "Post creation feature is coming soon!",
        });
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
              onClick={() => {
                toast({
                  title: "Coming soon",
                  description: "Photo upload feature is coming soon!",
                });
              }}
            >
              <Camera className="h-5 w-5 mb-2" />
              <span className="text-xs">Photo</span>
            </Button>
            
            <Button 
              variant="ghost" 
              className="flex flex-col items-center justify-center py-4"
              onClick={() => {
                toast({
                  title: "Coming soon",
                  description: "Audio upload feature is coming soon!",
                });
              }}
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
