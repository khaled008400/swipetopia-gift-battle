
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Users, User, Calendar, ChevronRight } from "lucide-react";

// Mock battle data
const UPCOMING_BATTLES = [
  { id: 1, title: "Dance Battle Finals", participants: 12, time: "Today, 8:00 PM", prize: 5000 },
  { id: 2, title: "Fashion Week Special", participants: 8, time: "Tomorrow, 7:30 PM", prize: 3000 },
  { id: 3, title: "Singing Competition", participants: 10, time: "Aug 25, 9:00 PM", prize: 4000 },
];

const LIVE_BATTLES = [
  { 
    id: 1, 
    title: "Dance Battle Semi-finals", 
    participants: 8, 
    viewers: 1250, 
    user1: { name: "dancequeen", avatar: "https://i.pravatar.cc/150?img=1" },
    user2: { name: "groovyking", avatar: "https://i.pravatar.cc/150?img=2" }
  },
  { 
    id: 2, 
    title: "Lip Sync Battle", 
    participants: 6, 
    viewers: 875, 
    user1: { name: "lipqueen", avatar: "https://i.pravatar.cc/150?img=3" },
    user2: { name: "syncmaster", avatar: "https://i.pravatar.cc/150?img=4" }
  },
];

const BattlePage = () => {
  const [activeTab, setActiveTab] = useState("live");

  return (
    <div className="min-h-[calc(100vh-64px)] bg-app-black p-4">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <Trophy className="w-6 h-6 mr-2" /> Battles
      </h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-2 mb-6">
          <TabsTrigger value="live">Live Now</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="space-y-4 animate-fade-in">
          {LIVE_BATTLES.map((battle) => (
            <div key={battle.id} className="p-4 bg-app-gray-dark rounded-xl overflow-hidden">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold">{battle.title}</h3>
                <div className="flex items-center text-red-500 text-xs">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></div>
                  LIVE
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1 text-gray-400" />
                  <span className="text-xs text-gray-400">{battle.viewers} watching</span>
                </div>
                <div className="bg-app-yellow text-app-black text-xs font-bold py-1 px-2 rounded-full">
                  VS
                </div>
              </div>

              <div className="relative flex justify-between mb-4">
                <div className="text-center flex-1">
                  <div className="w-16 h-16 mx-auto rounded-full overflow-hidden border-2 border-app-yellow">
                    <img src={battle.user1.avatar} alt={battle.user1.name} className="w-full h-full object-cover" />
                  </div>
                  <p className="mt-1 font-medium text-sm">@{battle.user1.name}</p>
                </div>

                <div className="text-center flex-1">
                  <div className="w-16 h-16 mx-auto rounded-full overflow-hidden border-2 border-app-yellow">
                    <img src={battle.user2.avatar} alt={battle.user2.name} className="w-full h-full object-cover" />
                  </div>
                  <p className="mt-1 font-medium text-sm">@{battle.user2.name}</p>
                </div>
              </div>

              <Button className="w-full bg-app-yellow text-app-black hover:bg-app-yellow-hover">
                Join Battle
              </Button>
            </div>
          ))}

          <div className="mt-6 text-center">
            <Button variant="outline" className="border-app-yellow text-app-yellow hover:bg-app-yellow hover:text-app-black">
              Create a Battle
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="animate-fade-in">
          <div className="space-y-4">
            {UPCOMING_BATTLES.map((battle) => (
              <div key={battle.id} className="p-4 bg-app-gray-dark rounded-lg flex items-center justify-between">
                <div>
                  <h3 className="font-bold mb-1">{battle.title}</h3>
                  <div className="flex items-center text-sm text-gray-400">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{battle.time}</span>
                    <span className="mx-2">•</span>
                    <Users className="w-4 h-4 mr-1" />
                    <span>{battle.participants} participants</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-xs text-gray-400 mb-1">Prize pool</div>
                  <div className="text-app-yellow font-bold">{battle.prize} coins</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Button variant="outline" className="w-full border-dashed border-app-gray-light text-gray-400 hover:text-app-yellow hover:border-app-yellow">
              Show More
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BattlePage;
