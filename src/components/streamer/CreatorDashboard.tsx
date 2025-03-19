
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Video, BarChart2, Calendar, Clock, Users, Gift } from 'lucide-react';
import BattleStats from './BattleStats';
import StreamHistory from './StreamHistory';
import StreamerSchedule from './StreamerSchedule';
import StreamHighlights from './StreamHighlights';
import { useAuth } from '@/context/AuthContext';

const CreatorDashboard = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  
  if (!user || !(hasRole && hasRole('seller'))) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Creator Access Required</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">You need to be a registered seller to access the creator dashboard.</p>
          <Button onClick={() => navigate('/')}>Return to Home</Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="container max-w-6xl mx-auto py-6 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Creator Dashboard</h1>
          <p className="text-gray-500">Manage your content, streams, and audience</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-3">
          <Button variant="outline" onClick={() => navigate('/upload')}>
            <Video className="mr-2 h-4 w-4" /> Upload Video
          </Button>
          <Button onClick={() => navigate('/streamer-broadcast')}>
            Go Live
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="stats" className="flex items-center">
            <BarChart2 className="mr-2 h-4 w-4" /> Statistics
          </TabsTrigger>
          <TabsTrigger value="streams" className="flex items-center">
            <Clock className="mr-2 h-4 w-4" /> Past Streams
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" /> Schedule
          </TabsTrigger>
          <TabsTrigger value="highlights" className="flex items-center">
            <Video className="mr-2 h-4 w-4" /> Highlights
          </TabsTrigger>
          <TabsTrigger value="followers" className="flex items-center">
            <Users className="mr-2 h-4 w-4" /> Audience
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="stats" className="space-y-6">
          <BattleStats />
        </TabsContent>
        
        <TabsContent value="streams" className="space-y-6">
          <StreamHistory />
        </TabsContent>
        
        <TabsContent value="schedule" className="space-y-6">
          <StreamerSchedule />
        </TabsContent>
        
        <TabsContent value="highlights" className="space-y-6">
          <StreamHighlights />
        </TabsContent>
        
        <TabsContent value="followers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Audience Insights</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-8">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Audience insights will be available soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreatorDashboard;
