
// Let's fix the UserRole re-export issue
export * from './property';
export * from './commission';
export * from './opportunity';
export * from './transaction';
export * from './api';

// Re-export UserRole with an alias to avoid ambiguity
import { UserRole as AuthUserRole } from './auth';
export { AuthUserRole as UserRole };
