import axios from 'axios'

// Get API URL from environment variable or use proxy in development
// In development, Vite proxy handles /api -> http://localhost:5000
// In production, use the full backend URL
const isDevelopment = import.meta.env.DEV
const API_URL = import.meta.env.VITE_API_URL || (isDevelopment ? '/api' : 'http://localhost:5000/api')

console.log('🌐 API Base URL:', API_URL)
console.log('🔧 Environment:', isDevelopment ? 'Development' : 'Production')

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
