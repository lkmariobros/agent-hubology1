
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home, Building, Users, FileText, Wallet, PieChart, Settings } from 'lucide-react';

interface BreadcrumbItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const PageBreadcrumb = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(segment => segment);
  
  // Define routes and their configs
  const routeConfigs: Record<string, { label: string, icon: React.ReactNode }> = {
    'dashboard': { label: 'Dashboard', icon: <Home size={16} className="mr-1" /> },
    'properties': { label: 'Properties', icon: <Building size={16} className="mr-1" /> },
    'agents': { label: 'Agents', icon: <Users size={16} className="mr-1" /> },
    'transactions': { label: 'Transactions', icon: <FileText size={16} className="mr-1" /> },
    'commission': { label: 'Commission', icon: <Wallet size={16} className="mr-1" /> },
    'reports': { label: 'Reports', icon: <PieChart size={16} className="mr-1" /> },
    'settings': { label: 'Settings', icon: <Settings size={16} className="mr-1" /> },
    'admin': { label: 'Admin', icon: <Settings size={16} className="mr-1" /> },
  };
  
  // Build breadcrumb items based on current path
  const breadcrumbItems: BreadcrumbItem[] = [{
    path: '/dashboard',
    label: 'Dashboard',
    icon: <Home size={16} className="mr-1" />
  }];
  
  // Add additional segments
  let currentPath = '';
  pathSegments.forEach((segment, index) => {
    // Skip the first dashboard segment since it's always included
    if (index === 0 && segment === 'dashboard') return;
    
    currentPath += `/${segment}`;
    const isLast = index === pathSegments.length - 1;
    
    // Check if it's a numeric ID (like in property/1)
    const isNumericId = !isNaN(Number(segment));
    
    if (isNumericId && index > 0) {
      // If it's an ID, use the previous segment's type
      const entityType = pathSegments[index - 1];
      // Remove trailing 's' if it exists (e.g., properties -> property)
      const singularType = entityType.endsWith('s') ? entityType.slice(0, -1) : entityType;
      
      breadcrumbItems.push({
        path: currentPath,
        label: `${singularType.charAt(0).toUpperCase() + singularType.slice(1)} ${segment}`,
        icon: routeConfigs[entityType]?.icon || <Building size={16} className="mr-1" />
      });
    } else {
      // Regular path segment
      const config = routeConfigs[segment] || { 
        label: segment.charAt(0).toUpperCase() + segment.slice(1), 
        icon: <Building size={16} className="mr-1" /> 
      };
      
      breadcrumbItems.push({
        path: currentPath,
        label: config.label,
        icon: config.icon
      });
    }
  });

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.path}>
            <BreadcrumbItem>
              {index === breadcrumbItems.length - 1 ? (
                <BreadcrumbPage className="flex items-center">
                  {item.icon}
                  {item.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink 
                  href={item.path}
                  className="flex items-center" 
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.path);
                  }}
                >
                  {item.icon}
                  {item.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default PageBreadcrumb;
