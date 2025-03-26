
// Format price to display in currency format
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format price with abbreviated units (K, M)
export const formatPrice = (price: number): string => {
  if (price >= 1000000) {
    return (price / 1000000).toFixed(1) + 'M';
  } else if (price >= 1000) {
    return (price / 1000).toFixed(0) + 'K';
  }
  return price.toString();
};

// Calculate stock percentage
export const calculateStockPercentage = (available: number, total: number): number => {
  if (total === 0) return 0;
  return (available / total) * 100;
};

// Get stock status label
export const getStockStatusLabel = (percentage: number): string => {
  if (percentage === 0) return 'Sold Out';
  if (percentage <= 25) return 'Low Stock';
  if (percentage <= 50) return 'Limited';
  if (percentage <= 75) return 'Available';
  return 'Well Stocked';
};

// Get stock status class
export const getStockStatusClass = (percentage: number): string => {
  if (percentage === 0) return 'text-red-500';
  if (percentage <= 25) return 'text-orange-500';
  if (percentage <= 50) return 'text-yellow-500';
  if (percentage <= 75) return 'text-blue-500';
  return 'text-green-500';
};
