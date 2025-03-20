
import React from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PropertyRoomsFilterProps {
  bedrooms?: number;
  bathrooms?: number;
  onBedroomChange: (value: number | undefined) => void;
  onBathroomChange: (value: number | undefined) => void;
}

export function PropertyRoomsFilter({
  bedrooms,
  bathrooms,
  onBedroomChange,
  onBathroomChange
}: PropertyRoomsFilterProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div>
        <Label className="mb-2 block">Bedrooms</Label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              {bedrooms || 'Any'}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-full">
            <DropdownMenuItem onClick={() => onBedroomChange(undefined)}>
              Any
            </DropdownMenuItem>
            {[1, 2, 3, 4, 5].map(num => (
              <DropdownMenuItem key={num} onClick={() => onBedroomChange(num)}>
                {num}+
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div>
        <Label className="mb-2 block">Bathrooms</Label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              {bathrooms || 'Any'}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-full">
            <DropdownMenuItem onClick={() => onBathroomChange(undefined)}>
              Any
            </DropdownMenuItem>
            {[1, 2, 3, 4, 5].map(num => (
              <DropdownMenuItem key={num} onClick={() => onBathroomChange(num)}>
                {num}+
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
