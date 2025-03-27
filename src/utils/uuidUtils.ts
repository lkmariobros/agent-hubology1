/**
 * UUID utilities for standardizing UUID format and validation
 */

/**
 * Normalizes a UUID string to ensure consistent format
 * Handles UUIDs with or without hyphens
 * @param id The UUID to normalize
 * @returns Normalized UUID with standard format
 */
export const normalizeUuid = (id: string | undefined | null): string | null => {
  if (!id) return null;
  
  // If already in standard format, return as is
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return id.toLowerCase();
  }
  
  // If it's a UUID without hyphens, add them
  if (/^[0-9a-f]{32}$/i.test(id)) {
    return `${id.slice(0, 8)}-${id.slice(8, 12)}-${id.slice(12, 16)}-${id.slice(16, 20)}-${id.slice(20)}`.toLowerCase();
  }
  
  // If it's not a valid UUID format, return as is (validation should catch this elsewhere)
  return id;
};

/**
 * Validates if a string is a properly formatted UUID
 * @param id The UUID to validate
 * @returns boolean indicating if the UUID is valid
 */
export const isValidUuid = (id: string | undefined | null): boolean => {
  if (!id) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
};

/**
 * Creates a mock UUID for development purposes
 * NOT for production use - only for consistent mock data
 * @param seed Optional seed to generate consistent IDs
 * @returns A mock UUID string
 */
export const createMockUuid = (seed?: string): string => {
  // If seed is provided, use it to create a deterministic UUID
  if (seed) {
    // Simple hash function to convert seed to a number
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = ((hash << 5) - hash) + seed.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    
    // Use the hash to create parts of the UUID
    const part1 = Math.abs(hash).toString(16).padStart(8, '0').slice(0, 8);
    const part2 = Math.abs(hash >> 8).toString(16).padStart(4, '0').slice(0, 4);
    const part3 = Math.abs(hash >> 16).toString(16).padStart(4, '0').slice(0, 4);
    const part4 = Math.abs(hash >> 24).toString(16).padStart(4, '0').slice(0, 4);
    const part5 = (Math.abs(hash) ^ Date.now()).toString(16).padStart(12, '0').slice(0, 12);
    
    return `${part1}-${part2}-${part3}-${part4}-${part5}`;
  }
  
  // Otherwise create a random UUID-like string
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};
