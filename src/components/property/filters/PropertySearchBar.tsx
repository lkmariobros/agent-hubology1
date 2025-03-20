
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface PropertySearchBarProps {
  onSearch: (query: string) => void;
}

export function PropertySearchBar({ onSearch }: PropertySearchBarProps) {
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
    <form onSubmit={handleSearch} className="relative w-full lg:max-w-md">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
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
    </form>
  );
}
