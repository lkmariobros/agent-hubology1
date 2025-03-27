
import React from 'react';
import { getMockDataMode, setMockDataMode } from '@/config';
import { Button } from '@/components/ui/button';
import { Database, Server } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface MockDataToggleProps {
  className?: string;
}

const MockDataToggle: React.FC<MockDataToggleProps> = ({ className = '' }) => {
  // Only render in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const [useMockData, setUseMockData] = React.useState(getMockDataMode());

  const toggleMockData = () => {
    const newValue = !useMockData;
    setMockDataMode(newValue);
    setUseMockData(newValue);
    
    toast.success(
      newValue 
        ? 'Using mock data for development' 
        : 'Using real Supabase data',
      {
        icon: newValue ? <Database className="h-4 w-4" /> : <Server className="h-4 w-4" />,
        duration: 2000
      }
    );
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge variant={useMockData ? "default" : "outline"} className="flex items-center gap-1">
        <Database className="h-3 w-3" />
        <span className="text-xs">Data Source:</span>
        <span className="text-xs font-semibold">
          {useMockData ? 'MOCK' : 'REAL'}
        </span>
      </Badge>
      
      <div className="flex items-center gap-1">
        <Switch
          checked={useMockData}
          onCheckedChange={toggleMockData}
          size="sm"
        />
      </div>
    </div>
  );
};

export default MockDataToggle;
