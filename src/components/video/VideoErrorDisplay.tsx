
import { AlertTriangle, RefreshCw } from "lucide-react";

interface VideoErrorDisplayProps {
  isLive?: boolean;
  message?: string;
  onRetry?: () => void;
  notFound?: boolean;
  isLoading?: boolean;
  isFormatError?: boolean;
}

const VideoErrorDisplay = ({ 
  isLive, 
  message, 
  onRetry, 
  notFound,
  isLoading,
  isFormatError
}: VideoErrorDisplayProps) => {
  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-app-yellow"></div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center p-4 max-w-md">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="h-12 w-12 text-yellow-500" />
        </div>
        <p className="text-xl mb-2">
          {isFormatError 
            ? "Unsupported video format" 
            : notFound 
              ? "Video not found" 
              : "Video unavailable"}
        </p>
        <p className="text-sm text-gray-400 mb-4">
          {message || 
            (isFormatError 
              ? "This video format cannot be played in your browser."
              : `${isLive ? "Live stream" : "Video"} could not be loaded. It may be unavailable or in an unsupported format.`)}
        </p>
        {onRetry && !isFormatError && (
          <button 
            onClick={onRetry}
            className="bg-app-yellow text-app-black px-4 py-2 rounded-full text-sm font-medium hover:bg-opacity-90 transition-all flex items-center mx-auto"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoErrorDisplay;
