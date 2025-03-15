
import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoaderProps {
  size?: 'sm' | 'default' | 'lg' | 'xl';
  className?: string;
  text?: string;
}

const Loader = ({ size = 'default', className, text }: LoaderProps) => {
  const sizeMap = {
    sm: 'h-4 w-4',
    default: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <Loader2 
        className={cn(
          'animate-spin text-muted-foreground',
          sizeMap[size],
          className
        )} 
      />
      {text && <p className="mt-2 text-sm text-muted-foreground">{text}</p>}
    </div>
  );
};

export default Loader;
