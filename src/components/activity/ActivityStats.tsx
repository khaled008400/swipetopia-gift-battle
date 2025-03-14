
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/auth/AuthContext";
import { Activity, Heart, MessageSquare, ShoppingBag } from "lucide-react";

const ActivityStats = () => {
  const { user } = useAuth();
  
  // In a real app, this would come from an API call
  const stats = {
    totalActions: 248,
    likes: 156,
    comments: 43,
    purchases: 12
  };
  
  return (
    <Card className="bg-app-gray-dark border-0">
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-3">Activity Summary</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 bg-app-gray-light rounded-lg p-3">
            <div className="bg-app-yellow rounded-full p-2">
              <Activity className="h-5 w-5 text-app-black" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Total Actions</p>
              <p className="text-lg font-semibold">{stats.totalActions}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-app-gray-light rounded-lg p-3">
            <div className="bg-red-500 rounded-full p-2">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Likes Given</p>
              <p className="text-lg font-semibold">{stats.likes}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-app-gray-light rounded-lg p-3">
            <div className="bg-blue-500 rounded-full p-2">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Comments</p>
              <p className="text-lg font-semibold">{stats.comments}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-app-gray-light rounded-lg p-3">
            <div className="bg-green-500 rounded-full p-2">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Purchases</p>
              <p className="text-lg font-semibold">{stats.purchases}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityStats;
