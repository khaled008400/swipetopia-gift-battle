
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export interface UploadStepProps {
  onSelectFile: (file: File) => void;
}

const UploadStep: React.FC<UploadStepProps> = ({ onSelectFile }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
  const ACCEPTED_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

  const validateFile = (file: File): boolean => {
    setError(null);
    
    console.log(`Validating file: ${file.name}, size: ${file.size}, type: ${file.type}`);
    
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      const maxSizeMB = MAX_FILE_SIZE / (1024 * 1024);
      setError(`File is too large. Maximum size is ${maxSizeMB}MB, your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`);
      return false;
    }
    
    // Check file type
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError(`File type '${file.type}' not supported. Please upload MP4, WebM, or MOV.`);
      return false;
    }
    
    console.log('File validation passed');
    return true;
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        onSelectFile(file);
      }
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        onSelectFile(file);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div 
        className={`border-2 ${isDragging ? 'border-primary' : 'border-dashed border-gray-300'} rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors w-full max-w-md`}
        onClick={triggerFileInput}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload size={48} className="text-gray-400 mb-4" />
        <h3 className="text-lg font-medium mb-2">Upload a video</h3>
        <p className="text-sm text-gray-500 text-center mb-4">
          Drag and drop a video file or click to browse
        </p>
        <p className="text-xs text-gray-400">
          MP4, WebM, or MOV • Up to 100MB • Up to 10 minutes
        </p>
        <input 
          type="file" 
          accept="video/mp4,video/webm,video/quicktime" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
        />
      </div>
      
      <div className="text-center text-sm text-gray-500">
        <p>Having trouble uploading? Make sure your video:</p>
        <ul className="list-disc text-left inline-block mt-2">
          <li>Is smaller than 100MB</li>
          <li>Is in MP4, WebM, or MOV format</li>
          <li>Has a stable internet connection</li>
          <li>You are logged in to your account</li>
        </ul>
      </div>
    </div>
  );
};

export default UploadStep;
