import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, X, ArrowLeft, ArrowRight } from 'lucide-react';
import UploadStep from './upload-steps/UploadStep';
import EditStep from './upload-steps/EditStep';
import VideoService from '@/services/video.service';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

interface VideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (videoId: string) => void;
}

const VideoUploadModal: React.FC<VideoUploadModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [privacy, setPrivacy] = useState<"public" | "private" | "followers">("public");
  const [allowDownloads, setAllowDownloads] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const resetState = () => {
    setStep(1);
    setVideoFile(null);
    setVideoPreviewUrl(null);
    setTitle('');
    setDescription('');
    setHashtags([]);
    setPrivacy("public");
    setAllowDownloads(true);
    setIsUploading(false);
    setUploadProgress(0);
    setUploadError(null);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleFileSelected = (file: File) => {
    setVideoFile(file);
    
    const url = URL.createObjectURL(file);
    setVideoPreviewUrl(url);
    
    const filename = file.name.split('.');
    filename.pop();
    const suggestedTitle = filename.join('.').replace(/[_-]/g, ' ');
    setTitle(suggestedTitle);
    
    setStep(2);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const simulateProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 500);
    
    return interval;
  };

  const handleUpload = async () => {
    if (!videoFile || !title.trim() || !isAuthenticated) {
      setUploadError("Please provide a title and ensure you're logged in.");
      toast({
        title: "Upload Error",
        description: "Please provide a title and ensure you're logged in.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    
    const progressInterval = simulateProgress();
    
    try {
      console.log('Starting video upload process...', videoFile.name, videoFile.size);
      
      try {
        const res = await fetch(`${window.location.origin}/api/create-storage-bucket`);
        console.log('Storage bucket check response:', await res.json());
      } catch (bucketError) {
        console.warn('Failed to check storage buckets, continuing anyway:', bucketError);
      }
      
      const uploadedVideo = await VideoService.uploadVideo(
        videoFile,
        title,
        description,
        null, // thumbnailUrl - we're generating this in the service
        privacy === "private",
        hashtags
      );
      
      console.log('Video uploaded successfully:', uploadedVideo);
      
      setUploadProgress(100);
      
      setTimeout(() => {
        toast({
          title: "Upload Successful",
          description: "Your video has been uploaded successfully!",
        });
        
        resetState();
        onClose();
        
        if (uploadedVideo && uploadedVideo.id) {
          onSuccess(uploadedVideo.id);
        } else {
          console.error('Missing video ID in upload response');
          toast({
            title: "Warning",
            description: "Video uploaded but some metadata may be missing.",
            variant: "destructive",
          });
        }
      }, 500);
      
    } catch (error: any) {
      console.error('Error uploading video:', error);
      clearInterval(progressInterval);
      
      setUploadError(error.message || "Failed to upload video. Please try again.");
      
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload video. Please try again.",
        variant: "destructive",
      });
      
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Video</DialogTitle>
          <DialogDescription>
            Share your video with the world
          </DialogDescription>
        </DialogHeader>
        
        {uploadError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-medium">Error uploading video</p>
            <p className="text-sm">{uploadError}</p>
          </div>
        )}
        
        <div className="pb-4">
          {step === 1 && (
            <UploadStep
              onSelectFile={handleFileSelected}
            />
          )}
          
          {step === 2 && (
            <EditStep 
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              hashtags={hashtags}
              setHashtags={setHashtags}
              privacy={privacy}
              setPrivacy={setPrivacy}
              allowDownloads={allowDownloads}
              setAllowDownloads={setAllowDownloads}
              onClose={handleClose}
              handleUpload={handleUpload}
              videoPreviewUrl={videoPreviewUrl}
              isAuthenticated={isAuthenticated}
              error={uploadError}
            />
          )}
        </div>
        
        {isUploading && (
          <div className="mt-4 px-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}
        
        {step === 2 && !isUploading && (
          <div className="flex justify-between pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={handleBack}
              disabled={isUploading}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            
            <Button 
              onClick={handleUpload} 
              disabled={!title.trim() || isUploading || !isAuthenticated}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VideoUploadModal;
