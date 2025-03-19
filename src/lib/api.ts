
import { ApiResponse, PaginatedResponse } from '@/types';

const API_URL = 'https://your-api-url.com/api';

// Utility function to handle API requests
async function apiRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any
): Promise<T> {
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
