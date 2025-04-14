# AI Assistant Guidelines

When working with this Property Agency System codebase, please follow these guidelines:

## General Approach
- Always explore the codebase structure before making changes
- Understand the component hierarchy and data flow
- Respect the existing architecture and patterns
- Make minimal changes to achieve the desired outcome
- Provide explanations for suggested changes

## Current Migration Context
- **Authentication Migration**: The system is transitioning from Supabase Auth to Clerk Auth
- Prioritize fixing authentication flow issues when encountered
- Be aware that some components may still reference the old auth system
- Implement proper error boundaries around auth components

## Before Making Changes
1. Identify the relevant files that need modification
2. Understand how these files interact with the rest of the system
3. Check for existing patterns or solutions in the codebase
4. Consider the impact of changes on both agent and admin portals
5. Look for similar implementations elsewhere in the project

## When Editing Code
- Maintain consistent code style and formatting
- Preserve TypeScript type safety with proper interfaces
- Keep component props interfaces intact
- Follow the project's naming conventions
- Add appropriate comments for complex logic
- Use meaningful variable and function names

## Component Guidelines
- Keep components focused on a single responsibility
- Reuse existing UI components from the Shadcn UI library
- Follow the established component structure:
  ```tsx
  // Component structure pattern
  export interface ComponentProps {
    // Props definition with proper types
  }
  
  export function Component({ prop1, prop2 }: ComponentProps) {
    // Component implementation
    return (/* JSX */);
  }
  ```
- Maintain separation between UI and business logic
- Handle loading and error states consistently

## Authentication & Authorization
- Use the correct auth provider:
  ```tsx
  // For components using Clerk Auth
  import { useAuth } from '@clerk/clerk-react';
  
  // For components using transitional auth
  import { useAuthContext } from '@/context/auth';
  ```
- Always check user roles before showing admin features
- Maintain the separation between agent and admin portals
- Ensure protected routes remain secure
- Add error boundaries around authentication-dependent components
- When fixing auth issues, provide fallback UI for better user experience

## State Management
- Use the established patterns for state management
- Leverage existing context providers when available
- Create custom hooks for reusable stateful logic
- Minimize prop drilling by using context appropriately
- Consider performance implications of context updates

## Error Handling
- Implement proper error boundaries using the project's ErrorBoundary component
- Provide user-friendly error messages
- Handle edge cases and loading states
- Log errors for debugging purposes
- Add strategic console logging during development

## UI and Styling
- Use the project's Tailwind CSS utility classes consistently
- Follow the monochromatic color scheme
- Maintain responsive design principles
- Ensure proper spacing using the established patterns
- Use the theme variables for colors and typography
- Ensure components work in both light and dark modes

## Database Interaction
- Use Supabase client from the services directory
- Follow the established patterns for database queries
- Handle loading and error states for all data fetching
- Implement proper data validation before submission
- Use optimistic updates where appropriate for better UX

## Troubleshooting Common Issues
- For "useAuthContext must be used within an AuthProvider" errors:
  - Check component hierarchy and ensure proper provider wrapping
  - Add error boundaries around the component
- For component structure issues with `asChild` prop:
  - Ensure children are properly handled according to Radix UI patterns
- For black screen rendering issues:
  - Add error boundaries and fallback UI
  - Implement strategic console logging

## Testing Suggestions
- Suggest tests for new functionality
- Consider edge cases and error scenarios
- Test both agent and admin portal functionality
- Verify authentication and authorization
- Test UI components in isolation

## Documentation
- Document complex logic with comments
- Suggest updates to README or documentation
- Explain the purpose and usage of new components
- Document any non-obvious design decisions

## File Structure Compliance
- Place new components in the appropriate directory:
  - UI components in `/components/ui`
  - Layout components in `/components/layout`
  - Common utility components in `/components/common`
- Create new pages in the relevant feature directory
- Add new hooks to `/hooks` directory
- Place utility functions in `/utils` or `/lib` as appropriate

## Performance Considerations
- Memoize expensive calculations and components
- Use virtualization for long lists (react-window or similar)
- Implement proper loading states and skeleton screens
- Consider code splitting for large feature areas
- Monitor render performance and avoid unnecessary re-renders

Following these guidelines will help maintain the quality and consistency of the codebase while successfully navigating the current authentication system migration.