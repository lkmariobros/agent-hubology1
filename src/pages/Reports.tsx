
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Calendar, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell
} from 'recharts';

// Sample data for line chart
const salesData = [
  { name: 'Jan', value: 3200000 },
  { name: 'Feb', value: 4500000 },
  { name: 'Mar', value: 2800000 },
  { name: 'Apr', value: 3900000 },
  { name: 'May', value: 5100000 },
  { name: 'Jun', value: 4700000 },
  { name: 'Jul', value: 6200000 },
  { name: 'Aug', value: 5800000 },
  { name: 'Sep', value: 4300000 },
  { name: 'Oct', value: 3700000 },
  { name: 'Nov', value: 4200000 },
  { name: 'Dec', value: 4900000 },
];

// Sample data for bar chart
const transactionData = [
  { name: 'Jan', completed: 12, pending: 5 },
  { name: 'Feb', completed: 19, pending: 3 },
  { name: 'Mar', completed: 10, pending: 8 },
  { name: 'Apr', completed: 14, pending: 4 },
  { name: 'May', completed: 22, pending: 6 },
  { name: 'Jun', completed: 18, pending: 7 },
];

// Sample data for pie chart
const propertyTypeData = [
  { name: 'Residential', value: 58 },
  { name: 'Commercial', value: 22 },
  { name: 'Industrial', value: 12 },
  { name: 'Land', value: 8 },
];

// Colors for pie chart
const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f97316'];

const Reports = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">
              Analyze your agency's performance with detailed reports.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Calendar size={16} />
              Last 30 Days
            </Button>
            <Button variant="outline" className="gap-2">
              <Download size={16} />
              Export
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="sales">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="agents">Agents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sales" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>
                  Total sales amount per month for the current year
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={salesData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis 
                        tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} 
                      />
                      <Tooltip 
                        formatter={(value) => [`$${(Number(value) / 1000000).toFixed(2)}M`, 'Sales']} 
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        name="Sales" 
                        stroke="#8b5cf6" 
                        activeDot={{ r: 8 }} 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Areas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { area: 'San Francisco, CA', value: 12500000 },
                      { area: 'Palo Alto, CA', value: 9800000 },
                      { area: 'Los Angeles, CA', value: 8500000 },
                      { area: 'San Diego, CA', value: 6200000 },
                      { area: 'Sacramento, CA', value: 4100000 },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="font-medium">{index + 1}.</div>
                          <div>{item.area}</div>
                        </div>
                        <div className="font-bold">
                          ${(item.value / 1000000).toFixed(1)}M
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Sales by Property Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={propertyTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {propertyTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="transactions" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Overview</CardTitle>
                <CardDescription>
                  Number of completed and pending transactions per month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={transactionData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="completed" name="Completed" fill="#8b5cf6" />
                      <Bar dataKey="pending" name="Pending" fill="#e879f9" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="properties" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Properties Overview</CardTitle>
                <CardDescription>
                  Please select specific property metrics to display
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center py-12">
                  <div className="text-center">
                    <Button variant="outline" className="gap-2">
                      <Filter size={16} />
                      Select Metrics
                    </Button>
                    <p className="text-muted-foreground mt-4">
                      No property metrics selected
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="agents" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Agent Performance</CardTitle>
                <CardDescription>
                  Please select specific agent metrics to display
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center py-12">
                  <div className="text-center">
                    <Button variant="outline" className="gap-2">
                      <Filter size={16} />
                      Select Metrics
                    </Button>
                    <p className="text-muted-foreground mt-4">
                      No agent metrics selected
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Reports;
