
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import VideoService from '@/services/video.service';
import { useToast } from "@/hooks/use-toast";

interface ReportVideoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
}

const reportReasons = [
  { id: "inappropriate", label: "Inappropriate content" },
  { id: "harmful", label: "Harmful or dangerous acts" },
  { id: "harassment", label: "Harassment or bullying" },
  { id: "misinformation", label: "Misinformation" },
  { id: "copyright", label: "Copyright infringement" },
  { id: "other", label: "Other" },
];

const ReportVideoDialog = ({ isOpen, onClose, videoId }: ReportVideoDialogProps) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!selectedReason) {
      toast({
        title: "Error",
        description: "Please select a reason for reporting",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const reason = `${selectedReason}${additionalInfo ? ': ' + additionalInfo : ''}`;
      
      // Fix the reportVideo call by adding a userId parameter, which can be "anonymous" for now
      // The actual userId would typically come from auth context
      await VideoService.reportVideo(videoId, reason, "anonymous");
      
      toast({
        title: "Report submitted",
        description: "Thank you for helping keep our community safe",
      });
      
      onClose();
    } catch (error) {
      console.error("Error reporting video:", error);
      toast({
        title: "Error",
        description: "There was a problem submitting your report",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Report Video</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Why are you reporting this video?</Label>
            <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
              {reportReasons.map((reason) => (
                <div key={reason.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={reason.id} id={reason.id} />
                  <Label htmlFor={reason.id}>{reason.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="additional-info">Additional information (optional)</Label>
            <Textarea
              id="additional-info"
              placeholder="Please provide any additional details that might help us understand the issue"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              className="resize-none"
              rows={4}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportVideoDialog;
