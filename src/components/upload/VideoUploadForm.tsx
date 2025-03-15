
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { VideoService } from "@/services/video.service";
import { X } from "lucide-react";
import UploadStep from "./upload-steps/UploadStep";
import EditStep from "./upload-steps/EditStep";
import ProcessingStep from "./upload-steps/ProcessingStep";
import CompleteStep from "./upload-steps/CompleteStep";

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

  // Camera & Recording functions
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

  // Clean up camera resources when tab changes
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
          <UploadStep
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            triggerFileInput={triggerFileInput}
            fileInputRef={fileInputRef}
            handleFileChange={handleFileChange}
            videoRef={videoRef}
            isRecording={isRecording}
            recordingDuration={recordingDuration}
            formatTime={formatTime}
            startRecording={startRecording}
            stopRecording={stopRecording}
          />
        );
      
      case "edit":
        return (
          <EditStep
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            hashtags={hashtags}
            setHashtags={setHashtags}
            privacy={privacy}
            setPrivacy={setPrivacy}
            allowDownloads={allowDownloads}
            setAllowDownloads={setAllowDownloads}
            onClose={onClose}
            handleUpload={handleUpload}
            videoPreviewUrl={videoPreviewUrl}
          />
        );
      
      case "processing":
        return (
          <ProcessingStep uploadProgress={uploadProgress} />
        );
      
      case "complete":
        return (
          <CompleteStep
            onClose={onClose}
            onReset={() => {
              setStep("upload");
              setVideoFile(null);
              setVideoPreviewUrl(null);
              setRecordedVideoUrl(null);
              setTitle("");
              setDescription("");
              setHashtags([]);
              setPrivacy("public");
              setAllowDownloads(false);
            }}
          />
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
