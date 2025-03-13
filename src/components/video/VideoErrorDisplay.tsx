
interface VideoErrorDisplayProps {
  isLive?: boolean;
  message?: string;
  onRetry?: () => void;
}

const VideoErrorDisplay = ({ isLive, message, onRetry }: VideoErrorDisplayProps) => {
  return (
    <div className="h-full w-full flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center p-4">
        <p className="text-xl mb-2">Video unavailable</p>
        <p className="text-sm text-gray-400 mb-4">
          {message || `${isLive ? "Live stream" : "Video"} could not be loaded`}
        </p>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="bg-app-yellow text-app-black px-4 py-2 rounded-full text-sm font-medium hover:bg-opacity-90 transition-all"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoErrorDisplay;
