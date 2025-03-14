
import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';

interface PaginationInfo {
  total: number;
  last_page: number;
  current_page: number;
}

interface UsersPaginationProps {
  pagination: PaginationInfo;
  page: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onPageChange: (page: number) => void;
}

const UsersPagination: React.FC<UsersPaginationProps> = ({
  pagination,
  page,
  onPrevPage,
  onNextPage,
  onPageChange
}) => {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={onPrevPage}
            className={page === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        
        {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
          const pageNum = i + 1;
          return (
            <PaginationItem key={i}>
              <PaginationLink 
                isActive={page === pageNum}
                onClick={() => onPageChange(pageNum)}
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        
        <PaginationItem>
          <PaginationNext 
            onClick={onNextPage}
            className={page === pagination.last_page ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default UsersPagination;
