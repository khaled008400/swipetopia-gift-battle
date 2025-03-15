
interface ProcessingStepProps {
  uploadProgress: number;
}

const ProcessingStep = ({ uploadProgress }: ProcessingStepProps) => {
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
};

export default ProcessingStep;
