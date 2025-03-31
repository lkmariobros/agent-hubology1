
import React from 'react';
import CommissionForecastChart from './forecast/CommissionForecastChart';
import PaymentScheduleList from './schedules/PaymentScheduleList';
import useAuth from '@/hooks/useAuth';

const ForecastSection: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Commission Forecast</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CommissionForecastChart agentId={user?.id} months={6} />
        </div>
        
        <div>
          <PaymentScheduleList agentId={user?.id} limit={5} />
        </div>
      </div>
    </div>
  );
};

export default ForecastSection;
