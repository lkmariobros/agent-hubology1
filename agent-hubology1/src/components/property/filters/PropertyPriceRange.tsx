
import React from 'react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface PropertyPriceRangeProps {
  priceRange: [number, number];
  onPriceChange: (values: [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
}

export function PropertyPriceRange({
  priceRange,
  onPriceChange,
  min = 0,
  max = 10000000,
  step = 100000
}: PropertyPriceRangeProps) {
  const handlePriceChange = (value: number[]) => {
    // Ensure we always have exactly two values for the price range
    const newRange: [number, number] = [
      value[0] || min,
      value[1] || max
    ];
    
    onPriceChange(newRange);
  };

  return (
    <div className="mb-6">
      <Label className="mb-2 block">Price Range</Label>
      <div className="px-2">
        <Slider 
          value={priceRange} 
          min={min} 
          max={max} 
          step={step}
          onValueChange={handlePriceChange}
        />
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span>RM {priceRange[0].toLocaleString()}</span>
          <span>RM {priceRange[1].toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
