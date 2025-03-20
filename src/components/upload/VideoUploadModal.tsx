
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, X, ArrowLeft } from 'lucide-react';
import UploadStep from './upload-steps/UploadStep';
import EditStep from './upload-steps/EditStep';
import VideoService from '@/services/video';
import UploadService from '@/services/upload.service';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

interface VideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (videoId: string) => void;
}

const VERIFICATION_MAX_ATTEMPTS = 10;
const VERIFICATION_BASE_DELAY_MS = 1000;

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
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const progressIntervalRef = useRef<number | null>(null);
  const checkVideoExistsTimeoutRef = useRef<number | null>(null);

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
    
    // Clear any existing intervals when component unmounts
    return () => {
      clearAllTimers();
    };
  }, [isOpen]);

  const clearAllTimers = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    
    if (checkVideoExistsTimeoutRef.current) {
      clearTimeout(checkVideoExistsTimeoutRef.current);
      checkVideoExistsTimeoutRef.current = null;
    }
  };

  // Add effect to verify upload completion
  useEffect(() => {
    const verifyUpload = async () => {
      // Only run verification if we have a video ID, are not uploading, and progress is high enough
      if (uploadedVideoId && !isUploading && uploadProgress >= 95) {
        console.log(`[VideoUploadModal] Verifying upload completion for video ID: ${uploadedVideoId}, attempt: ${verificationAttempts + 1}/${VERIFICATION_MAX_ATTEMPTS}`);
        
        try {
          // Clear any existing timeout
          if (checkVideoExistsTimeoutRef.current) {
            clearTimeout(checkVideoExistsTimeoutRef.current);
            checkVideoExistsTimeoutRef.current = null;
          }
          
          // Check if the video exists in the database
          const exists = await VideoService.checkVideoExists(uploadedVideoId);
          
          console.log(`[VideoUploadModal] Video existence check result: ${exists ? 'Found' : 'Not found'}`);
          
          if (exists) {
            console.log('[VideoUploadModal] Video upload verified successfully');
            setUploadProgress(100);
            
            // Small delay to show 100% before closing
            setTimeout(() => {
              onSuccess(uploadedVideoId);
              resetState();
              onClose();
            }, 1000);
            return;
          } else {
            // Increment attempt counter
            const newAttemptCount = verificationAttempts + 1;
            setVerificationAttempts(newAttemptCount);
            
            // If we've tried maximum times and still can't verify, show error
            if (newAttemptCount >= VERIFICATION_MAX_ATTEMPTS) {
              console.error(`[VideoUploadModal] Failed to verify video after ${newAttemptCount} attempts`);
              setUploadError("Upload appeared to complete but the video couldn't be verified. Please try again.");
              setUploadProgress(0);
              setIsUploading(false);
              toast({
                title: "Upload Failed",
                description: "Verification timeout. Please try again.",
                variant: "destructive",
              });
            } else {
              // Try again after a delay (exponential backoff)
              const delayMs = VERIFICATION_BASE_DELAY_MS * Math.pow(2, newAttemptCount);
              console.log(`[VideoUploadModal] Scheduling next verification attempt in ${delayMs}ms`);
              
              checkVideoExistsTimeoutRef.current = window.setTimeout(() => {
                verifyUpload();
              }, delayMs);
            }
          }
        } catch (error) {
          console.error('[VideoUploadModal] Error verifying video upload:', error);
          setUploadError("Error verifying video upload. Please try again.");
          setUploadProgress(0);
          setIsUploading(false);
          toast({
            title: "Upload Failed",
            description: "Error verifying upload. Please try again.",
            variant: "destructive",
          });
        }
      }
    };
    
    verifyUpload();
    
    // Clean up the timeout when component unmounts or dependencies change
    return () => {
      if (checkVideoExistsTimeoutRef.current) {
        clearTimeout(checkVideoExistsTimeoutRef.current);
        checkVideoExistsTimeoutRef.current = null;
      }
    };
  }, [uploadedVideoId, isUploading, uploadProgress, verificationAttempts, onSuccess, onClose, toast]);

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
    setVerificationAttempts(0);
    
    clearAllTimers();
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

  const startProgressSimulation = () => {
    // Clear any existing interval
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    
    setUploadProgress(0);
    
    // Use a ref to store the interval ID so we can clear it later
    progressIntervalRef.current = window.setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 85) {
          clearInterval(progressIntervalRef.current!);
          progressIntervalRef.current = null;
          return 85; // Hold at 85% until actual upload completes
        }
        return prev + (Math.random() * 2); // Slower increment
      });
    }, 1000);
  };

  const completeProgressSimulation = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    
    // Set to 95% to indicate we're finalizing
    setUploadProgress(95);
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
    setVerificationAttempts(0);
    setUploadedVideoId(null);
    
    // Start progress simulation
    startProgressSimulation();
    
    try {
      console.log('[VideoUploadModal] Starting video upload process...', videoFile.name, videoFile.size);
      
      try {
        console.log('[VideoUploadModal] Initializing storage buckets before upload...');
        await UploadService.initBuckets();
      } catch (bucketError) {
        console.warn('[VideoUploadModal] Failed to check storage buckets, continuing anyway:', bucketError);
      }
      
      console.log('[VideoUploadModal] Calling VideoService.uploadVideo with:', { 
        videoFileSize: videoFile.size, 
        title, 
        description, 
        isPrivate: privacy === "private" 
      });
      
      // Upload the video (this will take time depending on file size)
      const uploadedVideo = await VideoService.uploadVideo(
        videoFile,
        title,
        description,
        null, // thumbnailUrl will be generated in the service
        privacy === "private",
        hashtags
      );
      
      // Stop progress simulation and set to 95% to indicate verification phase
      completeProgressSimulation();
      
      console.log('[VideoUploadModal] Video uploaded successfully, response:', uploadedVideo);
      
      // Store the uploaded video ID so we can verify it in the effect
      if (uploadedVideo && uploadedVideo.id) {
        setUploadedVideoId(uploadedVideo.id);
        console.log('[VideoUploadModal] Upload successful with video ID:', uploadedVideo.id);
        
        toast({
          title: "Upload Processing",
          description: "Your video has been uploaded and is being processed.",
        });
      } else {
        throw new Error('Missing video ID in upload response');
      }
      
    } catch (error: any) {
      console.error('[VideoUploadModal] Error uploading video:', error);
      
      clearAllTimers();
      
      setUploadProgress(0);
      setIsUploading(false);
      setUploadError(error.message || "Failed to upload video. Please try again.");
      
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
              <span>Uploading{uploadProgress >= 95 ? ' (Finalizing)' : '...'}</span>
              <span>{uploadProgress.toFixed(0)}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
            {uploadProgress >= 95 && (
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
