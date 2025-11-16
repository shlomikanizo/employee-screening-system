/**
 * API Service
 * שירות לתקשורת עם Backend API
 */
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('🚀 API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

/**
 * קבלת טופס לפי ID
 */
export const getForm = async (uniqueId) => {
  try {
    const response = await api.get(`/api/forms/${uniqueId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * שליחת טופס ממולא
 */
export const submitForm = async (formData) => {
  try {
    const response = await api.post('/api/forms/submit', formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * יצירת טופס חדש (למנהל)
 */
export const createForm = async (formData) => {
  try {
    const response = await api.post('/api/forms/', formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * קבלת כל הטפסים
 */
export const getAllForms = async () => {
  try {
    const response = await api.get('/api/forms/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;
