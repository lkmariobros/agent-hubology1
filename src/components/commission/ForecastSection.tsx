
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

  return (
    <div className="space-y-6">
      <CommissionForecastChart months={months} userId={userId} />
    </div>
  );
};

export default ForecastSection;
