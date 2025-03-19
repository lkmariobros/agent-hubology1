
import { ApiResponse, PaginatedResponse } from '@/types';

const API_URL = 'https://your-api-url.com/api';

// Flag to indicate if we're in development mode - use mock data
const IS_DEVELOPMENT = true;

// Utility function to handle API requests
async function apiRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any
): Promise<T> {
  try {
    // In development mode with missing API, return mock data directly instead of throwing
    if (IS_DEVELOPMENT && endpoint.startsWith('/dashboard')) {
      console.log(`Development mode: Using mock data for ${endpoint}`);
      
      // Return appropriate mock data based on the endpoint
      if (endpoint === '/dashboard/metrics') {
        return getMockMetrics() as unknown as T;
      } else if (endpoint === '/dashboard/recent-properties') {
        return getMockProperties() as unknown as T;
      } else if (endpoint === '/dashboard/recent-transactions') {
        return getMockTransactions() as unknown as T;
      } else if (endpoint === '/dashboard/opportunities') {
        return getMockOpportunities() as unknown as T;
      }
    }
    
    const token = localStorage.getItem('token');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const config: RequestInit = {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    };
    
    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    if (!response.ok) {
      // Handle different error statuses
      if (response.status === 401) {
        // Handle unauthorized (e.g., redirect to login)
        localStorage.removeItem('token');
        window.location.href = '/login';
        throw new Error('Unauthorized access');
      }
      
      if (response.status === 403) {
        throw new Error('Forbidden: You do not have permission to access this resource');
      }
      
      // Try to parse error response
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || `API request failed with status ${response.status}`
      );
    }
    
    return response.json();
  } catch (error) {
    console.error(`API request error for ${endpoint}:`, error);
    // Re-throw the error so it can be handled by the query hooks
    throw error;
  }
}

// Mock data functions
function getMockMetrics(): ApiResponse<any> {
  return {
    data: {
      metrics: [
        {
          label: 'Total Listings',
          value: '142',
          change: 12.5,
          trend: 'up',
          icon: 'building'
        },
        {
          label: 'Active Agents',
          value: '38',
          change: 4.2,
          trend: 'up',
          icon: 'users'
        },
        {
          label: 'Monthly Revenue',
          value: '$92,428',
          change: -2.8,
          trend: 'down',
          icon: 'dollar'
        },
        {
          label: 'Conversion Rate',
          value: '24.3%',
          change: 6.1,
          trend: 'up',
          icon: 'chart'
        }
      ]
    },
    message: 'Metrics retrieved successfully',
    success: true
  };
}

function getMockProperties(): ApiResponse<any[]> {
  return {
    data: [
      {
        id: '1',
        title: 'Modern Downtown Apartment',
        description: 'Luxurious apartment in downtown with excellent amenities.',
        price: 425000,
        address: {
          street: '123 Main St',
          city: 'San Francisco',
          state: 'CA',
          zip: '94102',
          country: 'USA'
        },
        type: 'residential',
        subtype: 'apartment',
        features: ['balcony', 'parking', 'pool'],
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        images: ['https://picsum.photos/id/1068/800/600'],
        status: 'available',
        listedBy: 'agent123',
        createdAt: '2024-01-15T12:00:00Z',
        updatedAt: '2024-01-15T12:00:00Z'
      },
      {
        id: '2',
        title: 'Suburban Family Home',
        description: 'Spacious family home with large backyard in quiet neighborhood.',
        price: 750000,
        address: {
          street: '456 Oak Ave',
          city: 'Palo Alto',
          state: 'CA',
          zip: '94301',
          country: 'USA'
        },
        type: 'residential',
        subtype: 'house',
        features: ['backyard', 'garage', 'renovated kitchen'],
        bedrooms: 4,
        bathrooms: 3,
        area: 2500,
        images: ['https://picsum.photos/id/164/800/600'],
        status: 'pending',
        listedBy: 'agent456',
        createdAt: '2024-01-10T09:30:00Z',
        updatedAt: '2024-02-05T14:15:00Z'
      },
      {
        id: '3',
        title: 'Commercial Office Space',
        description: 'Prime location commercial office in the business district.',
        price: 1200000,
        address: {
          street: '789 Market St',
          city: 'San Francisco',
          state: 'CA',
          zip: '94103',
          country: 'USA'
        },
        type: 'commercial',
        subtype: 'office',
        features: ['reception', 'conference rooms', 'parking'],
        area: 3500,
        images: ['https://picsum.photos/id/260/800/600'],
        status: 'available',
        listedBy: 'agent789',
        createdAt: '2024-01-20T11:45:00Z',
        updatedAt: '2024-01-20T11:45:00Z'
      }
    ],
    message: 'Recent properties retrieved successfully',
    success: true
  };
}

function getMockTransactions(): ApiResponse<any[]> {
  return {
    data: [
      {
        id: '1',
        propertyId: '2',
        agentId: 'agent456',
        buyerId: 'buyer123',
        sellerId: 'seller123',
        commission: 22500,
        status: 'completed',
        date: '2024-02-15T10:30:00Z'
      },
      {
        id: '2',
        propertyId: '4',
        agentId: 'agent789',
        commission: 15000,
        status: 'pending',
        date: '2024-03-01T15:45:00Z'
      },
      {
        id: '3',
        propertyId: '5',
        agentId: 'agent123',
        buyerId: 'buyer456',
        sellerId: 'seller456',
        commission: 30000,
        status: 'completed',
        date: '2024-02-28T09:15:00Z'
      }
    ],
    message: 'Recent transactions retrieved successfully',
    success: true
  };
}

function getMockOpportunities(): ApiResponse<any[]> {
  return {
    data: [
      {
        id: '1',
        title: 'Family looking for 3BR apartment',
        description: 'Family of 4 needs 3-bedroom apartment in central area with good schools nearby.',
        propertyType: 'Residential',
        budget: 'RM450,000 - RM550,000',
        location: 'Kuala Lumpur (KLCC, Bangsar)',
        status: 'Urgent',
        postedBy: 'Sarah Johnson',
        postedAt: '2024-06-01T09:30:00Z'
      },
      {
        id: '2',
        title: 'Retail space for boutique',
        description: 'Fashion designer looking for 800-1000 sq ft retail space in a high foot traffic area.',
        propertyType: 'Commercial',
        budget: 'RM8,000 - RM12,000/mo',
        location: 'Bukit Bintang, Pavilion area',
        status: 'New',
        postedBy: 'Michael Brown',
        postedAt: '2024-06-05T14:15:00Z'
      },
      {
        id: '3',
        title: 'Land for agricultural project',
        description: 'Investor seeking 2-5 acres of agricultural land for sustainable farming project.',
        propertyType: 'Land',
        budget: 'RM1.2M - RM2.5M',
        location: 'Selangor (Rawang, Semenyih)',
        status: 'Featured',
        postedBy: 'John Smith',
        postedAt: '2024-06-03T11:45:00Z'
      }
    ],
    message: 'Opportunities retrieved successfully',
    success: true
  };
}

// Auth API functions
export const authApi = {
  login: async (email: string, password: string) => {
    return apiRequest<ApiResponse<{ user: any; token: string }>>('/auth/login', 'POST', { email, password });
  },
  
  register: async (userData: any) => {
    return apiRequest<ApiResponse<{ user: any; token: string }>>('/auth/register', 'POST', userData);
  },
  
  logout: async () => {
    localStorage.removeItem('token');
    return { success: true };
  },
  
  getProfile: async () => {
    return apiRequest<ApiResponse<any>>('/auth/profile');
  }
};

// Properties API functions
export const propertiesApi = {
  getAll: async (page = 1, pageSize = 10, filters = {}) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...filters
    }).toString();
    
    return apiRequest<PaginatedResponse<any>>(`/properties?${queryParams}`);
  },
  
  getById: async (id: string) => {
    return apiRequest<ApiResponse<any>>(`/properties/${id}`);
  },
  
  create: async (propertyData: any) => {
    return apiRequest<ApiResponse<any>>('/properties', 'POST', propertyData);
  },
  
  update: async (id: string, propertyData: any) => {
    return apiRequest<ApiResponse<any>>(`/properties/${id}`, 'PUT', propertyData);
  },
  
  delete: async (id: string) => {
    return apiRequest<ApiResponse<null>>(`/properties/${id}`, 'DELETE');
  }
};

// Transactions API functions
export const transactionsApi = {
  getAll: async (page = 1, pageSize = 10, filters = {}) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...filters
    }).toString();
    
    return apiRequest<PaginatedResponse<any>>(`/transactions?${queryParams}`);
  },
  
  getById: async (id: string) => {
    return apiRequest<ApiResponse<any>>(`/transactions/${id}`);
  },
  
  create: async (transactionData: any) => {
    return apiRequest<ApiResponse<any>>('/transactions', 'POST', transactionData);
  },
  
  update: async (id: string, transactionData: any) => {
    return apiRequest<ApiResponse<any>>(`/transactions/${id}`, 'PUT', transactionData);
  },
  
  delete: async (id: string) => {
    return apiRequest<ApiResponse<null>>(`/transactions/${id}`, 'DELETE');
  }
};

// Commission API functions
export const commissionApi = {
  getSummary: async () => {
    return apiRequest<ApiResponse<any>>('/commissions/summary');
  },
  
  getHistory: async (page = 1, pageSize = 10) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString()
    }).toString();
    
    return apiRequest<PaginatedResponse<any>>(`/commissions/history?${queryParams}`);
  },
  
  getTiers: async () => {
    return apiRequest<ApiResponse<any[]>>('/commissions/tiers');
  }
};

// Team API functions
export const teamApi = {
  getMembers: async (page = 1, pageSize = 10) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString()
    }).toString();
    
    return apiRequest<PaginatedResponse<any>>(`/team/members?${queryParams}`);
  },
  
  getMemberById: async (id: string) => {
    return apiRequest<ApiResponse<any>>(`/team/members/${id}`);
  },
  
  updateMember: async (id: string, memberData: any) => {
    return apiRequest<ApiResponse<any>>(`/team/members/${id}`, 'PUT', memberData);
  }
};

// Dashboard API functions
export const dashboardApi = {
  getMetrics: async () => {
    return apiRequest<ApiResponse<any>>('/dashboard/metrics');
  },
  
  getRecentTransactions: async (limit = 5) => {
    return apiRequest<ApiResponse<any[]>>(`/dashboard/recent-transactions?limit=${limit}`);
  },
  
  getRecentProperties: async (limit = 5) => {
    return apiRequest<ApiResponse<any[]>>(`/dashboard/recent-properties?limit=${limit}`);
  },
  
  getOpportunities: async () => {
    return apiRequest<ApiResponse<any[]>>('/dashboard/opportunities');
  }
};
