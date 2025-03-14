
import React, { useRef, useEffect } from 'react';
import { TableHead } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';

interface TableHeadWithCheckboxProps {
  allSelected: boolean;
  someSelected: boolean;
  onSelectAll: (checked: boolean) => void;
}

const TableHeadWithCheckbox: React.FC<TableHeadWithCheckboxProps> = ({ 
  allSelected, 
  someSelected, 
  onSelectAll 
}) => {
  const checkboxRef = useRef<HTMLButtonElement>(null);
  
  // Set the indeterminate property on the checkbox DOM element when needed
  useEffect(() => {
    if (checkboxRef.current) {
      // TypeScript doesn't know about the indeterminate property on HTMLButtonElement
      // so we need to use the Element type that has this property
      const element = checkboxRef.current as unknown as HTMLInputElement;
      element.indeterminate = someSelected;
    }
  }, [someSelected]);

  return (
    <TableHead className="w-12">
      <Checkbox 
        ref={checkboxRef}
        checked={allSelected}
        onCheckedChange={(checked) => onSelectAll(!!checked)}
      />
    </TableHead>
  );
};

export default TableHeadWithCheckbox;
