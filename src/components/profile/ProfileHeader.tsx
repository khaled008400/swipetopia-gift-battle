
import { UserProfile } from "@/types/auth.types";

interface ProfileHeaderProps {
  user: UserProfile;
}

const ProfileHeader = ({ user }: ProfileHeaderProps) => {
  return (
    <>
      <div className="relative">
        <div className="h-32 bg-gradient-to-r from-app-gray-dark to-app-gray-light"></div>
        <div className="absolute -bottom-16 w-full flex flex-col items-center">
          <div className="w-32 h-32 rounded-full border-4 border-app-black overflow-hidden">
            <img
              src={user.avatar_url || "https://via.placeholder.com/150"}
              alt={user.username}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="mt-20 flex flex-col items-center px-4">
        <h1 className="text-2xl font-bold">@{user.username}</h1>
        {user.bio && (
          <p className="text-gray-400 text-sm text-center mt-2 max-w-md">
            {user.bio}
          </p>
        )}
        {user.location && (
          <p className="text-gray-500 text-xs mt-1">
            📍 {user.location}
          </p>
        )}
      </div>
    </>
  );
};

export default ProfileHeader;
