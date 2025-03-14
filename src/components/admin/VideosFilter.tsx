
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search, Filter, Calendar, User } from 'lucide-react';
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';

interface VideosFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  userFilter: string;
  onUserFilterChange: (value: string) => void;
  dateFilter: Date | undefined;
  onDateFilterChange: (date: Date | undefined) => void;
  onResetFilters: () => void;
}

const VideosFilter: React.FC<VideosFilterProps> = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  userFilter,
  onUserFilterChange,
  dateFilter,
  onDateFilterChange,
  onResetFilters
}) => {
  return (
    <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
      <div className="flex space-x-2">
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="flagged">Flagged</SelectItem>
            <SelectItem value="removed">Removed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[150px] justify-start">
              <User className="mr-2 h-4 w-4" />
              {userFilter ? userFilter : "Filter by User"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <div className="p-2">
              <Input 
                placeholder="Enter username" 
                value={userFilter}
                onChange={(e) => onUserFilterChange(e.target.value)}
              />
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[150px] justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              {dateFilter ? format(dateFilter, "PPP") : "Filter by Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[280px] p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={dateFilter}
              onSelect={onDateFilterChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex space-x-2">
        <form className="relative flex-1" onSubmit={(e) => e.preventDefault()}>
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search videos..."
            className="pl-8"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </form>
        <Button variant="ghost" onClick={onResetFilters}>Reset</Button>
      </div>
    </div>
  );
};

export default VideosFilter;
