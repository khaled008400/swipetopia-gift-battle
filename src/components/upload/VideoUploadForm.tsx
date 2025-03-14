
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Globe, Lock, Hash, X, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { VideoService } from "@/services/video.service";
import HashtagInput from "./HashtagInput";
import VideoPreview from "./VideoPreview";

interface VideoUploadFormProps {
  onClose: () => void;
  onSuccess?: (videoId: string) => void;
}

const VideoUploadForm = ({ onClose, onSuccess }: VideoUploadFormProps) => {
  const [step, setStep] = useState<"upload" | "edit" | "processing" | "complete">("upload");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [allowDownloads, setAllowDownloads] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is a video
    if (!file.type.startsWith("video/")) {
      toast({
        title: "Invalid file type",
        description: "Please select a video file",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Video must be less than 100MB",
        variant: "destructive",
      });
      return;
    }

    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoPreviewUrl(url);
    setStep("edit");
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (!videoFile) return;

    try {
      setStep("processing");
      setIsUploading(true);

      // In a real app, we would upload to server/storage here
      // Simulate upload progress for demo
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          
          // Simulate API call to save video metadata
          setTimeout(async () => {
            try {
              // This is where we would actually upload the video
              // For demo, we'll just call the mock service
              const response = await VideoService.uploadVideo({
                title,
                description,
                hashtags,
                isPublic,
                allowDownloads,
                videoFile
              });
              
              setStep("complete");
              setIsUploading(false);
              
              toast({
                title: "Upload successful",
                description: "Your video has been uploaded"
              });
              
              if (onSuccess && response?.id) {
                onSuccess(response.id);
              }
            } catch (error) {
              console.error("Error uploading video:", error);
              toast({
                title: "Upload failed",
                description: "There was an error uploading your video",
                variant: "destructive",
              });
              setIsUploading(false);
              setStep("edit");
            }
          }, 1000);
        }
      }, 100);
    } catch (error) {
      console.error("Error uploading video:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your video",
        variant: "destructive",
      });
      setIsUploading(false);
    }
  };

  const handleAddHashtag = (tag: string) => {
    if (!hashtags.includes(tag)) {
      setHashtags([...hashtags, tag]);
    }
  };

  const handleRemoveHashtag = (tag: string) => {
    setHashtags(hashtags.filter(t => t !== tag));
  };

  const renderStep = () => {
    switch (step) {
      case "upload":
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              onClick={triggerFileInput}
            >
              <Upload size={48} className="text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Upload a video</h3>
              <p className="text-sm text-gray-500 text-center mb-4">
                Drag and drop a video file or click to browse
              </p>
              <p className="text-xs text-gray-400">
                MP4 or WebM • Up to 100MB • Up to 10 minutes
              </p>
              <input 
                type="file" 
                accept="video/*" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
              />
            </div>
          </div>
        );
      
      case "edit":
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
              
              <div className="flex items-center justify-between border p-4 rounded-md">
                <div className="flex items-center">
                  {isPublic ? <Globe size={20} /> : <Lock size={20} />}
                  <span className="ml-2">Who can watch this video</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{isPublic ? "Public" : "Private"}</span>
                  <Switch checked={isPublic} onCheckedChange={setIsPublic} />
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
      
      case "processing":
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <h3 className="text-lg font-medium mb-4">Processing your video...</h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-4">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500">This may take a few minutes</p>
          </div>
        );
      
      case "complete":
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="mb-4 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Upload Complete!</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Your video has been uploaded successfully
            </p>
            <div className="flex space-x-4">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={() => {
                setStep("upload");
                setVideoFile(null);
                setVideoPreviewUrl(null);
                setTitle("");
                setDescription("");
                setHashtags([]);
              }}>
                Upload Another
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center border-b p-4">
        <h2 className="text-xl font-bold">Upload video</h2>
        <button onClick={onClose}>
          <X size={24} />
        </button>
      </div>
      
      <div className="flex-grow p-6 overflow-y-auto">
        {renderStep()}
      </div>
    </div>
  );
};

export default VideoUploadForm;
