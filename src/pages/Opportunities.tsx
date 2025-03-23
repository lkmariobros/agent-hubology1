import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  PlusCircle, 
  Briefcase, 
  Target, 
  Flag, 
  Clock, 
  Search,
  Filter,
  ArrowDownUp
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';

// Define opportunity type
interface Opportunity {
  id: string;
  title: string;
  description: string;
  propertyType: 'Residential' | 'Commercial' | 'Industrial' | 'Land';
  budget: string;
  location: string;
  status: 'Urgent' | 'New' | 'Featured' | 'Regular';
  postedBy: string;
  postedAt: string;
}

// Sample opportunities data (expanded version of the one in OpportunitiesBoard)
const sampleOpportunities: Opportunity[] = [
  {
    id: '1',
    title: 'Family looking for 3BR apartment',
    description: 'Family of 4 needs 3-bedroom apartment in central area with good schools nearby.',
    propertyType: 'Residential',
    budget: 'RM450,000 - RM550,000',
    location: 'Kuala Lumpur (KLCC, Bangsar)',
    status: 'Urgent',
    postedBy: 'Sarah Johnson',
    postedAt: '2024-06-01T09:30:00Z'
  },
  {
    id: '2',
    title: 'Retail space for boutique',
    description: 'Fashion designer looking for 800-1000 sq ft retail space in a high foot traffic area.',
    propertyType: 'Commercial',
    budget: 'RM8,000 - RM12,000/mo',
    location: 'Bukit Bintang, Pavilion area',
    status: 'New',
    postedBy: 'Michael Brown',
    postedAt: '2024-06-05T14:15:00Z'
  },
  {
    id: '3',
    title: 'Land for agricultural project',
    description: 'Investor seeking 2-5 acres of agricultural land for sustainable farming project.',
    propertyType: 'Land',
    budget: 'RM1.2M - RM2.5M',
    location: 'Selangor (Rawang, Semenyih)',
    status: 'Featured',
    postedBy: 'John Smith',
    postedAt: '2024-06-03T11:45:00Z'
  },
  {
    id: '4',
    title: 'Small warehouse space',
    description: 'E-commerce business needs 5,000-7,000 sq ft warehouse with loading bay.',
    propertyType: 'Industrial',
    budget: 'RM15,000 - RM20,000/mo',
    location: 'Shah Alam, Klang',
    status: 'Regular',
    postedBy: 'Emily Davis',
    postedAt: '2024-06-02T16:20:00Z'
  },
  {
    id: '5',
    title: 'Luxury condo for expat',
    description: 'Executive relocating to KL seeks high-end condo with city views and facilities.',
    propertyType: 'Residential',
    budget: 'RM1.5M - RM2M',
    location: 'Mont Kiara, Damansara Heights',
    status: 'New',
    postedBy: 'Robert Wilson',
    postedAt: '2024-06-04T10:10:00Z'
  },
  {
    id: '6',
    title: 'Office space for tech startup',
    description: 'Growing tech startup looking for modern office space with flexible layout.',
    propertyType: 'Commercial',
    budget: 'RM12,000 - RM18,000/mo',
    location: 'Bangsar South, KL Sentral',
    status: 'Urgent',
    postedBy: 'Jessica Lee',
    postedAt: '2024-06-01T08:30:00Z'
  },
  {
    id: '7',
    title: 'Bungalow for family of 6',
    description: 'Large family seeking spacious bungalow with garden and swimming pool.',
    propertyType: 'Residential',
    budget: 'RM3.5M - RM5M',
    location: 'Damansara Heights, Kenny Hills',
    status: 'Featured',
    postedBy: 'David Wong',
    postedAt: '2024-06-02T13:20:00Z'
  },
  {
    id: '8',
    title: 'Industrial land for factory',
    description: 'Manufacturing company looking for industrial land to build new factory.',
    propertyType: 'Industrial',
    budget: 'RM5M - RM8M',
    location: 'Port Klang, Shah Alam',
    status: 'Regular',
    postedBy: 'Steven Tan',
    postedAt: '2024-06-03T15:45:00Z'
  }
];

const Opportunities = () => {
  const [activeTab, setActiveTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('newest');

  // Filter opportunities based on selected tab and search query
  const filteredOpportunities = sampleOpportunities
    .filter(opp => {
      // Filter by property type
      if (activeTab !== 'All' && opp.propertyType !== activeTab) {
        return false;
      }
      
      // Filter by search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        return (
          opp.title.toLowerCase().includes(query) ||
          opp.description.toLowerCase().includes(query) ||
          opp.location.toLowerCase().includes(query) ||
          opp.budget.toLowerCase().includes(query)
        );
      }
      
      return true;
    })
    // Sort opportunities
    .sort((a, b) => {
      if (sortOption === 'newest') {
        return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
      } else if (sortOption === 'oldest') {
        return new Date(a.postedAt).getTime() - new Date(b.postedAt).getTime();
      } else if (sortOption === 'urgent') {
        if (a.status === 'Urgent' && b.status !== 'Urgent') return -1;
        if (a.status !== 'Urgent' && b.status === 'Urgent') return 1;
        return 0;
      }
      return 0;
    });

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString('en-MY', { day: 'numeric', month: 'short' });
    }
  };

  // Function to get status badge styles
  const getStatusBadgeStyle = (status: string) => {
    switch(status) {
      case 'Urgent':
        return 'bg-red-500/20 text-red-500 hover:bg-red-500/30';
      case 'New':
        return 'bg-blue-500/20 text-blue-500 hover:bg-blue-500/30';
      case 'Featured':
        return 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30';
      default:
        return 'bg-slate-500/20 text-slate-500 hover:bg-slate-500/30';
    }
  };

  // Get icon based on property type
  const getPropertyTypeIcon = (type: string) => {
    switch(type) {
      case 'Residential':
        return <Target className="h-4 w-4" />;
      case 'Commercial':
        return <Briefcase className="h-4 w-4" />;
      case 'Industrial':
        return <Flag className="h-4 w-4" />;
      case 'Land':
        return <Clock className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Opportunities Board</h1>
          <p className="text-muted-foreground">
            Browse and connect with potential clients looking for properties
          </p>
        </div>
        <Button size="sm" className="gap-1">
          <PlusCircle className="h-4 w-4" />
          New Opportunity
        </Button>
      </div>
      
      {/* Filters and Search */}
      <Card className="glass-card">
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search opportunities..."
              className="pl-8 bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="bg-background">
              <div className="flex items-center gap-2">
                <ArrowDownUp className="h-4 w-4" />
                <span>Sort by</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="urgent">Urgent first</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue="All">
            <SelectTrigger className="bg-background">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filter by status</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All statuses</SelectItem>
              <SelectItem value="Urgent">Urgent</SelectItem>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="Featured">Featured</SelectItem>
              <SelectItem value="Regular">Regular</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      
      {/* Main Content */}
      <Tabs defaultValue="All" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="All">All</TabsTrigger>
          <TabsTrigger value="Residential">Residential</TabsTrigger>
          <TabsTrigger value="Commercial">Commercial</TabsTrigger>
          <TabsTrigger value="Industrial">Industrial</TabsTrigger>
          <TabsTrigger value="Land">Land</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredOpportunities.map((opportunity) => (
              <Card key={opportunity.id} className="overflow-hidden border-border/40 hover:border-border transition-all">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <Badge variant="outline" className={cn("rounded-md flex gap-1 items-center", getStatusBadgeStyle(opportunity.status))}>
                        {opportunity.status}
                      </Badge>
                      <Badge variant="secondary" className="rounded-md flex gap-1 items-center">
                        {getPropertyTypeIcon(opportunity.propertyType)}
                        {opportunity.propertyType}
                      </Badge>
                    </div>
                    
                    <h3 className="font-semibold text-base mb-2">{opportunity.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {opportunity.description}
                    </p>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center text-xs">
                        <span className="font-medium w-20">Budget:</span>
                        <span className="text-muted-foreground">{opportunity.budget}</span>
                      </div>
                      <div className="flex items-center text-xs">
                        <span className="font-medium w-20">Location:</span>
                        <span className="text-muted-foreground">{opportunity.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-border/30 text-xs text-muted-foreground">
                      <span>Posted by: {opportunity.postedBy}</span>
                      <span>{formatDate(opportunity.postedAt)}</span>
                    </div>
                    
                    <Button variant="outline" size="sm" className="w-full mt-3">
                      Contact Agent
                    </Button>
                  </CardContent>
                </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Opportunities;
