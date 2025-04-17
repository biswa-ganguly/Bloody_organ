import axios from 'axios';
import { setToken, setCurrentUser, clearAuth, getToken, getCurrentUser, isAuthenticated } from './localStorageService';

const API_URL = 'http://localhost:5000/api';

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    
    const { token, user } = response.data;
    if (token && user) {
      setToken(token);
      setCurrentUser(user);
      return user;
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'An error occurred during login');
  }
};

export const register = async (name, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      name,
      email,
      password,
    });
    
    const { token, user } = response.data;
    if (token && user) {
      setToken(token);
      setCurrentUser(user);
      return user;
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'An error occurred during registration');
  }
};

export const logout = () => {
  clearAuth();
};

// Use the functions from localStorageService
export { getCurrentUser, isAuthenticated }; 