
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import VideoService from "@/services/video.service";
import UploadService from "@/services/upload.service";
import { Upload, X, Loader2, Users, Globe, Lock } from "lucide-react";
import HashtagInput from "./HashtagInput";
import VideoPreview from "./VideoPreview";

interface VideoUploadFormProps {
  onClose: () => void;
  onSuccess?: (videoId: string) => void;
}

const VideoUploadForm = ({ onClose, onSuccess }: VideoUploadFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [privacy, setPrivacy] = useState<"public" | "followers" | "private">("public");
  const [allowDownloads, setAllowDownloads] = useState(true);
  const [step, setStep] = useState<"upload" | "edit">("upload");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log("Selected video file:", file.name, file.type, file.size);
      setVideoFile(file);
      
      // Create URL for video preview
      const videoURL = URL.createObjectURL(file);
      setVideoPreviewUrl(videoURL);
      
      const video = document.createElement("video");
      video.preload = "metadata";
      video.src = videoURL;
      
      video.onloadedmetadata = () => {
        video.currentTime = 1;
      };
      
      // Fix the type issue by explicitly typing the function with correct 'this' context
      const handleTimeUpdate = function(this: HTMLVideoElement) {
        // Only create the thumbnail once we've seeked to the desired time
        if (video.currentTime >= 1) {
          console.log("Video seeked to timestamp, creating thumbnail");
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const thumbnailDataUrl = canvas.toDataURL("image/jpeg");
            setThumbnail(thumbnailDataUrl);
            
            // Convert data URL to file
            fetch(thumbnailDataUrl)
              .then(res => res.blob())
              .then(blob => {
                const thumbnailFile = new File([blob], "thumbnail.jpg", { type: "image/jpeg" });
                setThumbnailFile(thumbnailFile);
                console.log("Thumbnail created:", thumbnailFile.size);
                
                // Move to edit step
                setStep("edit");
              })
              .catch(err => {
                console.error("Error creating thumbnail file:", err);
                // Still move to edit step even if thumbnail fails
                setStep("edit");
              });
          } else {
            console.error("Could not get canvas context");
            setStep("edit");
          }
          
          // Remove the event listener once we've created the thumbnail
          video.removeEventListener('timeupdate', handleTimeUpdate);
        }
      };
      
      video.addEventListener('timeupdate', handleTimeUpdate);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    if (!videoFile) {
      toast({
        title: "Error",
        description: "Please select a video file to upload",
        variant: "destructive",
      });
      return;
    }
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please provide a title for your video",
        variant: "destructive",
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to upload videos",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsUploading(true);
      setProgress(0);
      
      console.log("Starting upload process");
      
      // Upload progress simulation
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 5;
        });
      }, 500);
      
      console.log("Uploading video and thumbnail to storage");
      
      // Upload video and thumbnail to Supabase storage
      const { videoUrl, thumbnailUrl } = await UploadService.uploadVideo(videoFile, thumbnailFile);
      
      console.log("Files uploaded successfully:", { videoUrl, thumbnailUrl });
      
      // Calculate privacy setting
      const isPrivate = privacy === "private";
      
      console.log("Saving video metadata to database");
      
      // Save video metadata to database
      const videoData = await VideoService.uploadVideo(
        videoFile, 
        title,
        description,
        thumbnailUrl,
        isPrivate,
        hashtags
      );
      
      clearInterval(progressInterval);
      setProgress(100);
      
      console.log("Video upload complete:", videoData);
      
      toast({
        title: "Success",
        description: "Your video has been uploaded successfully",
      });
      
      if (onSuccess && videoData) {
        onSuccess(videoData.id);
      }
      
      onClose();
    } catch (error: any) {
      console.error("Error uploading video:", error);
      setErrorMessage(error?.message || "There was an error uploading your video");
      toast({
        title: "Upload failed",
        description: error?.message || "There was an error uploading your video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearSelectedFile = () => {
    setVideoFile(null);
    setVideoPreviewUrl(null);
    setThumbnail(null);
    setStep("upload");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!user) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-full">
        <h2 className="text-xl font-semibold mb-2">Sign in Required</h2>
        <p className="text-gray-500 mb-4 text-center">
          You need to be signed in to upload videos.
        </p>
        <Button onClick={onClose}>Close</Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {step === "upload" ? "Upload Video" : "Edit Video"}
        </h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <p>{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === "upload" ? (
          <div className="space-y-2">
            <Label htmlFor="video-file">Select Video</Label>
            <input
              ref={fileInputRef}
              id="video-file"
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <div 
              onClick={triggerFileInput}
              className="border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              <Upload className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-center text-gray-500">
                Click to select a video file or drag and drop
              </p>
              <p className="text-center text-gray-400 text-sm mt-2">
                MP4, WebM or MOV up to 50MB
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Add a title that describes your video"
                  disabled={isUploading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell viewers about your video (optional)"
                  disabled={isUploading}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Hashtags</Label>
                <HashtagInput 
                  hashtags={hashtags}
                  onAdd={handleAddHashtag}
                  onRemove={handleRemoveHashtag}
                  disabled={isUploading}
                />
              </div>

              <div className="space-y-3">
                <Label>Privacy</Label>
                <div className="space-y-2">
                  <div 
                    className={`flex items-center justify-between p-3 rounded-md cursor-pointer ${privacy === "public" ? "bg-gray-100 dark:bg-gray-800" : "hover:bg-gray-50 dark:hover:bg-gray-900"}`}
                    onClick={() => setPrivacy("public")}
                  >
                    <div className="flex items-center">
                      <Globe className="h-5 w-5 mr-2 text-gray-500" />
                      <div>
                        <p className="font-medium">Public</p>
                        <p className="text-sm text-gray-500">Anyone can view</p>
                      </div>
                    </div>
                    <div className={`h-5 w-5 rounded-full ${privacy === "public" ? "bg-blue-500" : "border border-gray-300"}`}></div>
                  </div>
                  
                  <div 
                    className={`flex items-center justify-between p-3 rounded-md cursor-pointer ${privacy === "followers" ? "bg-gray-100 dark:bg-gray-800" : "hover:bg-gray-50 dark:hover:bg-gray-900"}`}
                    onClick={() => setPrivacy("followers")}
                  >
                    <div className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-gray-500" />
                      <div>
                        <p className="font-medium">Followers only</p>
                        <p className="text-sm text-gray-500">Only your followers can view</p>
                      </div>
                    </div>
                    <div className={`h-5 w-5 rounded-full ${privacy === "followers" ? "bg-blue-500" : "border border-gray-300"}`}></div>
                  </div>
                  
                  <div 
                    className={`flex items-center justify-between p-3 rounded-md cursor-pointer ${privacy === "private" ? "bg-gray-100 dark:bg-gray-800" : "hover:bg-gray-50 dark:hover:bg-gray-900"}`}
                    onClick={() => setPrivacy("private")}
                  >
                    <div className="flex items-center">
                      <Lock className="h-5 w-5 mr-2 text-gray-500" />
                      <div>
                        <p className="font-medium">Private</p>
                        <p className="text-sm text-gray-500">Only you can view</p>
                      </div>
                    </div>
                    <div className={`h-5 w-5 rounded-full ${privacy === "private" ? "bg-blue-500" : "border border-gray-300"}`}></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <span>Allow downloads</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={allowDownloads}
                    onChange={() => setAllowDownloads(!allowDownloads)}
                  />
                  <div className={`w-11 h-6 rounded-full ${allowDownloads ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"} peer`}>
                    <div className={`w-5 h-5 rounded-full bg-white absolute top-[2px] ${allowDownloads ? "right-[2px]" : "left-[2px]"} transition-all`}></div>
                  </div>
                </label>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex flex-col space-y-4">
              {videoPreviewUrl && (
                <VideoPreview src={videoPreviewUrl} />
              )}
              
              <Button
                type="button"
                variant="outline"
                onClick={clearSelectedFile}
                disabled={isUploading}
              >
                Choose different video
              </Button>
            </div>
          </div>
        )}

        {step === "edit" && (
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!videoFile || !title.trim() || isUploading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading
                </>
              ) : (
                "Upload"
              )}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default VideoUploadForm;
