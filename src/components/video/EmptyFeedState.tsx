
import React from "react";
import { Loader2, RefreshCw } from "lucide-react";

interface EmptyFeedStateProps {
  isLoading?: boolean;
  onRetry?: () => void;
  error?: string | null;
}

const EmptyFeedState: React.FC<EmptyFeedStateProps> = ({ 
  isLoading = false, 
  onRetry,
  error = null 
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full p-4">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-app-yellow" />
        <p className="text-center text-gray-400">Loading videos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full p-4">
        <div className="text-red-400 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-center text-gray-300 mb-4">{error}</p>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="flex items-center gap-2 bg-app-yellow text-black px-4 py-2 rounded-full hover:bg-opacity-90 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4">
      <p className="text-center text-gray-400 mb-2">No videos available</p>
      <p className="text-center text-gray-500 text-sm">Check back later for new content</p>
    </div>
  );
};

export default EmptyFeedState;
