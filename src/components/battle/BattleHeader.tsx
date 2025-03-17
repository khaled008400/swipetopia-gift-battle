
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BattleHeaderProps {
  title?: string;
}

const BattleHeader: React.FC<BattleHeaderProps> = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center px-4 py-3">
      <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-6 w-6 text-white" />
      </Button>
      
      {title && (
        <h1 className="text-lg font-semibold text-white">{title}</h1>
      )}
      
      <Button variant="ghost" size="icon">
        <MoreVertical className="h-6 w-6 text-white" />
      </Button>
    </div>
  );
};

export default BattleHeader;
