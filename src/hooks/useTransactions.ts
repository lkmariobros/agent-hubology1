import { useQuery } from 'react-query';
import { Transaction } from '@/types';

const fetchTransactions = async (page: number = 1, pageSize: number = 10) => {
  const response = await fetch(`/api/transactions?page=${page}&pageSize=${pageSize}`);
  if (!response.ok) {
    throw new Error('Failed to fetch transactions');
  }
  return response.json();
};

export const useTransactions = (page: number = 1, pageSize: number = 10) => {
  return useQuery(['transactions', page, pageSize], () => fetchTransactions(page, pageSize));
};

const fetchProperties = async () => {
  const response = await fetch('/api/properties');
  if (!response.ok) {
    throw new Error('Failed to fetch properties');
  }
  return response.json();
};

export const usePropertiesForTransactions = () => {
  return useQuery('propertiesForTransactions', fetchProperties);
};

export const useTransactionOptions = () => {
  const { data: propertiesData, isLoading, error } = usePropertiesForTransactions();

  const propertyOptions = propertiesData?.map((property: any) => ({
    id: property.id,
    title: property.title,
    city: property.city,
    state: property.state
  })) || [];

  return {
    propertyOptions,
    isLoading,
    error,
  };
};
