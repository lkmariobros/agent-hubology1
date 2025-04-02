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
import { Home } from 'lucide-react';

const PageBreadcrumb = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(segment => segment);
  
  // Define routes and their labels
  const routeConfigs: Record<string, { label: string }> = {
    'dashboard': { label: 'Dashboard' },
    'properties': { label: 'Properties' },
    'agents': { label: 'Agents' },
    'transactions': { label: 'Transactions' },
    'commission': { label: 'Commission' },
    'reports': { label: 'Reports' },
    'settings': { label: 'Settings' },
    'admin': { label: 'Admin' },
  };
  
  // Build breadcrumb items based on current path
  const breadcrumbItems: Array<{path: string, label: string, isHome?: boolean}> = [];
  
  // Check if we're in the admin section
  const isAdminRoute = pathSegments.includes('admin');
  
  if (isAdminRoute) {
    // For admin routes, start with Admin instead of Home
    breadcrumbItems.push({
      path: '/admin',
      label: 'Admin'
    });
    
    // Add additional segments after admin
    let currentPath = '/admin';
    const adminIndex = pathSegments.indexOf('admin');
    
    // Add segments after admin
    for (let i = adminIndex + 1; i < pathSegments.length; i++) {
      const segment = pathSegments[i];
      currentPath += `/${segment}`;
      
      // Check if it's a numeric ID
      const isNumericId = !isNaN(Number(segment));
      
      if (isNumericId && i > 0) {
        // If it's an ID, use the previous segment's type
        const entityType = pathSegments[i - 1];
        // Remove trailing 's' if it exists (e.g., properties -> property)
        const singularType = entityType.endsWith('s') ? entityType.slice(0, -1) : entityType;
        
        breadcrumbItems.push({
          path: currentPath,
          label: `${singularType.charAt(0).toUpperCase() + singularType.slice(1)} ${segment}`
        });
      } else {
        // Regular path segment
        const config = routeConfigs[segment] || { 
          label: segment.charAt(0).toUpperCase() + segment.slice(1)
        };
        
        breadcrumbItems.push({
          path: currentPath,
          label: config.label
        });
      }
    }
  } else {
    // Non-admin routes keep the home icon
    breadcrumbItems.push({
      path: '/dashboard',
      label: 'Home',
      isHome: true
    });
    
    // Add additional segments for non-admin routes
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      // Skip the first dashboard segment since it's represented by the home icon
      if (index === 0 && segment === 'dashboard') return;
      
      currentPath += `/${segment}`;
      
      // Check if it's a numeric ID (like in property/1)
      const isNumericId = !isNaN(Number(segment));
      
      if (isNumericId && index > 0) {
        // If it's an ID, use the previous segment's type
        const entityType = pathSegments[index - 1];
        // Remove trailing 's' if it exists (e.g., properties -> property)
        const singularType = entityType.endsWith('s') ? entityType.slice(0, -1) : entityType;
        
        breadcrumbItems.push({
          path: currentPath,
          label: `${singularType.charAt(0).toUpperCase() + singularType.slice(1)} ${segment}`
        });
      } else {
        // Regular path segment
        const config = routeConfigs[segment] || { 
          label: segment.charAt(0).toUpperCase() + segment.slice(1)
        };
        
        breadcrumbItems.push({
          path: currentPath,
          label: config.label
        });
      }
    });
  }

  return (
    <Breadcrumb>
      <BreadcrumbList className="text-sm text-muted-foreground">
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.path}>
            <BreadcrumbItem>
              {index === breadcrumbItems.length - 1 ? (
                <BreadcrumbPage>
                  {item.isHome ? (
                    <span className="sr-only">Home</span>
                  ) : item.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink 
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.path);
                  }}
                >
                  {item.isHome ? (
                    <>
                      <Home size={16} aria-hidden="true" />
                      <span className="sr-only">Home</span>
                    </>
                  ) : item.label}
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
