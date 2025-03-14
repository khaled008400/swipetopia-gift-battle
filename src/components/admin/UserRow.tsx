
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, CheckCircle, UserX, ShieldCheck, ShoppingBag, Video } from 'lucide-react';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { AdminUser, UserRole } from '@/services/admin.service';

interface UserRowProps {
  user: AdminUser;
  onStatusChange: (userId: string, status: 'active' | 'suspended') => void;
  onRoleChange: (userId: string, role: UserRole) => void;
}

const UserRow: React.FC<UserRowProps> = ({ user, onStatusChange, onRoleChange }) => {
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
    <TableRow>
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
            onValueChange={(value: UserRole) => onRoleChange(user.id, value)}
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
                onClick={() => onStatusChange(user.id, 'active')}
                className="text-green-600"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Activate
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onStatusChange(user.id, 'suspended')}
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
  );
};

export default UserRow;
