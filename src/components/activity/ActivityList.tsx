
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  ShoppingBag,
  UserPlus,
  Calendar,
  Clock
} from "lucide-react";

// Activity types
type ActivityType = "like" | "comment" | "share" | "purchase" | "follow";

interface Activity {
  id: string;
  type: ActivityType;
  content: string;
  target: {
    type: "video" | "user" | "product";
    id: string;
    name: string;
    image: string;
  };
  timestamp: string;
  timeAgo: string;
}

interface ActivityListProps {
  type: "all" | "interactions" | "purchases";
}

const ActivityList = ({ type }: ActivityListProps) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchActivities = () => {
      // Mock data
      const mockActivities: Activity[] = [
        {
          id: "1",
          type: "like",
          content: "You liked a video",
          target: {
            type: "video",
            id: "v1",
            name: "Summer Dance Challenge",
            image: "https://picsum.photos/id/1/100/100",
          },
          timestamp: "2023-07-15T09:24:00",
          timeAgo: "2 hours ago"
        },
        {
          id: "2",
          type: "comment",
          content: "You commented: \"This is amazing!\"",
          target: {
            type: "video",
            id: "v2",
            name: "Cooking Tutorial",
            image: "https://picsum.photos/id/2/100/100",
          },
          timestamp: "2023-07-15T08:30:00",
          timeAgo: "3 hours ago"
        },
        {
          id: "3",
          type: "purchase",
          content: "You purchased an item",
          target: {
            type: "product",
            id: "p1",
            name: "Fashion T-shirt",
            image: "https://picsum.photos/id/3/100/100",
          },
          timestamp: "2023-07-14T15:45:00",
          timeAgo: "1 day ago"
        },
        {
          id: "4",
          type: "share",
          content: "You shared a video",
          target: {
            type: "video",
            id: "v3",
            name: "Travel Vlog",
            image: "https://picsum.photos/id/4/100/100",
          },
          timestamp: "2023-07-14T13:20:00",
          timeAgo: "1 day ago"
        },
        {
          id: "5",
          type: "follow",
          content: "You followed a creator",
          target: {
            type: "user",
            id: "u1",
            name: "JaneCreator",
            image: "https://picsum.photos/id/5/100/100",
          },
          timestamp: "2023-07-13T10:15:00",
          timeAgo: "2 days ago"
        },
        {
          id: "6",
          type: "purchase",
          content: "You purchased an item",
          target: {
            type: "product",
            id: "p2",
            name: "Smart Watch",
            image: "https://picsum.photos/id/6/100/100",
          },
          timestamp: "2023-07-12T16:40:00",
          timeAgo: "3 days ago"
        },
      ];
      
      // Filter based on activity type
      if (type === "interactions") {
        return mockActivities.filter(a => ["like", "comment", "share", "follow"].includes(a.type));
      } else if (type === "purchases") {
        return mockActivities.filter(a => a.type === "purchase");
      }
      
      return mockActivities;
    };
    
    setActivities(fetchActivities());
  }, [type]);
  
  const getActivityIcon = (activityType: ActivityType) => {
    switch (activityType) {
      case "like":
        return <Heart className="h-4 w-4 text-red-500" />;
      case "comment":
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case "share":
        return <Share2 className="h-4 w-4 text-green-500" />;
      case "purchase":
        return <ShoppingBag className="h-4 w-4 text-purple-500" />;
      case "follow":
        return <UserPlus className="h-4 w-4 text-app-yellow" />;
    }
  };
  
  if (activities.length === 0) {
    return (
      <div className="text-center p-8 text-gray-400">
        No activities found.
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={activity.id} className="bg-app-gray-dark rounded-lg overflow-hidden">
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Badge 
                variant="outline" 
                className="bg-app-gray-light border-0 text-white flex items-center gap-1"
              >
                {getActivityIcon(activity.type)}
                {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="h-3 w-3" />
                {activity.timeAgo}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-md overflow-hidden">
                <img 
                  src={activity.target.image} 
                  alt={activity.target.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium">{activity.content}</p>
                <p className="text-sm text-gray-400">{activity.target.name}</p>
              </div>
            </div>
            
            <div className="flex items-center mt-3 text-xs text-gray-400">
              <Calendar className="h-3 w-3 mr-1" />
              {new Date(activity.timestamp).toLocaleDateString()}
            </div>
          </div>
          
          {index < activities.length - 1 && <Separator className="bg-app-gray-light" />}
        </div>
      ))}
    </div>
  );
};

export default ActivityList;
