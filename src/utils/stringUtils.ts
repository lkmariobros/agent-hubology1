
/**
 * Utility functions for string manipulation
 */

/**
 * Capitalizes the first letter of a string
 * @param string The input string
 * @returns The string with the first letter capitalized
 */
export function capitalizeFirstLetter(string: string): string {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Converts camelCase or snake_case to Title Case
 * @param string The input string
 * @returns The string in Title Case
 */
export function toTitleCase(string: string): string {
  if (!string) return '';
  
  // Handle camelCase
  const fromCamelCase = string.replace(/([A-Z])/g, ' $1');
  
  // Handle snake_case
  const fromSnakeCase = fromCamelCase.replace(/_/g, ' ');
  
  // Convert to title case
  return fromSnakeCase
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Truncates a string to a specified length and adds ellipsis
 * @param string The input string
 * @param length The maximum length
 * @returns The truncated string
 */
export function truncate(string: string, length: number): string {
  if (!string) return '';
  if (string.length <= length) return string;
  return string.slice(0, length) + '...';
}
