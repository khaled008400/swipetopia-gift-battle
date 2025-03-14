
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface GiftFiltersProps {
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
}

const GiftFilters = ({ categoryFilter, onCategoryFilterChange }: GiftFiltersProps) => {
  return (
    <div className="flex gap-4 items-center">
      <div className="w-60">
        <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="celebration">Celebration</SelectItem>
            <SelectItem value="luxury">Luxury</SelectItem>
            <SelectItem value="cute">Cute</SelectItem>
            <SelectItem value="funny">Funny</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default GiftFilters;
