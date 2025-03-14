
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-500">Active</Badge>;
    case 'flagged':
      return <Badge className="bg-yellow-500">Flagged</Badge>;
    case 'removed':
      return <Badge className="bg-red-500">Removed</Badge>;
    case 'pending':
      return <Badge className="bg-blue-500">Pending</Badge>;
    default:
      return <Badge className="bg-gray-500">Unknown</Badge>;
  }
};

export default StatusBadge;
