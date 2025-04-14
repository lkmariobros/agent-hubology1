# Property Agency System

## Project Overview

This is a comprehensive Property Agency System built using React/TypeScript with a multi-tenant architecture. The system serves internal agents initially but will expand to other agencies. It handles both developer project transactions and individual property transactions with tailored interfaces for each, supported by advanced commission management and approval workflows.

## Technical Stack

| Category | Technology | Version/Notes |
|----------|------------|---------------|
| Frontend | React with Shadcn UI components | React 18+ |
| Framework | Vite | For fast development and optimized builds |
| Language | TypeScript | Strict typing enabled |
| Styling | Tailwind CSS | v4 with custom theme configuration |
| Form Handling | React Hook Form | With Zod schema validation |
| Data Fetching | TanStack Query | v5 with optimistic updates |
| State Management | Context APIs | Custom context providers for auth, theme, etc. |
| Database | PostgreSQL | Hosted on Supabase |
| Backend Functions | Supabase Edge Functions | For serverless API endpoints |
| Authentication | Supabase Auth → Clerk | Currently migrating from Supabase to Clerk |
| Storage | Supabase Storage | For documents and images |
| Deployment | Vercel | With preview deployments for PRs |

## Project Structure

```
agent-hubology1/
├── node_modules/            # Dependencies
├── public/                  # Static assets
│   ├── favicon.ico          # Site favicon
│   ├── logo.svg             # Logo image
│   └── ...                  # Other static assets
├── src/                     # Source code
│   ├── assets/              # Project assets
│   │   ├── images/          # Image assets
│   │   └── styles/          # Global styles
│   ├── components/          # React components
│   │   ├── common/          # Shared components
│   │   │   ├── ErrorBoundary.tsx     # Error handling component
│   │   │   ├── LoadingSpinner.tsx    # Loading indicator
│   │   │   └── ...
│   │   ├── dashboard/       # Dashboard-specific components
│   │   │   ├── ActivityFeed.tsx      # Recent activity component
│   │   │   ├── MetricsCard.tsx       # Metrics display card
│   │   │   ├── PerformanceChart.tsx  # Performance visualization
│   │   │   ├── QuickStats.tsx        # Stats summary component
│   │   │   ├── UpcomingPayments.tsx  # Payment schedule component
│   │   │   └── ...
│   │   ├── layout/          # Layout components
│   │   │   ├── sidebar/     # Sidebar components
│   │   │   │   ├── NavAdmin.tsx      # Admin navigation
│   │   │   │   ├── NavAnalytics.tsx  # Analytics navigation
│   │   │   │   ├── NavMain.tsx       # Main navigation
│   │   │   │   ├── NavPreferences.tsx # Preferences navigation
│   │   │   │   ├── SidebarProfile.tsx # User profile in sidebar
│   │   │   │   └── ...
│   │   │   ├── AppSidebar.tsx        # Main sidebar component
│   │   │   ├── BasicLayout.tsx       # Simple layout wrapper
│   │   │   ├── EnhancedHeader.tsx    # Header with portal switching
│   │   │   ├── MainLayout.tsx        # Main layout wrapper
│   │   │   ├── PageBreadcrumb.tsx    # Breadcrumb navigation
│   │   │   ├── PortalSwitcher.tsx    # Portal switching component
│   │   │   └── ...
│   │   ├── properties/      # Property-related components
│   │   │   ├── PropertyCard.tsx      # Property display card
│   │   │   ├── PropertyForm.tsx      # Property creation/editing form
│   │   │   ├── PropertyList.tsx      # List of properties
│   │   │   └── ...
│   │   ├── transactions/    # Transaction-related components
│   │   │   ├── TransactionForm.tsx   # Transaction form
│   │   │   ├── TransactionList.tsx   # List of transactions
│   │   │   ├── TransactionStatus.tsx # Status indicator
│   │   │   └── ...
│   │   ├── ui/              # UI components (Shadcn UI)
│   │   │   ├── alert.tsx            # Alert component
│   │   │   ├── avatar.tsx           # Avatar component
│   │   │   ├── button.tsx           # Button component
│   │   │   ├── card.tsx             # Card component
│   │   │   ├── dropdown-menu.tsx    # Dropdown menu component
│   │   │   ├── sidebar/             # Sidebar UI components
│   │   │   │   ├── sidebar-context.tsx    # Sidebar state context
│   │   │   │   ├── sidebar-main.tsx       # Main sidebar component
│   │   │   │   ├── sidebar-structure.tsx  # Sidebar structure
│   │   │   │   └── index.tsx              # Sidebar exports
│   │   │   ├── sonner.tsx           # Toast notifications
│   │   │   ├── tabs.tsx             # Tabs component
│   │   │   └── ...                  # Other UI components
│   │   └── ...                # Other component categories
│   ├── context/             # React context providers
│   │   ├── auth/            # Authentication context
│   │   │   ├── AuthContext.tsx      # Auth context definition
│   │   │   └── AuthProvider.tsx     # Auth context provider
│   │   ├── theme/           # Theme context
│   │   │   ├── ThemeContext.tsx     # Theme context definition
│   │   │   └── ThemeProvider.tsx    # Theme context provider
│   │   └── ...              # Other contexts
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.ts              # Authentication hook
│   │   ├── useClerkAuth.ts         # Clerk auth integration hook
│   │   ├── useLocalStorage.ts      # Local storage hook
│   │   ├── useMediaQuery.ts        # Media query hook
│   │   ├── useToast.ts             # Toast notification hook
│   │   └── ...                     # Other custom hooks
│   ├── lib/                 # Utility libraries
│   │   ├── api/             # API utilities
│   │   │   ├── endpoints.ts        # API endpoint definitions
│   │   │   └── requests.ts         # API request helpers
│   │   ├── helpers/         # Helper functions
│   │   │   ├── dateUtils.ts        # Date formatting utilities
│   │   │   ├── formatters.ts       # Data formatting utilities
│   │   │   ├── validators.ts       # Form validation utilities
│   │   │   └── ...
│   │   ├── supabase.ts            # Supabase client
│   │   ├── supabaseWithClerk.ts   # Supabase with Clerk integration
│   │   └── ...                    # Other utility files
│   ├── pages/               # Page components
│   │   ├── admin/           # Admin portal pages
│   │   │   ├── AdminDashboard.tsx   # Admin dashboard page
│   │   │   ├── Agents.tsx           # Agent management page
│   │   │   ├── CommissionApproval.tsx # Commission approval page
│   │   │   ├── Properties.tsx       # Admin properties page
│   │   │   ├── Settings.tsx         # Admin settings page
│   │   │   ├── Transactions.tsx     # Admin transactions page
│   │   │   └── ...                  # Other admin pages
│   │   ├── auth/            # Authentication pages
│   │   │   ├── BasicAuthTest.tsx    # Auth testing page
│   │   │   ├── ClerkJwtTest.tsx     # Clerk JWT test page
│   │   │   ├── JwtTest.tsx          # JWT testing page
│   │   │   ├── ProfileSetup.tsx     # Profile setup page
│   │   │   ├── SignIn.tsx           # Sign in page
│   │   │   ├── SignUp.tsx           # Sign up page
│   │   │   └── ...                  # Other auth pages
│   │   ├── leaderboard/     # Leaderboard pages
│   │   │   ├── Leaderboard.tsx      # Main leaderboard page
│   │   │   ├── Points.tsx           # Points leaderboard
│   │   │   ├── Sales.tsx            # Sales leaderboard
│   │   │   └── ...                  # Other leaderboard pages
│   │   ├── Commission.tsx          # Commission management page
│   │   ├── Dashboard.tsx           # Main dashboard page
│   │   ├── Opportunities.tsx       # Opportunities management page
│   │   ├── Properties.tsx          # Properties management page
│   │   ├── Reports.tsx             # Reports page
│   │   ├── Settings.tsx            # Settings page
│   │   ├── Team.tsx                # Team management page
│   │   ├── Transactions.tsx        # Transactions management page
│   │   └── ...                     # Other pages
│   ├── services/            # Service layer
│   │   ├── api.service.ts          # API service
│   │   ├── auth.service.ts         # Authentication service
│   │   ├── storage.service.ts      # Storage service
│   │   └── ...                     # Other services
│   ├── store/               # State management (if using Redux/Zustand)
│   │   ├── actions/               # Redux actions
│   │   ├── reducers/              # Redux reducers
│   │   ├── slices/                # Redux toolkit slices
│   │   └── index.ts               # Store configuration
│   ├── types/               # TypeScript type definitions
│   │   ├── api.types.ts           # API related types
│   │   ├── auth.types.ts          # Authentication types
│   │   ├── models.types.ts        # Data model types
│   │   ├── ui.types.ts            # UI component types
│   │   └── ...                    # Other type definitions
│   ├── utils/               # Utility functions
│   │   ├── constants.ts           # Application constants
│   │   ├── formatters.ts          # Data formatting utilities
│   │   ├── validators.ts          # Validation utilities
│   │   └── ...                    # Other utilities
│   ├── App.tsx              # Original sign-in page
│   ├── FixedApp.tsx         # Main application with routing
│   ├── index.css            # Global CSS
│   ├── index.tsx            # Entry point
│   ├── routes.tsx           # Route definitions
│   └── vite-env.d.ts        # Vite type definitions
├── .env                     # Environment variables
├── .env.example             # Example environment variables
├── .eslintrc.js             # ESLint configuration
├── .gitignore               # Git ignore file
├── .prettierrc              # Prettier configuration
├── create-test-functions.sql # SQL functions for testing
├── package.json             # Dependencies and scripts
├── README.md                # Project documentation
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite configuration

```

## Authentication System

> **IMPORTANT:** The system is currently transitioning from Supabase Auth to Clerk Auth.

### Authentication Flow

1. User navigates to login page
2. Authentication through Clerk (previously Supabase)
3. JWT token stored and used for subsequent API calls
4. Role information fetched from user_roles table
5. Permission checks performed against role assignments

### Auth Context Structure

```typescript
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  getUserRoles: () => Promise<string[]>;
  hasPermission: (permission: string) => boolean;
}
```

### Migration Notes

- Components using `useSupabaseAuth()` are being updated to use `useClerkAuth()`
- Auth provider hierarchy in FixedApp.tsx is critical for proper context access
- Components should be wrapped in ErrorBoundary to prevent cascade failures
- BasicAuthTest page available at `/basic-auth-test` for verification

## Database Schema

### Core Tables

| Table | Description | Key Fields |
|-------|-------------|------------|
| users | User accounts | id, email, created_at, last_sign_in |
| user_roles | Role assignments | user_id, role_id, assigned_at |
| roles | Available roles | id, name, permissions |
| properties | Property listings | id, title, address, price, status |
| transactions | Property deals | id, property_id, agent_id, client_id, status |
| commissions | Commission records | id, transaction_id, amount, status |
| teams | Team structures | id, leader_id, name, description |
| team_members | Team assignments | team_id, user_id, joined_at |
| agent_tiers | Agent progression levels | id, name, commission_rate, milestone_amount |

### Key Relationships

- User → Roles (many-to-many via user_roles)
- Properties → Transactions (one-to-many)
- Transactions → Commissions (one-to-many)
- Teams → Users (many-to-many via team_members)
- Users → Agent Tiers (one-to-one)

## Core Modules & Components

### 1. Authentication & User Management

#### Login Page
- Dark-themed login form with email/password fields and "Forgot password" option
- OAuth provider integrations (Google, Microsoft)
- Support for magic link authentication

#### User Roles System
- Role-based access control using dedicated `user_roles` table
- Multiple roles per user (Administrator, Team Leader, Finance, etc.)
- Permission-based function access with granular controls
- Role hierarchy with inheritance capabilities

#### Agent Progression System
- Tier-based progression (Junior Agent, Agent, Senior Agent, Associate Director, Director)
- Based on sales milestones ($5M, $15M, $45M, $100M)
- Automatic commission rate adjustments based on tier (70-90%)
- Performance tracking across fiscal periods

#### Profile Management
- Agent specializations tracking with tagging system
- Performance history visualization with time-series charts
- Personal details and contact information management
- Profile completeness indicator with guided setup flow

### 2. Agent Dashboard

#### Sidebar Navigation
- Dashboard (home)
- Properties
- Transactions
- Commission
- Opportunities
- Team (for team leaders)
- Reports
- Settings
- Collapsible with responsive behavior

#### Metrics Cards
- Transaction metrics (count, value, status)
- Commission metrics (earned, pending, projections)
- Listing metrics (active, pending, expired)
- Period comparison (current vs previous)
- Interactive drill-down capabilities

#### Opportunities Board
- Client needs posted by other agents
- Filterable by property type and status
- Status indicators (Urgent, New, Featured)
- Quick action buttons for engagement
- Matching algorithm for property-requirement pairing

#### Recent Activity
- Latest transactions and commissions
- New property listings
- Team activity (for leaders)
- Notification system with read/unread status

### 3. Admin Dashboard

#### Overview Section
- Company-wide KPIs and metrics
- Agent tier distribution visualization
- Top performing agents list
- Recent transactions table
- Upcoming commission payments
- System health monitoring

#### System Management
- Role management interface
- Commission tier configuration
- System settings and preferences
- Logs and monitoring
- User access audit trails
- Data backup and restoration

### 4. Property Management

#### Property Listing Page
- Grid and Map view toggle
- Advanced filtering system
- Sort options (Newest, Price, Size)
- Property cards with featured tags
- Pagination
- Saved searches functionality

#### Property Categories
- Residential (Condos, Landed properties, etc.)
- Commercial (Shops, Offices, etc.)
- Industrial (Factories, Warehouses, etc.)
- Land (Agricultural, Development, etc.)
- Custom category management

#### Property Detail Features
- Category-specific attributes
- Photo gallery with virtual tour capabilities
- Location mapping with nearby amenities
- Price history with market comparison
- Document attachments
- Viewing schedule coordination

### 5. Transaction Management

#### Transaction Form
- Transaction type selection (Individual Property or Developer Project)
- Transaction information (date, status)
- Property details
- Client information
- Commission calculation
- Co-broker information
- Document uploads
- Multi-step wizard interface

#### Transaction Status Tracking
- Pending
- In Progress
- Completed
- Cancelled
- Custom status options with workflow rules

#### Transaction List View
- Filterable by status, date, property type
- Sortable columns
- Quick action buttons
- Bulk operations capabilities
- Export functionality

#### Enhanced Document Management
- Drag and drop file uploads
- Document type categorization
- Document preview and removal
- Validation for file types and sizes
- Version history tracking
- Digital signature integration

### 6. Commission System

#### Commission Calculation
- Support for both percentage-based (sales) and fixed-amount (rental) commissions
- Automated based on agent tier level (70-90% based on rank)
- Upline commission structure visualization
- Manual override capability for administrators
- Co-broking commission splits with adjustable percentages
- Tax calculation and withholding

#### Commission Visualization
- Interactive split visualization showing agency/agent portions
- Complete breakdown cards with formatted currency displays
- Visual representation of commission flow in co-broking scenarios
- Time-series charts for historical performance

#### Commission Tracking
- Monthly, previous month, and year-to-date metrics
- Progress visualization against targets
- Personal vs override commission breakdowns
- Forecasting based on pipeline transactions

#### Commission Approval Workflow
- Streamlined approval process with status progression:
  - Pending → Under Review → Approved → Ready for Payment → Paid
- Dynamic status badge indicators
- Admin review interface with detailed transaction information
- Finance department verification for transactions above threshold
- Comment threading for clarifications

#### Commission Approval Dashboard
- Summary metrics of pending/approved/rejected commissions
- Filterable list view of commissions by status
- Detailed approval review interface
- Approval history and audit logs
- Comments system for discussion during approval process
- Edge functions for approval status updates and metrics
- Batch approval capabilities

#### Commission Splits
- Co-broking scenarios with adjustable splits
- Visual representation of inter-agency splits
- Override commission calculations for team hierarchy
- Template system for common split scenarios

### 7. Team Management

#### Team Leader Dashboard
- Team performance metrics
- Individual agent cards
- Performance comparison charts
- Goal tracking and attainment
- Resource allocation visualization

#### Agent Hierarchy Visualization
- Interactive team structure chart
- Commission flow visualization
- Downline performance tracking
- Organizational change management
- Historical structure comparison

#### Agent Analysis Tools
- Property type strength analysis
- Performance trend charts
- Milestone tracking
- Skill gap identification
- Training recommendation engine

### 8. Reporting System (In Development)

#### Standard Reports
- Sales volume by period
- Commission earnings
- Agent performance
- Property category analysis
- Market trend analysis

#### Custom Report Builder
- Drag-and-drop interface
- Chart selection tools
- Date range filters
- Customizable metrics
- Saved report templates

#### Export Options
- PDF
- CSV
- Excel
- Email scheduling
- Automated distribution lists

## Design System

```css
.theme-mono-scaled {
  --font-sans: var(--font-mono);
  --primary: var(--color-neutral-600);
  --primary-foreground: var(--color-neutral-50);
}
```

- Monochromatic color scheme with neutral tones
- Clean, minimalist interface with consistent spacing
- Light and dark mode support with seamless transitions
- Responsive design optimized for all devices
- Accessible UI components following WCAG 2.1 AA standards
- Component library based on Shadcn UI with custom extensions

## API Endpoints

### Authentication
- `POST /auth/sign-in` - Authenticate user
- `POST /auth/sign-up` - Register new user
- `POST /auth/sign-out` - Log out user
- `GET /auth/user` - Get current user details
- `GET /auth/roles` - Get user roles

### Properties
- `GET /properties` - List properties with filtering
- `GET /properties/:id` - Get property details
- `POST /properties` - Create new property
- `PUT /properties/:id` - Update property
- `DELETE /properties/:id` - Delete property

### Transactions
- `GET /transactions` - List transactions
- `GET /transactions/:id` - Get transaction details
- `POST /transactions` - Create new transaction
- `PUT /transactions/:id` - Update transaction
- `DELETE /transactions/:id` - Delete transaction

### Commissions
- `GET /commissions` - List commissions
- `GET /commissions/:id` - Get commission details
- `POST /commissions` - Create new commission
- `PUT /commissions/:id/status` - Update commission status
- `POST /commissions/:id/approve` - Approve commission

## Privacy & Security Requirements

- Transaction privacy: Agents can see colleagues' transaction details (property, price) but not buyer/co-broker information
- Sensitive information visible only to admin/management
- Role-based access control throughout the application
- Secure authentication flows
- Data encryption for sensitive information
- Edge function security for sensitive operations
- GDPR compliance for EU clients
- Data retention policies for inactive accounts
- Regular security audits and penetration testing

## Implementation Status

### Implemented Components
- Authentication System - With role-based access control
- Agent Dashboard - With metrics, opportunities board, and activity feeds
- Admin Dashboard - With system management tools and overview metrics
- Property Listing - With advanced filtering and grid/map views
- Transaction Management - With multi-step form and document handling
- Commission System - With calculation, visualization, and tracking
- Commission Approval Workflow - With admin interface and status tracking
- Agent Hierarchy Visualization - Team structure with commission override calculations
- Role Management - Administrative interface for managing user roles
- Commission Tier Configuration - Admin interface for managing commission tiers

### Currently Enhancing

#### Agent Portal Dashboard
- Enhanced metrics and KPIs
- Personalized agent experience
- Activity feeds and notifications
- Quick action tools
- Performance forecasting

#### Team Management
- Enhanced team leader dashboard
- Team goal setting and tracking
- Performance comparisons
- Coaching and development tools
- Resource allocation optimization

#### Authentication Migration
- Transitioning from Supabase Auth to Clerk
- Implementing new authentication provider hierarchy
- Adding error boundaries for resilience
- Creating test pages for verification
- Updating protected routes

### Next Implementation Priorities

#### Enhanced Opportunities Board
- Lead management integration
- Agent matching algorithm
- Client requirement analysis
- Collaboration tools
- Automated follow-up system

#### Reporting & Analytics Dashboard
- Customizable reports
- Advanced visualizations
- Export capabilities
- Scheduled report delivery
- Business intelligence integration

#### Property Detail Page Enhancements
- Market analysis integration
- Comparable properties
- Historical data visualization
- Enhanced document management
- Virtual tour capabilities

## Common Issues and Troubleshooting

### Authentication Issues
- Error: "useAuthContext must be used within an AuthProvider"
  - Solution: Ensure components are properly wrapped in AuthProvider
  - Check component hierarchy and provider order

- Error: "JWT token expired"
  - Solution: Implement token refresh mechanism
  - Check client-side token validation timing

### Component Rendering Issues
- Error: "React.Children.only expected to receive a single React element child"
  - Solution: Check components using `asChild` prop
  - Review implementation of Slot component wrapping

- Black screen with no error messages
  - Solution: Add error boundaries around critical components
  - Implement fallback UI components

### Performance Optimization
- Slow initial load time
  - Solution: Implement code splitting
  - Optimize bundle size with tree shaking

- Laggy dashboard interactions
  - Solution: Virtualize large lists and tables
  - Implement memoization for expensive calculations

## Development Guidelines

### Code Style
- Follow ESLint configuration with Prettier integration
- Use TypeScript interfaces for all data structures
- Implement proper error handling with descriptive messages
- Write meaningful component and function documentation

### Testing Strategy
- Unit tests for utility functions and hooks
- Component tests with React Testing Library
- Integration tests for critical user flows
- E2E tests with Cypress for core functionality

### Git Workflow
- Feature branches named as `feature/feature-name`
- Bugfix branches named as `fix/issue-description`
- Pull requests with descriptive titles and linked issues
- Squash merging to maintain clean history

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Supabase account
- Clerk account (for new auth system)

### Installation
```bash
# Clone the repository
git clone [your-repo-url]

# Navigate to the project directory
cd property-agency-system

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start the development server
npm run dev
```

### Environment Variables
```
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Clerk Authentication (new)
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Feature Flags
VITE_USE_CLERK_AUTH=true
VITE_ENABLE_PERFORMANCE_MONITORING=true

# API Configuration
VITE_API_BASE_URL=your_api_base_url
```

## Contributors Guide

Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting pull requests.

## Style Guidelines

- Use monochromatic color scheme consistently
- Maintain clean, minimalist UI
- Ensure proper spacing between elements
- Use Shadcn UI components as foundation
- Implement consistent form styling across the application
- Follow accessibility best practices
- Optimize for both light and dark themes