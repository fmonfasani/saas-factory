import type {
  SaaSData,
  SignupRequest,
  SignupResponse,
  SigninRequest,
  SigninResponse,
  ErrorResponse,
  Organization,
  Project,
  GeneratedSaaSData
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX || '/api';

// Helper function to handle API errors
async function handleApiError(response: Response): Promise<never> {
  let errorMessage = 'An unexpected error occurred';
  
  try {
    const errorData: ErrorResponse = await response.json();
    
    // Handle validation errors
    if (errorData.errors && Array.isArray(errorData.errors)) {
      errorMessage = errorData.errors.map(err => err.msg).join(', ');
    } 
    // Handle single error message
    else if (errorData.error) {
      errorMessage = errorData.error;
    }
  } catch {
    // If response is not JSON, use status text
    errorMessage = response.statusText || errorMessage;
  }
  
  throw new Error(errorMessage);
}

// Helper function to get auth headers
function getAuthHeaders() {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
}

export const api = {
  async getSaasList(): Promise<SaaSData[]> {
    try {
      const response = await fetch(`${API_URL}/api/saas`);
      if (!response.ok) {
        throw new Error('Failed to fetch SaaS list');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching SaaS list:', error);
      throw error;
    }
  },

  async getLatestSaas(): Promise<SaaSData> {
    try {
      const response = await fetch(`${API_URL}/api/saas/latest`);
      if (!response.ok) {
        throw new Error('Failed to fetch latest SaaS');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching latest SaaS:', error);
      throw error;
    }
  },

  async generateLanding(): Promise<{ success: boolean; url?: string }> {
    try {
      const response = await fetch(`${API_URL}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to generate landing page');
      }
      return await response.json();
    } catch (error) {
      console.error('Error generating landing page:', error);
      throw error;
    }
  },
};

// Auth API
export const authApi = {
  async signup(data: SignupRequest): Promise<SignupResponse> {
    try {
      const response = await fetch(`${API_URL}${API_PREFIX}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        await handleApiError(response);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  async signin(data: SigninRequest): Promise<SigninResponse> {
    try {
      const response = await fetch(`${API_URL}${API_PREFIX}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for refresh token
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        await handleApiError(response);
      }
      
      const responseData = await response.json();
      
      // Store access token in localStorage
      if (responseData.accessToken) {
        localStorage.setItem('accessToken', responseData.accessToken);
      }
      
      return responseData;
    } catch (error) {
      console.error('Signin error:', error);
      throw error;
    }
  },

  async signout(): Promise<void> {
    try {
      await fetch(`${API_URL}${API_PREFIX}/auth/signout`, {
        method: 'POST',
        credentials: 'include',
      });
      
      // Clear access token from localStorage
      localStorage.removeItem('accessToken');
    } catch (error) {
      console.error('Signout error:', error);
      throw error;
    }
  },
};

// Organization API
export const organizationApi = {
  async list(): Promise<Organization[]> {
    try {
      const response = await fetch(`${API_URL}${API_PREFIX}/organizations`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        await handleApiError(response);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching organizations:', error);
      throw error;
    }
  },

  async create(data: { name: string }): Promise<Organization> {
    try {
      const response = await fetch(`${API_URL}${API_PREFIX}/organizations`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        await handleApiError(response);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating organization:', error);
      throw error;
    }
  },

  async getById(id: string): Promise<Organization> {
    try {
      const response = await fetch(`${API_URL}${API_PREFIX}/organizations/${id}`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        await handleApiError(response);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching organization:', error);
      throw error;
    }
  },
};

// Project API
export const projectApi = {
  async list(orgId: string): Promise<Project[]> {
    try {
      const response = await fetch(`${API_URL}${API_PREFIX}/organizations/${orgId}/projects`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        await handleApiError(response);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },

  async create(orgId: string, data: Partial<Project>): Promise<Project> {
    try {
      const response = await fetch(`${API_URL}${API_PREFIX}/organizations/${orgId}/projects`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        await handleApiError(response);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },
};

// Generate API
export const generateApi = {
  async analyzePrompt(prompt: string): Promise<{ success: boolean; data?: GeneratedSaaSData; error?: string; jobId?: string }> {
    try {
      const response = await fetch(`${API_URL}${API_PREFIX}/generate/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      return await response.json();
    } catch (error) {
      console.error('Error analyzing prompt:', error);
      return {
        success: false,
        error: 'Failed to analyze prompt',
      };
    }
  },

  async generateLandingPage(saasData: GeneratedSaaSData): Promise<{ success: boolean; html?: string; error?: string; jobId?: string }> {
    try {
      const response = await fetch(`${API_URL}${API_PREFIX}/generate/landing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ saasData }),
      });

      return await response.json();
    } catch (error) {
      console.error('Error generating landing page:', error);
      return {
        success: false,
        error: 'Failed to generate landing page',
      };
    }
  },
};

// Billing API
export const billingApi = {
  async createCheckoutSession(priceId: string): Promise<{ url: string }> {
    try {
      const response = await fetch(`${API_URL}${API_PREFIX}/billing/create-checkout-session`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ priceId }),
      });
      
      if (!response.ok) {
        await handleApiError(response);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  },
  
  async createPortalSession(): Promise<{ url: string }> {
    try {
      const response = await fetch(`${API_URL}${API_PREFIX}/billing/create-portal-session`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        await handleApiError(response);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating portal session:', error);
      throw error;
    }
  },
  
  async getSubscription(): Promise<any> {
    try {
      const response = await fetch(`${API_URL}${API_PREFIX}/billing/subscription`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        await handleApiError(response);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching subscription:', error);
      throw error;
    }
  },
};

export type { SaaSData };