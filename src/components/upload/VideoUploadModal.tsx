import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, X, ArrowLeft, ArrowRight } from 'lucide-react';
import UploadStep from './upload-steps/UploadStep';
import EditStep from './upload-steps/EditStep';
import VideoService from '@/services/video.service';
import UploadService from '@/services/upload.service';
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

  useEffect(() => {
    if (isOpen) {
      const initStorage = async () => {
        try {
          console.log('Initializing storage buckets on modal open...');
          await UploadService.initBuckets();
        } catch (error) {
          console.warn('Failed to initialize storage buckets:', error);
        }
      };
      
      initStorage();
    }
  }, [isOpen]);

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

  const simulateProgress = (onComplete: () => void) => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 500);
    
    return {
      interval,
      complete: () => {
        clearInterval(interval);
        setUploadProgress(100);
        onComplete();
      }
    };
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
    
    const progress = simulateProgress(() => {
      toast({
        title: "Upload Successful",
        description: "Your video has been uploaded successfully!",
      });
      
      resetState();
      onClose();
    });
    
    try {
      console.log('Starting video upload process...', videoFile.name, videoFile.size);
      
      try {
        console.log('Initializing storage buckets before upload...');
        await UploadService.initBuckets();
      } catch (bucketError) {
        console.warn('Failed to check storage buckets, continuing anyway:', bucketError);
      }
      
      let thumbnailFile = null;
      if (videoPreviewUrl) {
        try {
          const video = document.createElement('video');
          video.preload = 'metadata';
          video.src = videoPreviewUrl;
          video.currentTime = 1;
          
          await new Promise<void>((resolve) => {
            video.onloadeddata = () => {
              video.currentTime = 1;
              video.onseeked = () => resolve();
            };
          });
          
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const thumbnailDataUrl = canvas.toDataURL('image/jpeg');
            
            const response = await fetch(thumbnailDataUrl);
            const blob = await response.blob();
            thumbnailFile = new File([blob], 'thumbnail.jpg', { type: 'image/jpeg' });
            console.log('Created thumbnail:', thumbnailFile.size, 'bytes');
          }
        } catch (thumbError) {
          console.error('Error creating thumbnail:', thumbError);
        }
      }
      
      const uploadedVideo = await VideoService.uploadVideo(
        videoFile,
        title,
        description,
        null, // thumbnailUrl will be generated in the service
        privacy === "private",
        hashtags
      );
      
      console.log('Video uploaded successfully:', uploadedVideo);
      
      progress.complete();
      
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
      
    } catch (error: any) {
      console.error('Error uploading video:', error);
      clearInterval(progress.interval);
      
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
