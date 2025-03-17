
import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Pagination, PaginationContent, PaginationItem, 
  PaginationLink, PaginationNext, PaginationPrevious 
} from '@/components/ui/pagination';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminService, { AdminOrder } from '@/services/admin.service';
import { CheckCircle, MoreHorizontal, Search, XCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const AdminOrders = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['adminOrders', page, statusFilter],
    queryFn: () => AdminService.getOrders(page, statusFilter),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string, status: 'pending' | 'completed' | 'cancelled' }) => 
      AdminService.updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
      toast({
        title: "Status updated",
        description: "Order status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update order status.",
        variant: "destructive",
      });
    },
  });

  const handleStatusChange = (orderId: string, status: 'pending' | 'completed' | 'cancelled') => {
    updateStatusMutation.mutate({ orderId, status });
  };

  const handleOpenDetails = (order: AdminOrder) => {
    setSelectedOrder(order);
    setShowDetailsDialog(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>;
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (data?.pagination && page < data.pagination.last_page) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Orders</h2>
        <div className="flex space-x-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <form className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data.map((order: AdminOrder) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>{order.user.username}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>{order.products.length} items</TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button variant="outline" size="sm" onClick={() => handleOpenDetails(order)}>
                        Details
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(order.id, 'completed')}
                            className="text-green-600"
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Complete
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(order.id, 'pending')}
                            className="text-yellow-600"
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Set Pending
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(order.id, 'cancelled')}
                            className="text-red-600"
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Cancel
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {data?.pagination && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={handlePrevPage}
                    className={page === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(5, data.pagination.last_page) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <PaginationItem key={i}>
                      <PaginationLink 
                        isActive={page === pageNum}
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={handleNextPage}
                    className={page === data.pagination.last_page ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="w-full max-w-lg">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Order ID</h3>
                  <p>#{selectedOrder.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
                  <p>{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Customer</h3>
                  <p>{selectedOrder.user.username}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                  <p>{selectedOrder.user.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <p>{getStatusBadge(selectedOrder.status)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Total</h3>
                  <p className="font-bold">${selectedOrder.total.toFixed(2)}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Products</h3>
                <div className="border rounded-md divide-y">
                  {selectedOrder.products.map((item) => (
                    <div key={item.id} className="p-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ${item.price.toFixed(2)} x {item.quantity}
                        </p>
                      </div>
                      <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  onClick={() => handleStatusChange(selectedOrder.id, 'completed')}
                  className="bg-green-500 hover:bg-green-600"
                >
                  Mark Completed
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleStatusChange(selectedOrder.id, 'cancelled')}
                  className="text-red-600"
                >
                  Cancel Order
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;
