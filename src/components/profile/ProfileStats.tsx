
import { UserProfile } from "@/types/auth.types";

interface ProfileStatsProps {
  user: UserProfile;
}

const ProfileStats = ({ user }: ProfileStatsProps) => {
  return (
    <div className="flex justify-center gap-8 mt-4">
      <div className="profile-stat">
        <span className="text-xl font-bold">{user.followers || 0}</span>
        <span className="text-sm text-gray-400">Followers</span>
      </div>
      <div className="profile-stat">
        <span className="text-xl font-bold">{user.following || 0}</span>
        <span className="text-sm text-gray-400">Following</span>
      </div>
      <div className="profile-stat">
        <span className="text-xl font-bold">{user.coins || 0}</span>
        <span className="text-sm text-gray-400">Coins</span>
      </div>
    </div>
  );
};

export default ProfileStats;
