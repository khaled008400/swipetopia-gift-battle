
import { useState, useRef } from "react";
import { VideoIcon, Upload, X, Camera } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface CreateContentMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateContentMenu = ({ isOpen, onClose }: CreateContentMenuProps) => {
  const [showRecordOptions, setShowRecordOptions] = useState(false);
  
  if (!isOpen) return null;
  
  if (showRecordOptions) {
    return (
      <RecordingOptions onClose={onClose} />
    );
  }

  const handleUploadVideo = () => {
    // Create an input element to open file selector
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'video/*';
    fileInput.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        toast({
          title: "Video selected",
          description: `You selected: ${file.name}`,
        });
        console.log("Selected video file:", file);
        // Here we would implement the actual upload functionality
        onClose();
      }
    };
    fileInput.click();
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center animate-fade-in">
      {/* Status bar */}
      <div className="absolute top-0 left-0 right-0 p-2 flex justify-between items-center z-10">
        <div className="text-xl font-bold text-white">9:41</div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-white rounded-full"></div>
          <div className="w-4 h-4 bg-white rounded-full"></div>
          <div className="w-4 h-4 bg-white rounded-full"></div>
        </div>
      </div>
      
      <div className="absolute top-4 right-4">
        <button 
          onClick={onClose}
          className="rounded-full bg-transparent w-10 h-10 flex items-center justify-center"
        >
          <X className="text-white w-6 h-6" />
        </button>
      </div>
      
      {/* Content options */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md p-6">
        <h2 className="text-white text-2xl font-bold mb-8">Create Content</h2>
        
        <div className="space-y-4 w-full">
          <button 
            className="w-full bg-app-black border border-app-yellow text-app-yellow font-bold py-4 rounded-xl flex items-center justify-center gap-3"
            onClick={() => setShowRecordOptions(true)}
          >
            <VideoIcon className="h-6 w-6" />
            <span>Record Video</span>
          </button>
          
          <button 
            className="w-full bg-app-black border border-app-yellow text-app-yellow font-bold py-4 rounded-xl flex items-center justify-center gap-3"
            onClick={handleUploadVideo}
          >
            <Upload className="h-6 w-6" />
            <span>Upload Video</span>
          </button>
          
          <button 
            className="w-full bg-app-yellow text-app-black font-bold py-4 rounded-xl flex items-center justify-center gap-3"
            onClick={() => window.location.href = "/live/new"}
          >
            <Camera className="h-6 w-6" />
            <span>Go Live</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Component for the recording options screen
const RecordingOptions = ({ onClose }: { onClose: () => void }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [selectedDuration, setSelectedDuration] = useState("60s");
  
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
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
  
  // Initialize camera when component mounts
  useState(() => {
    startCamera();
    
    return () => {
      // Clean up stream when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  });
  
  const startRecording = () => {
    setIsRecording(true);
    // Here we would implement actual recording functionality using MediaRecorder API
    console.log("Starting video recording with duration:", selectedDuration);
    toast({
      title: "Recording started",
      description: `Recording for ${selectedDuration}`,
    });
  };
  
  const stopRecording = () => {
    setIsRecording(false);
    // Here we would implement the stop recording and save functionality
    console.log("Stopping video recording");
    toast({
      title: "Recording stopped",
      description: "Your video has been saved",
    });
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-between animate-fade-in">
      {/* Status bar */}
      <div className="absolute top-0 left-0 right-0 p-2 flex justify-between items-center z-10">
        <div className="text-xl font-bold text-white">9:41</div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-white rounded-full"></div>
          <div className="w-4 h-4 bg-white rounded-full"></div>
          <div className="w-4 h-4 bg-white rounded-full"></div>
        </div>
      </div>
      
      <div className="absolute top-4 right-4">
        <button 
          onClick={() => {
            if (stream) {
              stream.getTracks().forEach(track => track.stop());
            }
            onClose();
          }}
          className="rounded-full bg-transparent w-10 h-10 flex items-center justify-center"
        >
          <X className="text-white w-6 h-6" />
        </button>
      </div>
      
      {/* Camera viewport */}
      <div className="w-full flex-1 bg-app-gray-dark flex items-center justify-center overflow-hidden">
        <video 
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="h-full w-full object-cover"
        />
      </div>
      
      {/* Right side controls */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-6">
        <button className="bg-black/30 p-2 rounded-full">
          <VideoIcon className="h-6 w-6 text-white" />
        </button>
        <button className="bg-black/30 p-2 rounded-full">
          <Upload className="h-6 w-6 text-white" />
        </button>
        <button className="bg-black/30 p-2 rounded-full">
          <Camera className="h-6 w-6 text-white" />
        </button>
      </div>
      
      {/* Duration options */}
      <div className="w-full flex justify-center space-x-4 mb-6">
        <button 
          className={`${selectedDuration === "15s" ? "bg-app-yellow text-app-black font-bold" : "bg-black/30 text-white"} px-4 py-2 rounded-full`}
          onClick={() => setSelectedDuration("15s")}
        >
          15s
        </button>
        <button 
          className={`${selectedDuration === "30s" ? "bg-app-yellow text-app-black font-bold" : "bg-black/30 text-white"} px-4 py-2 rounded-full`}
          onClick={() => setSelectedDuration("30s")}
        >
          30s
        </button>
        <button 
          className={`${selectedDuration === "60s" ? "bg-app-yellow text-app-black font-bold" : "bg-black/30 text-white"} px-4 py-2 rounded-full`}
          onClick={() => setSelectedDuration("60s")}
        >
          60s
        </button>
      </div>
      
      {/* Record button */}
      <div className="w-full flex justify-center mb-24">
        <button 
          className={`w-20 h-20 rounded-full ${isRecording ? 'bg-red-500' : 'bg-app-yellow'} border-4 border-white flex items-center justify-center`}
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? (
            <div className="w-8 h-8 rounded-sm bg-white"></div>
          ) : (
            <div className="w-14 h-14 rounded-full bg-white"></div>
          )}
        </button>
      </div>
    </div>
  );
};

export default CreateContentMenu;
