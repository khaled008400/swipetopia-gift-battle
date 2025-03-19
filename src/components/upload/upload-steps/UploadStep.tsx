
import React from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface UploadStepProps {
  onSelectFile: (file: File) => void;
}

const UploadStep: React.FC<UploadStepProps> = ({ onSelectFile }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onSelectFile(files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
      <div 
        className="border-2 border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors w-full max-w-md"
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
};

export default UploadStep;
