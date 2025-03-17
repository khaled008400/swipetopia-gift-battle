
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as AuthService from '@/services/auth.service';
import { Button } from '@/components/ui/button';
import { Video } from '@/types/video.types';

const Index = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const handleLogin = async () => {
    setLoading(true);
    try {
      await AuthService.loginWithEmail('demo@example.com', 'password123');
      navigate('/home');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Mock featured video
  const featuredVideo: Video = {
    id: 'featured-1',
    title: 'Creator Studio Demo',
    description: 'Learn how to use our new Creator Studio features!',
    video_url: 'https://example.com/videos/creator-studio-demo.mp4',
    thumbnail_url: 'https://example.com/thumbnails/creator-studio-demo.jpg',
    user_id: 'admin',
    view_count: 5280,
    likes_count: 423,
    is_live: true,
    creator: {
      username: 'OfficialApp',
      avatar: 'https://example.com/avatars/official.jpg',
      id: 'admin'
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <div className="container mx-auto px-4 py-12 flex flex-col items-center">
        <h1 className="text-5xl font-bold text-center mb-6">Welcome to Our App</h1>
        <p className="text-xl text-center text-gray-300 mb-12 max-w-2xl">
          Join our community of creators and discover amazing content.
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <Button 
            size="lg" 
            onClick={handleLogin}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {loading ? 'Signing in...' : 'Try Demo'}
          </Button>
          
          <Link to="/register">
            <Button size="lg" variant="outline" className="border-purple-600 text-purple-400 hover:bg-purple-950">
              Sign Up
            </Button>
          </Link>
        </div>
        
        <div className="mt-12 w-full max-w-4xl">
          <h2 className="text-2xl font-semibold mb-6">Featured Content</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Featured content cards would go here */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="relative">
                <img 
                  src={featuredVideo.thumbnail_url || '/placeholder.svg'} 
                  alt={featuredVideo.title} 
                  className="w-full aspect-video object-cover"
                />
                {featuredVideo.is_live && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                    LIVE
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg">{featuredVideo.title}</h3>
                <p className="text-gray-400 text-sm mt-1">{featuredVideo.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
