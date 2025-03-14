
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminService, { AdminUser, UserRole } from '@/services/admin.service';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import UserSearch from './UserSearch';
import UsersTable from './UsersTable';
import UsersPagination from './UsersPagination';

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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Users</h2>
        <UserSearch 
          search={search} 
          onSearchChange={setSearch} 
          onSearch={handleSearch} 
        />
      </div>

      <UsersTable 
        users={data?.data || []}
        isLoading={isLoading}
        onStatusChange={handleStatusChange}
        onRoleChange={handleRoleChange}
      />

      {data?.pagination && data.data.length > 0 && (
        <UsersPagination 
          pagination={data.pagination}
          page={page}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};

export default AdminUsers;
