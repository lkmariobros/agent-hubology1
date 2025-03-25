
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Filter } from "lucide-react";
import { PropertyFilterDrawer } from './PropertyFilterDrawer';

interface PropertySearchBarProps {
  onSearch: (query: string) => void;
  showAdvancedFilters?: boolean;
}

export function PropertySearchBar({ onSearch, showAdvancedFilters = true }: PropertySearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleClear = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            placeholder="Search properties..."
            className="pl-11 pr-10 py-2 h-10 bg-neutral-800 border-none rounded-lg w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              type="button" 
              className="absolute right-3 top-1/2 -translate-y-1/2"
              onClick={handleClear}
            >
              <X className="h-4 w-4 text-neutral-400" />
            </button>
          )}
        </div>
        
        <Button type="submit" className="h-10">Search</Button>
        
        {showAdvancedFilters && (
          <PropertyFilterDrawer 
            filters={{}}
            onFiltersChange={() => {}}
            onApplyFilters={() => {}}
            onClearFilters={() => {}}
            trigger={
              <Button variant="outline" size="sm" className="gap-2 h-10">
                <Filter size={16} />
                Filters
              </Button>
            }
          />
        )}
      </div>
    </form>
  );
}
