
import React from 'react';
import { Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import NotificationBell from '../NotificationBell';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const NavUtilities: React.FC = () => {
  return (
    <div className="flex items-center space-x-3">
      <NotificationBell />
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Link to="/settings">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>Settings</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default NavUtilities;
