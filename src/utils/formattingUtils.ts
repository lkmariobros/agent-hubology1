
/**
 * Formats a currency value for display
 * @param amount The amount to format (can be null or undefined)
 * @returns A formatted currency string
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return '$0';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Formats a date string for display
 * @param dateString The date string to format
 * @param formatString The format to apply (defaults to 'MMM dd, yyyy')
 * @returns A formatted date string
 */
export function formatDate(dateString: string | null | undefined, formatString = 'MMM dd, yyyy'): string {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
}
