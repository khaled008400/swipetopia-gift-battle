
import React from 'react';
import { VirtualGift } from '@/services/admin.service';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface GiftsTableProps {
  gifts: VirtualGift[];
  onEdit: (gift: VirtualGift) => void;
  onDelete: (id: string) => void;
  onToggleAvailability: (gift: VirtualGift) => void;
}

const GiftsTable = ({ gifts, onEdit, onDelete, onToggleAvailability }: GiftsTableProps) => {
  if (gifts.length === 0) {
    return (
      <div className="text-center p-8 border rounded-md">
        <p className="text-muted-foreground">No virtual gifts found</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Preview</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Features</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Added</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {gifts.map((gift) => (
          <TableRow key={gift.id}>
            <TableCell>
              <img 
                src={gift.imageUrl} 
                alt={gift.name} 
                className="w-12 h-12 object-contain"
              />
            </TableCell>
            <TableCell className="font-medium">{gift.name}</TableCell>
            <TableCell>{gift.price} coins</TableCell>
            <TableCell>
              <Badge variant="outline" className="capitalize">
                {gift.category}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex gap-1 flex-wrap">
                <Badge variant="secondary" className="capitalize">
                  {gift.imageType}
                </Badge>
                {gift.hasSound && (
                  <Badge variant="secondary" className="bg-app-yellow/20 text-app-yellow border-app-yellow">
                    Sound
                  </Badge>
                )}
              </div>
            </TableCell>
            <TableCell>
              <Badge 
                variant={gift.available ? "default" : "outline"} 
                className={gift.available ? "bg-green-500" : "text-muted-foreground"}
              >
                {gift.available ? "Available" : "Hidden"}
              </Badge>
            </TableCell>
            <TableCell>
              {formatDistanceToNow(new Date(gift.createdAt), { addSuffix: true })}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onToggleAvailability(gift)}
                  title={gift.available ? "Hide gift" : "Make available"}
                >
                  {gift.available ? (
                    <ToggleRight className="h-4 w-4" />
                  ) : (
                    <ToggleLeft className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(gift)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(gift.id)}
                  className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default GiftsTable;
