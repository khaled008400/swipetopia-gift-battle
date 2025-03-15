
import { Button } from "@/components/ui/button";

interface CompleteStepProps {
  onClose: () => void;
  onReset: () => void;
}

const CompleteStep = ({ onClose, onReset }: CompleteStepProps) => {
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
        <Button onClick={onReset}>
          Upload Another
        </Button>
      </div>
    </div>
  );
};

export default CompleteStep;
