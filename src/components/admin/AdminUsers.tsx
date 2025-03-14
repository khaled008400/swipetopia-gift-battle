
import React, { useState } from 'react';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Pagination, PaginationContent, PaginationItem, 
  PaginationLink, PaginationNext, PaginationPrevious 
} from '@/components/ui/pagination';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminService, { AdminUser, UserRole } from '@/services/admin.service';
import { CheckCircle, MoreHorizontal, Search, UserX, Loader2, ShieldCheck, ShoppingBag, Video } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const AdminUsers = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Use a direct Supabase query to fetch users from profiles table
  const { data, isLoading } = useQuery({
    queryKey: ['adminUsers', page, search],
    queryFn: async () => {
      try {
        // Start query from profiles table
        let query = supabase.from('profiles').select('*');
        
        // Add search if provided
        if (search) {
          query = query.ilike('username', `%${search}%`);
        }
        
        // Add pagination
        query = query.range((page - 1) * 10, page * 10 - 1);
        
        const { data: profiles, error, count } = await query;
        
        if (error) {
          console.error("Error fetching users:", error);
          throw error;
        }
        
        // Transform profiles to match AdminUser interface
        const users = profiles.map(profile => ({
          id: profile.id,
          username: profile.username,
          email: profile.email || 'No email available',
          status: 'active', // Default status
          role: profile.role || 'viewer',
          createdAt: profile.created_at,
          videosCount: 0, // Default values for now
          ordersCount: 0, // Default values for now
        }));
        
        return {
          data: users,
          pagination: {
            total: count || users.length,
            last_page: Math.ceil((count || users.length) / 10),
            current_page: page
          }
        };
      } catch (error) {
        console.error("Failed to fetch users:", error);
        toast({
          title: "Error fetching users",
          description: "There was a problem fetching the user list.",
          variant: "destructive",
        });
        return { data: [], pagination: { total: 0, last_page: 1, current_page: 1 } };
      }
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ userId, status }: { userId: string, status: 'active' | 'suspended' }) => 
      AdminService.updateUserStatus(userId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      toast({
        title: "Status updated",
        description: "User status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update user status.",
        variant: "destructive",
      });
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string, role: UserRole }) => {
      try {
        // Update user role directly in the profiles table
        const { error } = await supabase
          .from('profiles')
          .update({ role: role })
          .eq('id', userId);
          
        if (error) throw error;
        return { success: true };
      } catch (error) {
        console.error("Error updating role:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      toast({
        title: "Role updated",
        description: "User role has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update user role.",
        variant: "destructive",
      });
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const handleStatusChange = (userId: string, status: 'active' | 'suspended') => {
    updateStatusMutation.mutate({ userId, status });
  };

  const handleRoleChange = (userId: string, role: UserRole) => {
    updateRoleMutation.mutate({ userId, role });
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'suspended':
        return <Badge className="bg-red-500">Suspended</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>;
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-purple-500 flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Admin</Badge>;
      case 'seller':
        return <Badge className="bg-blue-500 flex items-center gap-1"><ShoppingBag className="h-3 w-3" /> Seller</Badge>;
      case 'streamer':
        return <Badge className="bg-pink-500 flex items-center gap-1"><Video className="h-3 w-3" /> Streamer</Badge>;
      case 'viewer':
      default:
        return <Badge className="bg-gray-500">Viewer</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Users</h2>
        <form onSubmit={handleSearch} className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
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
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Videos</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data && data.data.length > 0 ? (
                data.data.map((user: AdminUser) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>{getRoleBadge(user.role || 'viewer')}</TableCell>
                    <TableCell>{user.videosCount}</TableCell>
                    <TableCell>{user.ordersCount}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Select 
                          defaultValue={user.role || 'viewer'} 
                          onValueChange={(value: UserRole) => handleRoleChange(user.id, value)}
                        >
                          <SelectTrigger className="w-28">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="viewer">Viewer</SelectItem>
                            <SelectItem value="seller">Seller</SelectItem>
                            <SelectItem value="streamer">Streamer</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(user.id, 'active')}
                              className="text-green-600"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Activate
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(user.id, 'suspended')}
                              className="text-red-600"
                            >
                              <UserX className="mr-2 h-4 w-4" />
                              Suspend
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    No users found. Add users in Supabase or check connection.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {data?.pagination && data.data.length > 0 && (
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
    </div>
  );
};

export default AdminUsers;
