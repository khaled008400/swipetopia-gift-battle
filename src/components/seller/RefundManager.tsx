import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, CheckCircle2, XCircle, AlertCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { RefundRequest } from "@/types/product.types";
import { supabase } from "@/lib/supabase";

const RefundManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<RefundRequest | null>(null);
  const [responseText, setResponseText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTab, setSelectedTab] = useState("pending");
  
  useEffect(() => {
    if (user?.id) {
      fetchRefundRequests();
    }
  }, [user, selectedTab]);
  
  const fetchRefundRequests = async () => {
    setLoading(true);
    try {
      const mockRequests: RefundRequest[] = [
        {
          id: "refund-1",
          order_id: "order-1234",
          user_id: "user-1",
          seller_id: user?.id || "",
          reason: "The product arrived damaged. The packaging was torn and the item has scratches on the surface.",
          status: "pending",
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          amount: 49.99,
          product_id: "product-1",
          product_name: "Premium Leather Wallet",
          username: "JohnDoe",
          product: {
            name: "Premium Leather Wallet",
            image_url: "/assets/products/wallet.jpg"
          },
          user: {
            username: "JohnDoe",
            email: "john@example.com"
          }
        },
        {
          id: "refund-2",
          order_id: "order-1235",
          user_id: "user-2",
          seller_id: user?.id || "",
          reason: "Wrong size. I ordered a medium but received a small.",
          status: "approved",
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          amount: 29.99,
          product_id: "product-2",
          product_name: "Cotton T-Shirt",
          username: "JaneSmith",
          product: {
            name: "Cotton T-Shirt",
            image_url: "/assets/products/tshirt.jpg"
          },
          user: {
            username: "JaneSmith",
            email: "jane@example.com"
          }
        },
        {
          id: "refund-3",
          order_id: "order-1236",
          user_id: "user-3",
          seller_id: user?.id || "",
          reason: "I changed my mind and no longer need this product.",
          status: "rejected",
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
          amount: 199.99,
          product_id: "product-3",
          product_name: "Bluetooth Headphones",
          username: "SamWilson",
          product: {
            name: "Bluetooth Headphones",
            image_url: "/assets/products/headphones.jpg"
          },
          user: {
            username: "SamWilson",
            email: "sam@example.com"
          }
        },
        {
          id: "refund-4",
          order_id: "order-1237",
          user_id: "user-4",
          seller_id: user?.id || "",
          reason: "The product doesn't match the description. It's missing features that were advertised.",
          status: "pending",
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          amount: 149.99,
          product_id: "product-4",
          product_name: "Smart Watch",
          username: "EmilyJohnson",
          product: {
            name: "Smart Watch",
            image_url: "/assets/products/smartwatch.jpg"
          },
          user: {
            username: "EmilyJohnson",
            email: "emily@example.com"
          }
        },
      ];
      
      const filteredRequests = mockRequests.filter(req => {
        if (selectedTab === "pending") return req.status === "pending";
        if (selectedTab === "approved") return req.status === "approved";
        if (selectedTab === "rejected") return req.status === "rejected";
        return true; // "all" tab
      });
      
      setRefundRequests(filteredRequests);
    } catch (error) {
      console.error("Error fetching refund requests:", error);
      toast({
        title: "Error",
        description: "Could not load refund requests. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleViewRequest = (request: RefundRequest) => {
    setSelectedRequest(request);
    setResponseText("");
  };
  
  const handleApproveRequest = async () => {
    if (!selectedRequest) return;
    
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setRefundRequests(prevRequests => 
        prevRequests.map(req => 
          req.id === selectedRequest.id 
            ? { ...req, status: "approved", updated_at: new Date().toISOString() } 
            : req
        )
      );
      
      setSelectedRequest(null);
      
      toast({
        title: "Refund approved",
        description: "The refund request has been approved and the customer will be notified.",
      });
      
      fetchRefundRequests();
    } catch (error) {
      console.error("Error approving refund:", error);
      toast({
        title: "Error",
        description: "Failed to approve refund. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleRejectRequest = async () => {
    if (!selectedRequest || !responseText.trim()) {
      toast({
        title: "Response required",
        description: "Please provide a reason for rejecting this refund request.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setRefundRequests(prevRequests => 
        prevRequests.map(req => 
          req.id === selectedRequest.id 
            ? { ...req, status: "rejected", updated_at: new Date().toISOString() } 
            : req
        )
      );
      
      setSelectedRequest(null);
      setResponseText("");
      
      toast({
        title: "Refund rejected",
        description: "The refund request has been rejected and the customer will be notified.",
      });
      
      fetchRefundRequests();
    } catch (error) {
      console.error("Error rejecting refund:", error);
      toast({
        title: "Error",
        description: "Failed to reject refund. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20"><CheckCircle2 className="w-3 h-3 mr-1" /> Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
      default:
        return <Badge variant="outline"><AlertCircle className="w-3 h-3 mr-1" /> Unknown</Badge>;
    }
  };
  
  if (loading && refundRequests.length === 0) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-app-yellow" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Refund Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="all">All Requests</TabsTrigger>
            </TabsList>
            
            <TabsContent value={selectedTab}>
              {refundRequests.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No {selectedTab === "all" ? "" : selectedTab} refund requests found
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {refundRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          {format(new Date(request.created_at), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>{request.order_id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={`https://i.pravatar.cc/150?u=${request.username}`} />
                              <AvatarFallback>{request.username?.[0].toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span>{request.username}</span>
                          </div>
                        </TableCell>
                        <TableCell>{request.product_name}</TableCell>
                        <TableCell>${request.amount.toFixed(2)}</TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleViewRequest(request)}
                          >
                            {request.status === "pending" ? "Review" : "View Details"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {selectedRequest && (
        <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Refund Request Details</DialogTitle>
              <DialogDescription>
                Review the details of this refund request
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium mb-1">Order ID</p>
                  <p className="text-sm text-gray-500">{selectedRequest.order_id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Date Requested</p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(selectedRequest.created_at), 'MMM d, yyyy')}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Status</p>
                  <div>{getStatusBadge(selectedRequest.status)}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-1">Customer</p>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={`https://i.pravatar.cc/150?u=${selectedRequest.username}`} />
                      <AvatarFallback>{selectedRequest.username?.[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-500">{selectedRequest.username}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Refund Amount</p>
                  <p className="text-sm text-gray-500">${selectedRequest.amount.toFixed(2)}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-1">Product</p>
                <p className="text-sm text-gray-500">{selectedRequest.product_name}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-1">Reason for Refund</p>
                <div className="p-3 bg-app-gray-dark rounded-md text-sm">
                  {selectedRequest.reason}
                </div>
              </div>
              
              {selectedRequest.status === "pending" && (
                <div>
                  <p className="text-sm font-medium mb-1">Your Response</p>
                  <Textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Provide a reason for approving or rejecting this refund..."
                    rows={3}
                  />
                </div>
              )}
            </div>
            
            <DialogFooter className="flex justify-between sm:justify-between">
              <Button 
                variant="outline" 
                onClick={() => setSelectedRequest(null)}
                disabled={isSubmitting}
              >
                Close
              </Button>
              
              {selectedRequest.status === "pending" && (
                <div className="flex gap-2">
                  <Button 
                    variant="destructive" 
                    onClick={handleRejectRequest}
                    disabled={isSubmitting || !responseText.trim()}
                  >
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
                    Reject Refund
                  </Button>
                  <Button 
                    onClick={handleApproveRequest}
                    disabled={isSubmitting}
                    className="bg-green-600 text-white hover:bg-green-700"
                  >
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                    Approve Refund
                  </Button>
                </div>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default RefundManager;
