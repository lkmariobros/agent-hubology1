
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trophy, BarChart3 } from 'lucide-react';
import PointsLeaderboard from './Points';
import SalesLeaderboard from './Sales';
import { useNavigate, useLocation } from 'react-router-dom';

const Leaderboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname.includes('points') ? 'points' : 
                   location.pathname.includes('sales') ? 'sales' : 'points';

  const handleTabChange = (value: string) => {
    navigate(`/leaderboard/${value}`);
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Trophy className="h-8 w-8 mr-3 text-property-orange" />
        <h1 className="text-3xl font-bold">Leaderboard</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Agent Performance</CardTitle>
              <CardDescription>Track and compare agent performance across different metrics</CardDescription>
            </div>
            <Tabs 
              value={activeTab} 
              onValueChange={handleTabChange} 
              className="mt-4 md:mt-0"
            >
              <TabsList>
                <TabsTrigger value="points" className="flex items-center">
                  <Trophy className="h-4 w-4 mr-2" />
                  Points
                </TabsTrigger>
                <TabsTrigger value="sales" className="flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Sales
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {activeTab === 'points' && <PointsLeaderboard />}
            {activeTab === 'sales' && <SalesLeaderboard />}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Leaderboard;
