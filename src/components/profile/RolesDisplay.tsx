
import { Badge } from "@/components/ui/badge";
import { UserRole } from "@/types/auth.types";
import { Crown, ShoppingBag, Video } from "lucide-react";

interface RolesDisplayProps {
  roles: UserRole[];
}

const RolesDisplay = ({ roles }: RolesDisplayProps) => {
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "admin":
        return (
          <Badge key={role} variant="secondary" className="bg-red-500/10 text-red-500 hover:bg-red-500/20">
            <Crown className="w-3 h-3 mr-1" /> Admin
          </Badge>
        );
      case "seller":
        return (
          <Badge key={role} variant="secondary" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
            <ShoppingBag className="w-3 h-3 mr-1" /> Seller
          </Badge>
        );
      case "streamer":
        return (
          <Badge key={role} variant="secondary" className="bg-purple-500/10 text-purple-500 hover:bg-purple-500/20">
            <Video className="w-3 h-3 mr-1" /> Streamer
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center gap-2 mt-2">
      {roles.map(role => getRoleBadge(role))}
    </div>
  );
};

export default RolesDisplay;
