
import { Loader2 } from "lucide-react";

interface ProcessingStepProps {
  uploadProgress: number;
}

const ProcessingStep = ({ uploadProgress }: ProcessingStepProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h3 className="text-lg font-medium mb-4">Processing your video...</h3>
      <div className="relative w-full max-w-md h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 mb-4 overflow-hidden">
        <div 
          className="absolute left-0 top-0 h-full bg-app-yellow rounded-full transition-all duration-300 flex items-center justify-center" 
          style={{ width: `${uploadProgress}%` }}
        >
          {uploadProgress >= 15 && (
            <span className="text-xs font-bold text-black px-2">{Math.round(uploadProgress)}%</span>
          )}
        </div>
      </div>
      <div className="flex items-center text-sm text-gray-500 mt-2">
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        <p>This may take a few minutes</p>
      </div>
      
      <div className="mt-8 text-xs text-gray-500 max-w-xs text-center">
        <p>Your video is being encoded for optimal playback across all devices.</p>
        <p className="mt-2">Please don't close this page until the process is complete.</p>
      </div>
    </div>
  );
};

export default ProcessingStep;
