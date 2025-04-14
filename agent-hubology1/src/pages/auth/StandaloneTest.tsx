import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from '@/components/ui/button';

// This is a completely standalone component that doesn't use any routing or authentication
const StandaloneTest: React.FC = () => {
  useEffect(() => {
    // Clear all localStorage on mount
    localStorage.clear();
    console.log('All localStorage cleared');
    
    // Log all localStorage items
    console.log('Current localStorage:', { ...localStorage });
  }, []);

  const clearAndRedirect = (path: string) => {
    localStorage.clear();
    window.location.href = path;
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0f172a',
      padding: '1rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '28rem',
        backgroundColor: '#1e293b',
        borderRadius: '0.5rem',
        overflow: 'hidden',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        color: 'white'
      }}>
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #2d3748'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem'
          }}>Standalone Test Page</h2>
          <p style={{
            color: '#a0aec0',
            fontSize: '0.875rem'
          }}>
            This page bypasses all routing and authentication
          </p>
        </div>
        
        <div style={{
          padding: '1.5rem',
        }}>
          <p style={{
            marginBottom: '1.5rem',
            color: '#e2e8f0'
          }}>
            This is a completely standalone page that doesn't use React Router or any authentication providers.
            All localStorage has been cleared on page load.
          </p>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <button
              onClick={() => clearAndRedirect('/profile/setup')}
              style={{
                backgroundColor: '#8b5cf6',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'background-color 0.2s',
                width: '100%'
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#7c3aed')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#8b5cf6')}
            >
              Go to Profile Setup (Clear Storage)
            </button>
            
            <button
              onClick={() => clearAndRedirect('/jwt-test')}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'background-color 0.2s',
                width: '100%'
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#3b82f6')}
            >
              Go to JWT Test (Clear Storage)
            </button>
            
            <button
              onClick={() => clearAndRedirect('/sign-in')}
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'background-color 0.2s',
                width: '100%'
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#059669')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#10b981')}
            >
              Go to Sign In (Clear Storage)
            </button>
            
            <button
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                document.cookie.split(";").forEach(function(c) {
                  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                });
                alert('All storage cleared!');
              }}
              style={{
                backgroundColor: '#ef4444',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'background-color 0.2s',
                width: '100%'
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#dc2626')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#ef4444')}
            >
              Clear All Storage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Create a standalone HTML file
const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Standalone Test</title>
  <style>
    body, html {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
    * {
      box-sizing: border-box;
    }
  </style>
</head>
<body>
  <div id="standalone-root"></div>
</body>
</html>
`;

// Export a function to render this component directly to a new window
export const openStandaloneTest = () => {
  const newWindow = window.open('', '_blank');
  if (newWindow) {
    newWindow.document.write(html);
    newWindow.document.close();
    
    const container = newWindow.document.getElementById('standalone-root');
    if (container) {
      const root = createRoot(container);
      root.render(<StandaloneTest />);
    }
  }
};

export default StandaloneTest;
