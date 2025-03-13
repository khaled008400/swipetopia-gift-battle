
import { useState } from "react";
import { VideoIcon, Upload, X, Camera } from "lucide-react";

interface CreateContentMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateContentMenu = ({ isOpen, onClose }: CreateContentMenuProps) => {
  const [showRecordOptions, setShowRecordOptions] = useState(false);
  
  if (!isOpen) return null;
  
  if (showRecordOptions) {
    return (
      <RecordingOptions onClose={onClose} />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center animate-fade-in">
      {/* Status bar */}
      <div className="absolute top-0 left-0 right-0 p-2 flex justify-between items-center z-10">
        <div className="text-xl font-bold text-white">9:41</div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-white rounded-full"></div>
          <div className="w-4 h-4 bg-white rounded-full"></div>
          <div className="w-4 h-4 bg-white rounded-full"></div>
        </div>
      </div>
      
      <div className="absolute top-4 right-4">
        <button 
          onClick={onClose}
          className="rounded-full bg-transparent w-10 h-10 flex items-center justify-center"
        >
          <X className="text-white w-6 h-6" />
        </button>
      </div>
      
      {/* Background Image */}
      <img 
        src="/lovable-uploads/6e1ca44a-92c2-4481-b1c7-e8099c0df6a9.png" 
        alt="Background" 
        className="absolute inset-0 w-full h-full object-cover" 
      />
      
      {/* Content area */}
      <div className="relative z-10 h-full flex flex-col justify-between w-full">
        {/* Upload Short text at top */}
        <div className="w-full flex justify-center mt-16">
          <div className="bg-black/50 rounded-lg px-4 py-2">
            <h2 className="text-white font-semibold">Upload Short</h2>
          </div>
        </div>
        
        {/* Bottom action button */}
        <div className="w-full p-6 mb-20">
          <button 
            className="w-full bg-app-yellow text-app-black font-bold py-4 rounded-full"
            onClick={() => setShowRecordOptions(true)}
          >
            UPLOAD SHORT
          </button>
        </div>
      </div>
    </div>
  );
};

// Component for the recording options screen
const RecordingOptions = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center animate-fade-in">
      {/* Status bar */}
      <div className="absolute top-0 left-0 right-0 p-2 flex justify-between items-center z-10">
        <div className="text-xl font-bold text-white">9:41</div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-white rounded-full"></div>
          <div className="w-4 h-4 bg-white rounded-full"></div>
          <div className="w-4 h-4 bg-white rounded-full"></div>
        </div>
      </div>
      
      <div className="absolute top-4 right-4">
        <button 
          onClick={onClose}
          className="rounded-full bg-transparent w-10 h-10 flex items-center justify-center"
        >
          <X className="text-white w-6 h-6" />
        </button>
      </div>
      
      {/* Background Image */}
      <img 
        src="/lovable-uploads/6e1ca44a-92c2-4481-b1c7-e8099c0df6a9.png" 
        alt="Background" 
        className="absolute inset-0 w-full h-full object-cover opacity-70" 
      />
      
      {/* Content area */}
      <div className="relative z-10 h-full flex flex-col justify-between w-full">
        {/* Upload Short text at top */}
        <div className="w-full flex justify-center mt-16">
          <div className="bg-black/50 rounded-lg px-4 py-2">
            <h2 className="text-white font-semibold">Upload Short</h2>
          </div>
        </div>
        
        {/* Right side controls */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-6">
          <button className="bg-black/30 p-2 rounded-full">
            <VideoIcon className="h-6 w-6 text-white" />
          </button>
          <button className="bg-black/30 p-2 rounded-full">
            <Upload className="h-6 w-6 text-white" />
          </button>
          <button className="bg-black/30 p-2 rounded-full">
            <Camera className="h-6 w-6 text-white" />
          </button>
        </div>
        
        {/* Duration options */}
        <div className="w-full flex justify-center space-x-4 mb-20">
          <button className="bg-black/30 text-white px-4 py-2 rounded-full">
            15s
          </button>
          <button className="bg-black/30 text-white px-4 py-2 rounded-full">
            30s
          </button>
          <button className="bg-app-yellow text-app-black font-bold px-4 py-2 rounded-full">
            60s
          </button>
        </div>
        
        {/* Record button */}
        <div className="w-full flex justify-center mb-24">
          <button className="w-20 h-20 rounded-full bg-app-yellow border-4 border-white flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateContentMenu;
