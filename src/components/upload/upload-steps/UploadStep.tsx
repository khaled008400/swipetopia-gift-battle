
import { RefObject } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface UploadStepProps {
  activeTab: "upload" | "record";
  setActiveTab: (tab: "upload" | "record") => void;
  triggerFileInput: () => void;
  fileInputRef: RefObject<HTMLInputElement>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  videoRef: RefObject<HTMLVideoElement>;
  isRecording: boolean;
  recordingDuration: number;
  formatTime: (seconds: number) => string;
  startRecording: () => void;
  stopRecording: () => void;
}

const UploadStep = ({
  activeTab,
  setActiveTab,
  triggerFileInput,
  fileInputRef,
  handleFileChange,
  videoRef,
  isRecording,
  recordingDuration,
  formatTime,
  startRecording,
  stopRecording
}: UploadStepProps) => {
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
};

export default UploadStep;
