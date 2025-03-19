
import React from 'react';
import { UserProfile } from "@/types/auth.types";

interface ProfileStatsProps {
  followersCount: number;
  followingCount: number;
  videosCount: number;
  className?: string;
}

const ProfileStats = ({ followersCount, followingCount, videosCount, className = '' }: ProfileStatsProps) => {
  return (
    <div className={`flex justify-center gap-8 ${className}`}>
      <div className="profile-stat">
        <span className="text-xl font-bold">{followersCount}</span>
        <span className="text-sm text-gray-400">Followers</span>
      </div>
      <div className="profile-stat">
        <span className="text-xl font-bold">{followingCount}</span>
        <span className="text-sm text-gray-400">Following</span>
      </div>
      <div className="profile-stat">
        <span className="text-xl font-bold">{videosCount}</span>
        <span className="text-sm text-gray-400">Videos</span>
      </div>
    </div>
  );
};

export default ProfileStats;
