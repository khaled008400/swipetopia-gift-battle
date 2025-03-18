import React from 'react';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { VirtualGift } from '@/types/gift.types';

interface GiftsTableProps {
  gifts: VirtualGift[];
  onEdit: (gift: VirtualGift) => void;
  onDelete: (giftId: string) => void;
}

const GiftsTable = ({ gifts, onEdit, onDelete }: GiftsTableProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {gifts.map((gift) => (
            <TableRow key={gift.id}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: gift.color || '#e2e2e2' }}
                  >
                    {gift.icon && <span>{gift.icon}</span>}
                  </div>
                  <span>{gift.name}</span>
                </div>
              </TableCell>
              <TableCell>{gift.value}</TableCell>
              <TableCell>${gift.price}</TableCell>
              <TableCell>
                <Badge className={gift.available ? "bg-green-500" : "bg-red-500"}>
                  {gift.available ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>{new Date(gift.created_at).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onEdit(gift)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onDelete(gift.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default GiftsTable;
