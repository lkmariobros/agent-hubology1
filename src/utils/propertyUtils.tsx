
// Function to format currency values
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: 'MYR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

// Function to truncate text with ellipsis
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Function to get property type icon
export const getPropertyTypeIcon = (type: string): JSX.Element => {
  // You can import and use your icons here
  return <></>;
};

// Convert area to standard format
export const formatArea = (area: number, unit: string = 'sq.ft'): string => {
  return `${area.toLocaleString()} ${unit}`;
};
