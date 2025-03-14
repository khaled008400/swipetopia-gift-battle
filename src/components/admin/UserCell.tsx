
import React from 'react';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

interface UserCellProps {
  username: string;
  userId: string;
  onViewUserProfile?: (userId: string) => void;
}

const UserCell: React.FC<UserCellProps> = ({ username, userId, onViewUserProfile }) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="font-medium">{username}</span>
      {onViewUserProfile && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6" 
          onClick={() => onViewUserProfile(userId)}
        >
          <User className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default UserCell;
