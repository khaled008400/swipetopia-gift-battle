
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminService from '@/services/admin.service';
import type { AdminOrder } from '@/services/admin.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2, TruckIcon, Package2Icon, CheckIcon, ClockIcon, XIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Pagination } from '@/components/ui/pagination';

// Define the order status type to match what the API accepts
type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

const AdminOrders = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();
  
  // Get the status filter based on the active tab
  const getStatusFilter = (): OrderStatus | undefined => {
    switch (activeTab) {
      case 'pending': return 'pending';
      case 'processing': return 'processing';
      case 'shipped': return 'shipped';
      case 'delivered': return 'delivered';
      case 'cancelled': return 'cancelled';
      default: return undefined;
    }
  };
  
  // Fetch orders
  const { data: orders, isLoading } = useQuery({
    queryKey: ['adminOrders', currentPage, getStatusFilter()],
    queryFn: () => AdminService.getOrders(currentPage, getStatusFilter()),
  });
  
  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string, status: OrderStatus }) => 
      AdminService.updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
    },
  });
  
  // Handle status change
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateStatusMutation.mutate({ orderId, status: newStatus });
  };
  
  // Render badge for order status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600"><ClockIcon className="mr-1 h-3 w-3" /> Pending</Badge>;
      case 'processing':
        return <Badge variant="outline" className="text-blue-600 border-blue-600"><Package2Icon className="mr-1 h-3 w-3" /> Processing</Badge>;
      case 'shipped':
        return <Badge variant="outline" className="text-violet-600 border-violet-600"><TruckIcon className="mr-1 h-3 w-3" /> Shipped</Badge>;
      case 'delivered':
        return <Badge className="bg-green-600"><CheckIcon className="mr-1 h-3 w-3" /> Delivered</Badge>;
      case 'cancelled':
        return <Badge variant="destructive"><XIcon className="mr-1 h-3 w-3" /> Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Get available status changes based on current status
  const getAvailableStatusChanges = (currentStatus: string): OrderStatus[] => {
    switch (currentStatus) {
      case 'pending':
        return ['processing', 'cancelled'];
      case 'processing':
        return ['shipped', 'cancelled'];
      case 'shipped':
        return ['delivered', 'cancelled'];
      case 'delivered':
        return [];
      case 'cancelled':
        return ['pending'];
      default:
        return [];
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Orders</h2>
      </div>

      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Order Management</CardTitle>
          <CardDescription>
            View and manage customer orders across your store
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4 flex flex-wrap">
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="shipped">Shipped</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="w-full">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <div className="rounded-md border overflow-hidden">
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
                        {orders?.data && orders.data.length > 0 ? (
                          orders.data.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell className="font-medium">{order.id.substring(0, 8)}...</TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{order.user.username}</div>
                                  <div className="text-sm text-muted-foreground">{order.user.email}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                {format(new Date(order.created_at), 'MMM d, yyyy')}
                              </TableCell>
                              <TableCell>
                                {getStatusBadge(order.status)}
                              </TableCell>
                              <TableCell>
                                ${order.total.toFixed(2)}
                              </TableCell>
                              <TableCell>
                                {order.products?.length || 0} items
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => {
                                      // Implement view order details
                                      console.log('View order', order.id);
                                    }}
                                  >
                                    View
                                  </Button>
                                  {getAvailableStatusChanges(order.status).length > 0 && (
                                    <select
                                      className="px-2 py-1 text-sm rounded border"
                                      onChange={(e) => {
                                        const newStatus = e.target.value as OrderStatus;
                                        if (newStatus) {
                                          handleStatusChange(order.id, newStatus);
                                        }
                                      }}
                                      value=""
                                    >
                                      <option value="" disabled>Change Status</option>
                                      {getAvailableStatusChanges(order.status).map(status => (
                                        <option key={status} value={status}>
                                          Mark as {status}
                                        </option>
                                      ))}
                                    </select>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center h-32 text-muted-foreground">
                              No orders found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {orders?.pagination && orders.pagination.last_page > 1 && (
                    <div className="flex justify-center mt-6">
                      <Pagination>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </Button>
                        <div className="flex items-center gap-1 mx-2">
                          Page {orders.pagination.current_page} of {orders.pagination.last_page}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(p => Math.min(p + 1, orders.pagination.last_page))}
                          disabled={currentPage === orders.pagination.last_page}
                        >
                          Next
                        </Button>
                      </Pagination>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrders;
