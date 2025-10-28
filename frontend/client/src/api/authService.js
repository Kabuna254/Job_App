import api from './api';

export const authService = {
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return {
        success: true,
        ...response.data
      };
    } catch (error) {
      console.error('Login error:', error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
        error: error.response?.data
      };
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return {
        success: true,
        ...response.data
      };
    } catch (error) {
      console.error('Registration error:', error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
        error: error.response?.data
      };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  deleteAccount: async () => {
    try {
      const response = await api.delete('/auth/delete');
      if (response.data.success) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      return response.data;
    } catch (error) {
      console.error('Account deletion error:', error);
      return {
        success: false,
        message: 'Failed to delete account'
      };
    }
  }
};