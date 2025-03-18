
import React from 'react';

// Component code with fixed array access
const TrendingHashtags = () => {
  // Mock data for trending hashtags and creators
  const trendingHashtags = [
    { id: 1, name: '#SummerVibes', count: 1200 },
    { id: 2, name: '#TravelGoals', count: 950 },
    { id: 3, name: '#FitnessChallenge', count: 800 },
  ];

  const hashtagCreators = {
    '#SummerVibes': { id: 'user1', username: 'summerLover', avatar_url: '/avatars/summerLover.jpg' },
    '#TravelGoals': { id: 'user2', username: 'travelBug', avatar_url: '/avatars/travelBug.jpg' },
    '#FitnessChallenge': { id: 'user3', username: 'fitLife', avatar_url: '/avatars/fitLife.jpg' },
  };

  const renderCreators = (creator: any) => {
    if (!creator) return null;
    
    return (
      <div className="flex items-center mt-2">
        <img
          src={creator?.avatar_url || "/placeholder-avatar.jpg"}
          alt={creator?.username || "Creator"}
          className="w-6 h-6 rounded-full mr-2"
        />
        <span className="text-sm">{creator?.username || "Anonymous"}</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Trending Hashtags</h2>
      <ul>
        {trendingHashtags.map((hashtag) => (
          <li key={hashtag.id} className="py-2 border-b last:border-b-0">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium text-gray-700">{hashtag.name}</span>
                {renderCreators(hashtagCreators[hashtag.name])}
              </div>
              <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded-full text-sm">
                {hashtag.count} posts
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrendingHashtags;
