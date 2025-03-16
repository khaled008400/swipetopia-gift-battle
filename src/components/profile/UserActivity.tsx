
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';

interface Activity {
  id: string;
  type: 'like' | 'comment' | 'share' | 'save';
  target: {
    id: string;
    title: string;
    thumbnail?: string;
  };
  timestamp: string;
}

interface UserActivityProps {
  userId: string;
}

const UserActivity: React.FC<UserActivityProps> = ({ userId }) => {
  // This is mock data, in a real application you would fetch from an API
  const activities: Activity[] = [
    {
      id: '1',
      type: 'like',
      target: {
        id: 'v1',
        title: 'Amazing dance moves',
        thumbnail: 'https://picsum.photos/200/300',
      },
      timestamp: '2023-08-15T12:00:00Z',
    },
    {
      id: '2',
      type: 'comment',
      target: {
        id: 'v2',
        title: 'Cooking tutorial',
        thumbnail: 'https://picsum.photos/200/301',
      },
      timestamp: '2023-08-14T15:30:00Z',
    },
  ];

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No activity to display
      </div>
    );
  }

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'like':
        return <Heart className="h-4 w-4 text-red-500" />;
      case 'comment':
        return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case 'share':
        return <Share2 className="h-4 w-4 text-green-500" />;
      case 'save':
        return <Bookmark className="h-4 w-4 text-purple-500" />;
    }
  };

  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case 'like':
        return `You liked "${activity.target.title}"`;
      case 'comment':
        return `You commented on "${activity.target.title}"`;
      case 'share':
        return `You shared "${activity.target.title}"`;
      case 'save':
        return `You saved "${activity.target.title}"`;
    }
  };

  return (
    <div className="space-y-4">
      {activities.map(activity => (
        <Card key={activity.id}>
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <div className="mt-1">{getActivityIcon(activity.type)}</div>
              <div className="flex-1">
                <p className="font-medium">{getActivityText(activity)}</p>
                <p className="text-sm text-gray-500">
                  {new Date(activity.timestamp).toLocaleDateString()} at{' '}
                  {new Date(activity.timestamp).toLocaleTimeString()}
                </p>
              </div>
              {activity.target.thumbnail && (
                <div className="h-12 w-12 rounded overflow-hidden">
                  <img
                    src={activity.target.thumbnail}
                    alt={activity.target.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UserActivity;
