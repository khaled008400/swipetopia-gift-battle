
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Globe, Lock, Users } from "lucide-react";
import HashtagInput from "../HashtagInput";
import VideoPreview from "../VideoPreview";

interface EditStepProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  hashtags: string[];
  setHashtags: (hashtags: string[]) => void;
  privacy: "public" | "private" | "followers";
  setPrivacy: (privacy: "public" | "private" | "followers") => void;
  allowDownloads: boolean;
  setAllowDownloads: (allowDownloads: boolean) => void;
  onClose: () => void;
  handleUpload: () => void;
  videoPreviewUrl: string | null;
}

const EditStep = ({
  title,
  setTitle,
  description,
  setDescription,
  hashtags,
  setHashtags,
  setPrivacy,
  privacy,
  allowDownloads,
  setAllowDownloads,
  onClose,
  handleUpload,
  videoPreviewUrl
}: EditStepProps) => {
  const handleAddHashtag = (tag: string) => {
    if (!hashtags.includes(tag)) {
      setHashtags([...hashtags, tag]);
    }
  };

  const handleRemoveHashtag = (tag: string) => {
    setHashtags(hashtags.filter(t => t !== tag));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex flex-col space-y-4">
        <div>
          <Label htmlFor="title" className="mb-2 block">Title</Label>
          <Input 
            id="title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Add a title that describes your video"
            className="w-full"
          />
        </div>
        
        <div>
          <Label htmlFor="description" className="mb-2 block">Description</Label>
          <Textarea 
            id="description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Tell viewers about your video"
            className="w-full resize-none"
            rows={4}
          />
        </div>
        
        <div>
          <Label className="mb-2 block">Hashtags</Label>
          <HashtagInput 
            hashtags={hashtags} 
            onAdd={handleAddHashtag} 
            onRemove={handleRemoveHashtag} 
          />
        </div>
        
        <div className="space-y-3">
          <Label className="block">Privacy</Label>
          <div className="space-y-2">
            <div className="flex items-center justify-between border p-3 rounded-md cursor-pointer" onClick={() => setPrivacy("public")}>
              <div className="flex items-center">
                <Globe size={18} className="mr-2" />
                <span>Public</span>
              </div>
              <div className={`h-4 w-4 rounded-full ${privacy === "public" ? "bg-blue-500" : "border border-gray-400"}`}></div>
            </div>
            
            <div className="flex items-center justify-between border p-3 rounded-md cursor-pointer" onClick={() => setPrivacy("followers")}>
              <div className="flex items-center">
                <Users size={18} className="mr-2" />
                <span>Followers only</span>
              </div>
              <div className={`h-4 w-4 rounded-full ${privacy === "followers" ? "bg-blue-500" : "border border-gray-400"}`}></div>
            </div>
            
            <div className="flex items-center justify-between border p-3 rounded-md cursor-pointer" onClick={() => setPrivacy("private")}>
              <div className="flex items-center">
                <Lock size={18} className="mr-2" />
                <span>Private</span>
              </div>
              <div className={`h-4 w-4 rounded-full ${privacy === "private" ? "bg-blue-500" : "border border-gray-400"}`}></div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between border p-4 rounded-md">
          <div className="flex items-center">
            <span>Allow downloads</span>
          </div>
          <div className="flex items-center space-x-2">
            <Switch checked={allowDownloads} onCheckedChange={setAllowDownloads} />
          </div>
        </div>
        
        <div className="flex space-x-2 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleUpload} className="flex-1" disabled={!title.trim()}>
            Upload
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col items-center">
        {videoPreviewUrl && (
          <VideoPreview src={videoPreviewUrl} />
        )}
      </div>
    </div>
  );
};

export default EditStep;
