
import React from 'react';

interface EngagementCellProps {
  likes: number;
  comments: number;
  shares: number;
}

const EngagementCell: React.FC<EngagementCellProps> = ({ likes, comments, shares = 0 }) => {
  return (
    <div className="flex space-x-2">
      <span title="Likes">👍 {likes}</span>
      <span title="Comments">💬 {comments}</span>
      <span title="Shares">🔄 {shares}</span>
    </div>
  );
};

export default EngagementCell;
