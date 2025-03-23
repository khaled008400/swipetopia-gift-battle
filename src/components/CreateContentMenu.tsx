
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Video, Mic, ShoppingBag, VideoIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CreateContentMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateContentMenu: React.FC<CreateContentMenuProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  
  const handleVideoUpload = () => {
    navigate('/?upload=true');
    onClose();
  };
  
  const handleStartLive = () => {
    navigate('/broadcast');
    onClose();
  };
  
  const handleCreateProduct = () => {
    navigate('/seller/dashboard?tab=products&action=create');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          <motion.div
            className="fixed bottom-20 inset-x-0 z-50 px-4"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.3 }}
          >
            <div className="bg-app-gray-dark rounded-xl overflow-hidden max-w-sm mx-auto">
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-center">Create</h3>
              </div>
              
              <div className="p-2">
                <button
                  onClick={handleVideoUpload}
                  className="flex items-center w-full p-4 hover:bg-gray-800 rounded-lg transition"
                >
                  <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center mr-4">
                    <Video className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium">Upload Video</h4>
                    <p className="text-sm text-gray-400">Share your video with followers</p>
                  </div>
                </button>
                
                <button
                  onClick={handleStartLive}
                  className="flex items-center w-full p-4 hover:bg-gray-800 rounded-lg transition"
                >
                  <div className="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center mr-4">
                    <VideoIcon className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium">Go Live</h4>
                    <p className="text-sm text-gray-400">Start livestreaming</p>
                  </div>
                </button>
                
                <button
                  onClick={handleCreateProduct}
                  className="flex items-center w-full p-4 hover:bg-gray-800 rounded-lg transition"
                >
                  <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center mr-4">
                    <ShoppingBag className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium">List Product</h4>
                    <p className="text-sm text-gray-400">Add a product to your shop</p>
                  </div>
                </button>
              </div>
              
              <div className="p-4 flex justify-center">
                <button 
                  onClick={onClose}
                  className="bg-app-gray rounded-full h-12 w-12 flex items-center justify-center"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreateContentMenu;
