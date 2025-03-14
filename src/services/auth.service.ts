
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
}

const AuthService = {
  async login(credentials: LoginCredentials) {
    // Laravel Sanctum requires CSRF token for login
    await api.get('/sanctum/csrf-cookie');
    
    const response = await api.post('/login', credentials);
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async register(data: RegisterData) {
    await api.get('/sanctum/csrf-cookie');
    const response = await api.post('/register', data);
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
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
    const response = await api.get('/user/profile');
    return response.data;
  }
};

export default AuthService;
