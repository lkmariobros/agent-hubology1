
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import StatusBadge from "@/components/admin/commission/StatusBadge";
import { PageContainer, PageHeader, PageTitle, PageSubtitle } from '@/components/layout/PageContainer';
import MetricCard from "@/components/dashboard/MetricCard";
import { DollarSign, Users, BarChart4, Building2 } from "lucide-react";

const StyleGuide = () => {
  const sampleMetric = {
    label: "Total Sales",
    value: "$1,240,000",
    change: 12.5,
    trend: "up" as const,
    icon: <DollarSign className="h-5 w-5 text-property-pink" />
  };

  return (
    <PageContainer>
      <PageHeader>
        <div>
          <PageTitle>Property Pro UI Style Guide</PageTitle>
          <PageSubtitle>
            Reference guide for consistent styling across the application
          </PageSubtitle>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 gap-6">
        {/* Color Palette */}
        <Card>
          <CardHeader>
            <CardTitle>Color Palette</CardTitle>
            <CardDescription>Primary colors used throughout the application</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <div className="h-16 rounded-md bg-[#1a1d25] mb-2"></div>
                <p className="text-xs font-mono">#1a1d25 - Dark Background</p>
              </div>
              <div>
                <div className="h-16 rounded-md bg-[#1e2028] mb-2"></div>
                <p className="text-xs font-mono">#1e2028 - Card Background</p>
              </div>
              <div>
                <div className="h-16 rounded-md bg-[rgba(255,255,255,0.08)] mb-2"></div>
                <p className="text-xs font-mono">rgba(255,255,255,0.08) - Border</p>
              </div>
              <div>
                <div className="h-16 rounded-md bg-emerald-500 mb-2"></div>
                <p className="text-xs font-mono">Emerald 500 - Success</p>
              </div>
              <div>
                <div className="h-16 rounded-md bg-amber-500 mb-2"></div>
                <p className="text-xs font-mono">Amber 500 - Warning</p>
              </div>
              <div>
                <div className="h-16 rounded-md bg-red-500 mb-2"></div>
                <p className="text-xs font-mono">Red 500 - Danger</p>
              </div>
              <div>
                <div className="h-16 rounded-md bg-blue-500 mb-2"></div>
                <p className="text-xs font-mono">Blue 500 - Info</p>
              </div>
              <div>
                <div className="h-16 rounded-md bg-purple-500 mb-2"></div>
                <p className="text-xs font-mono">Purple 500 - Special</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Typography */}
        <Card>
          <CardHeader>
            <CardTitle>Typography</CardTitle>
            <CardDescription>Text styles and headings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold">Heading 1 (text-2xl font-bold)</h1>
              <h2 className="text-xl font-semibold">Heading 2 (text-xl font-semibold)</h2>
              <h3 className="text-lg font-medium">Heading 3 (text-lg font-medium)</h3>
              <h4 className="text-base font-medium">Heading 4 (text-base font-medium)</h4>
              <p className="text-sm text-muted-foreground">Small text with muted color (text-sm text-muted-foreground)</p>
            </div>
          </CardContent>
        </Card>

        {/* Cards */}
        <Card>
          <CardHeader>
            <CardTitle>Cards</CardTitle>
            <CardDescription>Various card styles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Standard Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Standard Card</CardTitle>
                  <CardDescription>A basic card component</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>This is the content of a standard card.</p>
                </CardContent>
                <CardFooter>
                  <Button>Action</Button>
                </CardFooter>
              </Card>
              
              {/* Metric Card */}
              <div>
                <p className="text-sm mb-2">Metric Card:</p>
                <MetricCard metric={sampleMetric} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badges */}
        <Card>
          <CardHeader>
            <CardTitle>Badges & Status Indicators</CardTitle>
            <CardDescription>Various badge styles and status indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="danger">Danger</Badge>
                <Badge variant="info">Info</Badge>
                <Badge variant="active">Active</Badge>
                <Badge variant="inactive">Inactive</Badge>
              </div>
              
              <div className="flex flex-wrap gap-2 pt-4">
                <StatusBadge status="Pending" />
                <StatusBadge status="Under Review" />
                <StatusBadge status="Approved" />
                <StatusBadge status="Ready for Payment" />
                <StatusBadge status="Paid" />
                <StatusBadge status="Rejected" />
                <StatusBadge status="Active" />
                <StatusBadge status="Inactive" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Alerts</CardTitle>
            <CardDescription>Notification and alert components</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTitle>Default Alert</AlertTitle>
              <AlertDescription>This is a default alert to provide information to users.</AlertDescription>
            </Alert>
            
            <Alert variant="destructive">
              <AlertTitle>Destructive Alert</AlertTitle>
              <AlertDescription>This is a destructive alert to warn users about critical actions.</AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Form Elements */}
        <Card>
          <CardHeader>
            <CardTitle>Form Elements</CardTitle>
            <CardDescription>Form components and controls</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" placeholder="Enter your email" />
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="default">Primary Button</Button>
                  <Button variant="outline">Outline Button</Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* CSS Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle>CSS Guidelines</CardTitle>
            <CardDescription>Standards for implementing UI components</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Dark Mode Colors</h3>
                <p className="mb-2">All dark mode components should use these background colors:</p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Main background: <code className="bg-[#161920]/20 px-1 rounded">#161920</code></li>
                  <li>Card background: <code className="bg-[#1a1d25]/20 px-1 rounded">#1a1d25</code></li>
                  <li>Lighter card / secondary: <code className="bg-[#1e2028]/20 px-1 rounded">#1e2028</code></li>
                  <li>Borders: <code className="bg-[rgba(255,255,255,0.08)]/20 px-1 rounded">rgba(255,255,255,0.08)</code></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Text Colors</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Primary text: <code className="bg-white/10 px-1 rounded">text-white</code></li>
                  <li>Secondary text: <code className="bg-white/10 px-1 rounded">text-muted-foreground</code></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Component Standards</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Use consistent padding: <code className="px-1 rounded bg-white/10">p-6</code> for card headers and content</li>
                  <li>Use <code className="px-1 rounded bg-white/10">space-y-4</code> for vertical spacing between elements</li>
                  <li>Use <code className="px-1 rounded bg-white/10">gap-4</code> for grid layouts</li>
                  <li>Border radius should be consistent: <code className="px-1 rounded bg-white/10">rounded-lg</code> for cards and larger elements</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default StyleGuide;
