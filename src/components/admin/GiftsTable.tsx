
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Edit, Trash2, Volume2, VolumeX } from 'lucide-react';
import { format } from 'date-fns';
import type { VirtualGift } from '@/services/admin.service';

interface GiftsTableProps {
  gifts: VirtualGift[];
  onEditGift: (gift: VirtualGift) => void;
  onDeleteGift: (id: string) => void;
  onToggleAvailability: (id: string, currentStatus: boolean) => void;
}

const GiftsTable: React.FC<GiftsTableProps> = ({
  gifts,
  onEditGift,
  onDeleteGift,
  onToggleAvailability
}) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Preview</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Sound</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Available</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {gifts.length > 0 ? (
            gifts.map((gift) => (
              <TableRow key={gift.id}>
                <TableCell className="font-medium">{gift.name}</TableCell>
                <TableCell>
                  {gift.imageUrl ? (
                    <img
                      src={gift.imageUrl}
                      alt={gift.name}
                      className="h-10 w-10 object-contain"
                    />
                  ) : (
                    <div
                      className="h-10 w-10 flex items-center justify-center rounded-md"
                      style={{ backgroundColor: gift.color || '#f3f4f6' }}
                    >
                      {gift.icon || '🎁'}
                    </div>
                  )}
                </TableCell>
                <TableCell>{gift.price} coins</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {gift.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  {gift.hasSound ? (
                    <Badge className="bg-green-500">
                      <Volume2 className="mr-1 h-3 w-3" />
                      Yes
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      <VolumeX className="mr-1 h-3 w-3" />
                      No
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {format(new Date(gift.created_at), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={gift.available}
                    onCheckedChange={() => onToggleAvailability(gift.id, gift.available)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => onEditGift(gift)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500"
                      onClick={() => onDeleteGift(gift.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center h-32 text-muted-foreground">
                No gifts found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default GiftsTable;
