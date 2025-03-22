
import React from "react";
import { Loader2 } from "lucide-react";

interface EmptyFeedStateProps {
  isLoading?: boolean;
}

const EmptyFeedState: React.FC<EmptyFeedStateProps> = ({ isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p className="text-center text-gray-500">Loading videos...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <p className="text-center text-gray-500">No videos available</p>
    </div>
  );
};

export default EmptyFeedState;
