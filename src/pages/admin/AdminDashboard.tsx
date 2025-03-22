
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Download, Users, Building, DollarSign, TrendingUp } from 'lucide-react';

// Sample data for the charts
const performanceData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 700 },
  { name: 'Jun', value: 900 },
  { name: 'Jul', value: 1000 },
];

const AdminDashboard = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Overview of system performance and metrics</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Download size={16} />
          Export Report
        </Button>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-muted-foreground mr-2" />
              <span className="text-3xl font-bold">142</span>
              <span className="ml-2 text-xs text-emerald-500">+12% from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Building className="h-5 w-5 text-muted-foreground mr-2" />
              <span className="text-3xl font-bold">2,845</span>
              <span className="ml-2 text-xs text-emerald-500">+8% from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Commission Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-muted-foreground mr-2" />
              <span className="text-3xl font-bold">$1.2M</span>
              <span className="ml-2 text-xs text-red-500">-3% from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-muted-foreground mr-2" />
              <span className="text-3xl font-bold">99.8%</span>
              <span className="ml-2 text-xs text-emerald-500">+0.2% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Performance Overview */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
          <CardDescription>
            System performance metrics for the last 7 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="sales">
            <TabsList>
              <TabsTrigger value="sales">Sales</TabsTrigger>
              <TabsTrigger value="agents">Agents</TabsTrigger>
              <TabsTrigger value="commission">Commission</TabsTrigger>
            </TabsList>
            <TabsContent value="sales" className="pt-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--accent))" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="agents" className="pt-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="commission" className="pt-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#06d6a0" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Recent System Activities */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Recent System Activities</CardTitle>
          <CardDescription>
            Latest activities across the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <table className="clean-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Activity</th>
                <th>User</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#AC5621</td>
                <td>User role updated</td>
                <td>John Doe</td>
                <td>2023-06-12 10:45 AM</td>
                <td><span className="px-2 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-500">Completed</span></td>
              </tr>
              <tr>
                <td>#AC5620</td>
                <td>Commission structure modified</td>
                <td>Admin User</td>
                <td>2023-06-12 09:30 AM</td>
                <td><span className="px-2 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-500">Completed</span></td>
              </tr>
              <tr>
                <td>#AC5619</td>
                <td>System backup</td>
                <td>System</td>
                <td>2023-06-12 02:00 AM</td>
                <td><span className="px-2 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-500">Completed</span></td>
              </tr>
              <tr>
                <td>#AC5618</td>
                <td>New agent onboarded</td>
                <td>Admin User</td>
                <td>2023-06-11 04:15 PM</td>
                <td><span className="px-2 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-500">Completed</span></td>
              </tr>
              <tr>
                <td>#AC5617</td>
                <td>Database maintenance</td>
                <td>System</td>
                <td>2023-06-11 01:30 AM</td>
                <td><span className="px-2 py-1 rounded-full text-xs bg-amber-500/10 text-amber-500">Pending</span></td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
