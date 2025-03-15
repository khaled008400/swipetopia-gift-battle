
import { Loader2 } from "lucide-react";

interface ProcessingStepProps {
  uploadProgress: number;
}

const ProcessingStep = ({ uploadProgress }: ProcessingStepProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h3 className="text-lg font-medium mb-4">Processing your video...</h3>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-4">
        <div 
          className="bg-app-yellow h-2.5 rounded-full transition-all duration-300" 
          style={{ width: `${uploadProgress}%` }}
        ></div>
      </div>
      <div className="flex items-center text-sm text-gray-500 mt-2">
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        <p>This may take a few minutes</p>
      </div>
    </div>
  );
};

export default ProcessingStep;
