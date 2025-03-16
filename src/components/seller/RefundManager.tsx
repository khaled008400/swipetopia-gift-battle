
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { 
  Loader2, Check, X, Eye, FileText, ExternalLink 
} from "lucide-react";
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RefundRequest } from "@/types/product.types";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogTrigger, DialogClose 
} from "@/components/ui/dialog";

const RefundManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [refunds, setRefunds] = useState<RefundRequest[]>([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);
  const [responseNote, setResponseNote] = useState("");
  
  useEffect(() => {
    if (user?.id) {
      fetchRefunds();
    }
  }, [user]);
  
  const fetchRefunds = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('refund_requests')
        .select(`
          *,
          profiles:user_id (username),
          products:product_id (name)
        `)
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      if (data) {
        const formattedRefunds = data.map((refund: any) => ({
          ...refund,
          username: refund.profiles?.username || "Customer",
          product_name: refund.products?.name || "Unknown Product"
        }));
        
        setRefunds(formattedRefunds);
      }
    } catch (error: any) {
      toast({
        title: "Error fetching refunds",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleRefundAction = async (refundId: string, status: 'approved' | 'rejected') => {
    if (!user?.id) return;
    
    try {
      const { error } = await supabase
        .from('refund_requests')
        .update({ 
          status, 
          updated_at: new Date().toISOString(),
          response_note: responseNote
        })
        .eq('id', refundId)
        .eq('seller_id', user.id);
        
      if (error) throw error;
      
      // Update local state
      setRefunds(prev => 
        prev.map(refund => 
          refund.id === refundId 
            ? { ...refund, status, updated_at: new Date().toISOString(), response_note: responseNote }
            : refund
        )
      );
      
      setSelectedRefund(null);
      setResponseNote("");
      
      toast({
        title: `Refund ${status}`,
        description: `The refund request has been ${status}.`
      });
    } catch (error: any) {
      toast({
        title: "Error updating refund",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return "bg-yellow-500";
      case 'approved':
        return "bg-green-500";
      case 'rejected':
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };
  
  const filteredRefunds = refunds.filter(refund => {
    if (activeTab === 'all') return true;
    return refund.status === activeTab;
  });
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-app-yellow" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Refunds</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Button 
          variant="outline" 
          onClick={fetchRefunds}
        >
          Refresh
        </Button>
      </div>
      
      {filteredRefunds.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <FileText className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground text-center">
              {activeTab === 'all' 
                ? "No refund requests found" 
                : `No ${activeTab} refund requests`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRefunds.map((refund) => (
            <Card key={refund.id}>
              <CardContent className="p-4">
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Order ID</p>
                    <p className="font-medium">{refund.order_id.substring(0, 8)}...</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Product</p>
                    <p className="font-medium">{refund.product_name}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="font-medium">${refund.amount.toFixed(2)}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{format(new Date(refund.created_at), 'MMM d, yyyy')}</p>
                  </div>
                </div>
                
                <div className="mt-4 grid md:grid-cols-3 gap-4">
                  <div className="space-y-1 md:col-span-2">
                    <p className="text-sm text-muted-foreground">Reason</p>
                    <p className="text-sm">{refund.reason}</p>
                  </div>
                  
                  <div className="flex flex-col justify-center items-start space-y-2 md:items-end">
                    <Badge className={getStatusColor(refund.status)}>
                      {refund.status.charAt(0).toUpperCase() + refund.status.slice(1)}
                    </Badge>
                    
                    {refund.status === 'pending' ? (
                      <div className="flex gap-2 mt-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedRefund(refund)}
                            >
                              <Eye className="h-4 w-4 mr-1" /> Review
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Review Refund Request</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">Customer</p>
                                  <p className="font-medium">{refund.username}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Product</p>
                                  <p className="font-medium">{refund.product_name}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Amount</p>
                                  <p className="font-medium">${refund.amount.toFixed(2)}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Date</p>
                                  <p className="font-medium">{format(new Date(refund.created_at), 'MMM d, yyyy')}</p>
                                </div>
                              </div>
                              
                              <div>
                                <p className="text-sm text-muted-foreground">Reason</p>
                                <div className="p-3 bg-gray-800 rounded mt-1">
                                  <p className="text-sm">{refund.reason}</p>
                                </div>
                              </div>
                              
                              <div>
                                <p className="text-sm text-muted-foreground mb-2">Response Note</p>
                                <Textarea
                                  placeholder="Add a note about your decision"
                                  value={responseNote}
                                  onChange={(e) => setResponseNote(e.target.value)}
                                  rows={3}
                                />
                              </div>
                              
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="destructive"
                                  onClick={() => handleRefundAction(refund.id, 'rejected')}
                                >
                                  <X className="h-4 w-4 mr-1" /> Reject
                                </Button>
                                <Button 
                                  variant="default"
                                  onClick={() => handleRefundAction(refund.id, 'approved')}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Check className="h-4 w-4 mr-1" /> Approve
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-muted-foreground"
                        asChild
                      >
                        <span>
                          <ExternalLink className="h-4 w-4 mr-1" /> View Order
                        </span>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RefundManager;
