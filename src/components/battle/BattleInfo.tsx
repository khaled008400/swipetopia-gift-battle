
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, Award, Trophy } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface BattleInfoProps {
  battle: any;
}

export const BattleInfo = ({ battle }: BattleInfoProps) => {
  const formattedStartDate = battle?.created_at
    ? new Date(battle.created_at).toLocaleDateString()
    : "Unknown date";
    
  const formattedStartTime = battle?.created_at
    ? new Date(battle.created_at).toLocaleTimeString()
    : "Unknown time";
    
  // Calculate duration if battle has ended
  let duration = "Ongoing";
  if (battle?.status === "completed" && battle?.created_at && battle?.ended_at) {
    const startTime = new Date(battle.created_at).getTime();
    const endTime = new Date(battle.ended_at).getTime();
    const durationMs = endTime - startTime;
    
    // Format as hours and minutes
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    duration = `${hours > 0 ? `${hours}h ` : ""}${minutes}m`;
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold mb-2">{battle?.title || "Battle"}</h3>
        <p className="text-sm text-muted-foreground">{battle?.description || "No description provided."}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Date</p>
            <p className="text-sm font-medium">{formattedStartDate}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Time</p>
            <p className="text-sm font-medium">{formattedStartTime}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Participants</p>
            <p className="text-sm font-medium">{battle?.participant_count || 2}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Award className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Status</p>
            <Badge variant={
              battle?.status === "completed" ? "default" : 
              battle?.status === "active" ? "secondary" : "outline"
            }>
              {battle?.status === "completed" ? "Completed" : 
               battle?.status === "active" ? "Active" : "Pending"}
            </Badge>
          </div>
        </div>
      </div>
      
      {battle?.winner_id && (
        <div className="mt-4 p-3 border rounded-md bg-muted/30">
          <h4 className="font-semibold flex items-center">
            <Trophy className="h-4 w-4 mr-2 text-yellow-500" />
            Winner
          </h4>
          <div className="flex items-center mt-2">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={battle?.winner?.avatar_url} />
              <AvatarFallback>
                {battle?.winner?.username?.charAt(0) || "W"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{battle?.winner?.username || "Unknown winner"}</p>
              <p className="text-xs text-muted-foreground">
                {battle?.winner_votes || 0} votes
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="border-t pt-4 mt-4">
        <h4 className="font-semibold mb-2">Rules</h4>
        <ul className="text-sm space-y-1 list-disc pl-5">
          <li>Each participant can submit one video for the battle</li>
          <li>Viewers can vote for their favorite video once</li>
          <li>The video with the most votes at the end wins</li>
          <li>No inappropriate content allowed</li>
          <li>Be respectful to other participants</li>
        </ul>
      </div>
    </div>
  );
};

export default BattleInfo;
