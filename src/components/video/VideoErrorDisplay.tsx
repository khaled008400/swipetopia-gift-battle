
interface VideoErrorDisplayProps {
  isLive?: boolean;
}

const VideoErrorDisplay = ({ isLive }: VideoErrorDisplayProps) => {
  return (
    <div className="h-full w-full flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center p-4">
        <p className="text-xl mb-2">Video unavailable</p>
        <p className="text-sm text-gray-400">
          {isLive ? "Live stream" : "Video"} could not be loaded
        </p>
      </div>
    </div>
  );
};

export default VideoErrorDisplay;
