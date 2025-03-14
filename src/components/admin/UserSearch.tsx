
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface UserSearchProps {
  search: string;
  onSearchChange: (value: string) => void;
  onSearch: (e: React.FormEvent) => void;
}

const UserSearch: React.FC<UserSearchProps> = ({ 
  search, 
  onSearchChange, 
  onSearch 
}) => {
  return (
    <form onSubmit={onSearch} className="relative w-64">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search users..."
        className="pl-8"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </form>
  );
};

export default UserSearch;
