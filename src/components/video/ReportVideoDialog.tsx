
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import VideoService from '@/services/video.service';

interface ReportVideoDialogProps {
  videoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ReportVideoDialog({ videoId, open, onOpenChange }: ReportVideoDialogProps) {
  const [category, setCategory] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!category) {
      toast({
        title: "Error",
        description: "Please select a reason for reporting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // You would need to implement this method on your VideoService
      await VideoService.reportVideo(videoId, {
        category,
        description: reason
      });
      
      toast({
        title: "Report Submitted",
        description: "Thank you for helping us keep the community safe."
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error reporting video:", error);
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Report Video</DialogTitle>
          <DialogDescription>
            Thank you for helping us maintain a safe environment.
            Your report will be reviewed by our moderation team.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label htmlFor="report-reason" className="text-sm font-medium">Reason for reporting</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="report-reason">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inappropriate">Inappropriate content</SelectItem>
                <SelectItem value="harmful">Harmful or dangerous</SelectItem>
                <SelectItem value="spam">Spam or misleading</SelectItem>
                <SelectItem value="copyright">Copyright or intellectual property violation</SelectItem>
                <SelectItem value="harassment">Harassment or bullying</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="report-details" className="text-sm font-medium">Additional details (optional)</label>
            <Textarea 
              id="report-details" 
              placeholder="Please provide more details about the issue..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
