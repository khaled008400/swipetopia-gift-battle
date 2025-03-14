
import React from 'react';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Loader2 } from 'lucide-react';
import { AdminUser, UserRole } from '@/services/admin.service';
import UserRow from './UserRow';

interface UsersTableProps {
  users: AdminUser[];
  isLoading: boolean;
  onStatusChange: (userId: string, status: 'active' | 'suspended') => void;
  onRoleChange: (userId: string, role: UserRole) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({ 
  users, 
  isLoading, 
  onStatusChange, 
  onRoleChange 
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
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
        {users && users.length > 0 ? (
          users.map((user: AdminUser) => (
            <UserRow 
              key={user.id} 
              user={user} 
              onStatusChange={onStatusChange} 
              onRoleChange={onRoleChange} 
            />
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
  );
};

export default UsersTable;
