
import { useState } from "react";
import { VideoIcon, Upload, X } from "lucide-react";
import { Button } from "./ui/button";

interface CreateContentMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateContentMenu = ({ isOpen, onClose }: CreateContentMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center animate-fade-in">
      <div className="absolute top-4 right-4">
        <button 
          onClick={onClose}
          className="rounded-full bg-app-gray-dark w-10 h-10 flex items-center justify-center"
        >
          <X className="text-white w-6 h-6" />
        </button>
      </div>
      
      <div className="flex flex-col gap-6 items-center">
        <Button 
          variant="default" 
          className="bg-red-500 hover:bg-red-600 text-white rounded-xl w-64 py-6 flex flex-col items-center gap-2"
        >
          <VideoIcon className="w-8 h-8" />
          <span className="text-lg font-bold">Go Live</span>
        </Button>
        
        <Button 
          variant="default" 
          className="bg-app-yellow hover:bg-app-yellow-hover text-app-black rounded-xl w-64 py-6 flex flex-col items-center gap-2"
        >
          <Upload className="w-8 h-8" />
          <span className="text-lg font-bold">Upload Video</span>
        </Button>
      </div>
    </div>
  );
};

export default CreateContentMenu;
