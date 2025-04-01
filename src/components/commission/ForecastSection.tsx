
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import CommissionForecastChart from './forecast/CommissionForecastChart';

interface ForecastSectionProps {
  months?: number;
  agentId?: string;
}

const ForecastSection: React.FC<ForecastSectionProps> = ({ 
  months = 6,
  agentId 
}) => {
  const { user } = useAuth();
  const userId = agentId || user?.id;
  
  // Sample data - in a real app, this would come from an API
  const historicalData = [
    { month: 'Jan', amount: 5000 },
    { month: 'Feb', amount: 7200 },
    { month: 'Mar', amount: 6800 },
    { month: 'Apr', amount: 9500 }
  ];
  
  const projectedData = [
    { month: 'Apr', amount: 9500 },
    { month: 'May', amount: 11000 },
    { month: 'Jun', amount: 12500 },
    { month: 'Jul', amount: 14000 }
  ];

  return (
    <div className="space-y-6">
      <CommissionForecastChart 
        historicalData={historicalData}
        projectedData={projectedData}
      />
    </div>
  );
};

export default ForecastSection;
