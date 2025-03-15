
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Globe, Lock, Hash, X, Upload, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { VideoService } from "@/services/video.service";
import HashtagInput from "./HashtagInput";
import VideoPreview from "./VideoPreview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VideoUploadFormProps {
  onClose: () => void;
  onSuccess?: (videoId: string) => void;
}

const VideoUploadForm = ({ onClose, onSuccess }: VideoUploadFormProps) => {
  const [step, setStep] = useState<"upload" | "edit" | "processing" | "complete">("upload");
  const [activeTab, setActiveTab] = useState<"upload" | "record">("upload");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [privacy, setPrivacy] = useState<"public" | "private" | "followers">("public");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [allowDownloads, setAllowDownloads] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingTimer, setRecordingTimer] = useState<number | null>(null);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);

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
    if (!videoFile && !recordedVideoUrl) return;

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
              // Get final video file (either from upload or recording)
              const finalVideoFile = videoFile || (recordedVideoUrl ? await fetch(recordedVideoUrl).then(r => r.blob()).then(blob => new File([blob], "recorded-video.webm", { type: "video/webm" })) : null);
              
              if (!finalVideoFile) {
                throw new Error("No video file available");
              }
              
              // For demo, we'll just call the mock service
              const response = await VideoService.uploadVideo({
                title,
                description,
                hashtags,
                isPublic: privacy === "public",
                allowDownloads,
                videoFile: finalVideoFile
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

  // Recording functions
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user", width: { ideal: 1080 }, height: { ideal: 1920 } }, 
        audio: true 
      });
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        variant: "destructive",
        title: "Camera access denied",
        description: "Please allow camera and microphone access to record videos",
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const startRecording = () => {
    if (!stream) return;
    
    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setRecordedVideoUrl(url);
      setVideoPreviewUrl(url);
      setStep("edit");
    };
    
    mediaRecorder.start();
    setIsRecording(true);
    
    // Set a timer to show recording duration
    let duration = 0;
    const timer = window.setInterval(() => {
      duration += 1;
      setRecordingDuration(duration);
      
      // Automatically stop recording after 60 seconds
      if (duration >= 60) {
        stopRecording();
      }
    }, 1000);
    
    setRecordingTimer(timer);
  };
  
  const stopRecording = () => {
    if (recordingTimer) {
      clearInterval(recordingTimer);
      setRecordingTimer(null);
    }
    
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingDuration(0);
    }
  };

  useEffect(() => {
    if (activeTab === "record") {
      startCamera();
    } else {
      stopCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [activeTab]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const renderStep = () => {
    switch (step) {
      case "upload":
        return (
          <div className="flex flex-col h-full">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "upload" | "record")} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="record">Record</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload" className="flex-1">
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
              </TabsContent>
              
              <TabsContent value="record" className="h-full">
                <div className="h-full flex flex-col">
                  <div className="relative bg-black aspect-[9/16] rounded-lg overflow-hidden flex-1">
                    <video 
                      ref={videoRef}
                      autoPlay 
                      playsInline
                      muted
                      className="h-full w-full object-cover"
                    />
                    
                    {isRecording && (
                      <div className="absolute top-4 left-0 right-0 flex justify-center">
                        <div className="bg-black/50 backdrop-blur-sm px-4 py-1 rounded-full flex items-center space-x-2">
                          <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse"></div>
                          <span className="text-white text-sm">{formatTime(recordingDuration)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-center mt-4">
                    {!isRecording ? (
                      <Button 
                        onClick={startRecording}
                        className="rounded-full w-16 h-16 p-0 bg-red-500 hover:bg-red-600"
                      >
                        <div className="w-6 h-6 rounded-full bg-white"></div>
                      </Button>
                    ) : (
                      <Button 
                        onClick={stopRecording}
                        className="rounded-full w-16 h-16 p-0 bg-red-500 hover:bg-red-600"
                      >
                        <div className="w-6 h-6 bg-white rounded-sm"></div>
                      </Button>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
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
                setRecordedVideoUrl(null);
                setTitle("");
                setDescription("");
                setHashtags([]);
                setPrivacy("public");
                setAllowDownloads(false);
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
        <h2 className="text-xl font-bold">
          {step === "upload" ? "Upload video" : 
           step === "edit" ? "Edit video" :
           step === "processing" ? "Processing video" :
           "Upload complete"}
        </h2>
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
