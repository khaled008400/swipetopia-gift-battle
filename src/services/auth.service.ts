
import api from './api';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  coins: number;
  followers: number;
  following: number;
  roles?: string[];
  shop_name?: string; // Added for seller users
}

// For development mode - simulates successful authentication with admin role
const MOCK_USER: User = {
  id: "mock-user-123",
  username: "admin",
  email: "admin@example.com",
  avatar: "/placeholder.svg",
  coins: 500,
  followers: 120,
  following: 45,
  roles: ["admin"] // Adding the admin role to the mock user
};

// Additional admin user for owner
const OWNER_USER: User = {
  id: "owner-user-456",
  username: "owner",
  email: "admin@flytick.net",
  avatar: "/placeholder.svg",
  coins: 1000,
  followers: 250,
  following: 100,
  roles: ["admin", "owner"] // Owner has additional privileges
};

// Dedicated seller account
const SELLER_USER: User = {
  id: "seller-user-789",
  username: "seller",
  email: "seller@example.com",
  avatar: "/placeholder.svg",
  coins: 750,
  followers: 180,
  following: 65,
  roles: ["seller"],
  shop_name: "Amazing Products"
};

// Check if we're in development mode
const isDevelopment = import.meta.env.DEV;

const AuthService = {
  async login(credentials: LoginCredentials) {
    try {
      // Try real login first
      await api.get('/sanctum/csrf-cookie');
      const response = await api.post('/login', credentials);
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      
      // In development, allow mock login if API is unavailable
      if (isDevelopment) {
        console.warn("Using mock login for development. In production, this would fail.");
        
        // Special case for owner login
        if (credentials.username === 'admin@flytick.net' && credentials.password === '123456') {
          console.log("Owner login detected!");
          const mockResponse = {
            token: "mock-token-for-owner",
            user: OWNER_USER
          };
          
          localStorage.setItem('auth_token', mockResponse.token);
          localStorage.setItem('user', JSON.stringify(mockResponse.user));
          return mockResponse;
        }
        
        // Special case for seller login
        if (credentials.username === 'seller@example.com' && credentials.password === 'seller123') {
          console.log("Seller login detected!");
          const mockResponse = {
            token: "mock-token-for-seller",
            user: SELLER_USER
          };
          
          localStorage.setItem('auth_token', mockResponse.token);
          localStorage.setItem('user', JSON.stringify(mockResponse.user));
          return mockResponse;
        }
        
        // Use admin@example.com/admin for admin login, otherwise regular user
        const isAdminLogin = credentials.username === 'admin@example.com' || credentials.username === 'admin';
        
        const mockResponse = {
          token: "mock-token-for-development",
          user: isAdminLogin ? MOCK_USER : { ...MOCK_USER, username: credentials.username, email: credentials.username, roles: ["user"] }
        };
        
        localStorage.setItem('auth_token', mockResponse.token);
        localStorage.setItem('user', JSON.stringify(mockResponse.user));
        return mockResponse;
      }
      
      throw error;
    }
  },

  async register(data: RegisterData) {
    try {
      await api.get('/sanctum/csrf-cookie');
      const response = await api.post('/register', data);
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      
      // In development, allow mock registration if API is unavailable
      if (isDevelopment) {
        console.warn("Using mock registration for development. In production, this would fail.");
        const mockUser = {
          ...MOCK_USER,
          username: data.username,
          email: data.email
        };
        const mockResponse = {
          token: "mock-token-for-development",
          user: mockUser
        };
        localStorage.setItem('auth_token', mockResponse.token);
        localStorage.setItem('user', JSON.stringify(mockUser));
        return mockResponse;
      }
      
      throw error;
    }
  },

  async logout() {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  async getProfile() {
    try {
      const response = await api.get('/user/profile');
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      
      // In development, return mock profile if API is unavailable
      if (isDevelopment) {
        console.warn("Using mock profile for development. In production, this would fail.");
        return { user: MOCK_USER };
      }
      
      throw error;
    }
  }
};

export default AuthService;
