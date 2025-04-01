
/**
 * Format a currency value
 * @param value The numeric value to format
 */
export const formatCurrency = (value: number | string): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numValue);
};

/**
 * Format a date string to a human-readable format
 * @param dateString Date string to format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

/**
 * Generate a shortened version of a UUID
 * @param id UUID to shorten
 */
export const shortenId = (id: string): string => {
  if (!id) return '';
  return id.substring(0, 8);
};
