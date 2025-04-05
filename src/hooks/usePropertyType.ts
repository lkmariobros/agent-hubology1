
import { useState, useEffect } from 'react';
import { usePropertyForm } from '@/context/PropertyFormContext';

export const usePropertyType = () => {
  const { state } = usePropertyForm();
  const { formData } = state;
  const propertyType = formData.propertyType;
  
  // This hook can be expanded to include logic related to property types
  // For example, fetching property type-specific data from an API
  
  return {
    propertyType,
    isResidential: propertyType === 'Residential',
    isCommercial: propertyType === 'Commercial',
    isIndustrial: propertyType === 'Industrial',
    isLand: propertyType === 'Land',
  };
};
