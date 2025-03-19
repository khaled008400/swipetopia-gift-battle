
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
  const [uploadedVideoId, setUploadedVideoId] = useState<string | null>(null);
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

  // Add effect to verify upload completion
  useEffect(() => {
    // Check if we've just completed an upload
    const verifyUpload = async () => {
      if (uploadedVideoId && !isUploading && uploadProgress === 100) {
        console.log('Verifying upload completion for video ID:', uploadedVideoId);
        
        try {
          // Wait a bit to ensure database consistency
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check if the video exists in the database
          const exists = await VideoService.checkVideoExists(uploadedVideoId);
          
          if (exists) {
            console.log('Video upload verified successfully');
            onSuccess(uploadedVideoId);
            resetState();
            onClose();
          } else {
            console.error('Video not found in database after upload');
            setUploadError("Upload appeared to complete but the video couldn't be verified. Please try again.");
            setUploadProgress(0);
          }
        } catch (error) {
          console.error('Error verifying video upload:', error);
        }
      }
    };
    
    verifyUpload();
  }, [uploadedVideoId, isUploading, uploadProgress, onSuccess, onClose]);

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
    setUploadedVideoId(null);
  };

  const handleClose = () => {
    // If we're in the middle of an upload, confirm before closing
    if (isUploading) {
      const shouldClose = window.confirm('Upload in progress. Are you sure you want to cancel?');
      if (!shouldClose) return;
    }
    
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
    let progressValue = 0;
    const interval = setInterval(() => {
      progressValue += 5;
      if (progressValue >= 90) {
        clearInterval(interval);
        setUploadProgress(90);
      } else {
        setUploadProgress(progressValue);
      }
    }, 500);
    
    return {
      interval,
      complete: () => {
        clearInterval(interval);
        // Set to 95% first to show we're almost done
        setUploadProgress(95);
        // Then after a delay set to 100% to give visual feedback
        setTimeout(() => {
          setUploadProgress(100);
          // Call onComplete callback after a brief delay
          setTimeout(() => {
            onComplete();
          }, 1000);
        }, 500);
      },
      fail: () => {
        clearInterval(interval);
        setUploadProgress(0);
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
      console.log("Upload completed, progress at 100%");
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
      
      console.log('Calling VideoService.uploadVideo with:', { 
        videoFileSize: videoFile.size, 
        title, 
        description, 
        isPrivate: privacy === "private" 
      });
      
      // Set progress to 95% to indicate we're starting the actual server upload
      setUploadProgress(95);
      
      const uploadedVideo = await VideoService.uploadVideo(
        videoFile,
        title,
        description,
        null, // thumbnailUrl will be generated in the service
        privacy === "private",
        hashtags
      );
      
      console.log('Video uploaded successfully, response:', uploadedVideo);
      
      // Store the uploaded video ID so we can verify it in the effect
      if (uploadedVideo && uploadedVideo.id) {
        setUploadedVideoId(uploadedVideo.id);
        console.log('Upload successful with video ID:', uploadedVideo.id);
        
        // Ensure we complete the progress animation
        progress.complete();
        
        toast({
          title: "Upload Successful",
          description: "Your video has been uploaded successfully!",
        });
      } else {
        throw new Error('Missing video ID in upload response');
      }
      
    } catch (error: any) {
      console.error('Error uploading video:', error);
      progress.fail();
      
      setUploadError(error.message || "Failed to upload video. Please try again.");
      setIsUploading(false);
      
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload video. Please try again.",
        variant: "destructive",
      });
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
            {uploadProgress === 100 && (
              <p className="text-sm text-center mt-2 text-green-600">
                Finalizing upload, please wait...
              </p>
            )}
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
