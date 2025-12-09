import axios from 'axios';

// Import axios directly for refresh token call (avoid interceptor loop)
const directAxios = axios.create();

// Helper to get token from both storages
const getToken = () => {
  return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
};

// Helper to clear all auth data from both storages
const clearAuthData = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('rememberMe');
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('refreshToken');
  sessionStorage.removeItem('rememberMe');
};

// Tạo axios instance với cấu hình mặc định
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5088',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Tự động thêm token vào header
axiosInstance.interceptors.request.use(
  (config) => {
    // Lấy token từ cả localStorage và sessionStorage
    const token = getToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  }
);

// Response interceptor - Xử lý response và error
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Xử lý các loại lỗi khác nhau
    if (error.response) {
      // Server trả về response với status code lỗi
      const { status, data } = error.response;
      
      console.error('❌ Response Error:', {
        status,
        message: data?.message || error.message,
        errors: data?.errors || null,
        details: data,
        url: error.config?.url,
      });
      
      // Xử lý các trường hợp lỗi cụ thể
      switch (status) {
        case 401:
          // Try to refresh token if not already retried
          if (!originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
              const refreshToken = localStorage.getItem('refreshToken') || 
                                 sessionStorage.getItem('refreshToken');
              
              if (refreshToken && !originalRequest.url?.includes('/auth/refresh')) {
                console.log('🔄 Attempting to refresh token...');
                
                // Call refresh endpoint directly (avoid interceptor loop)
                const response = await directAxios.post(
                  `${import.meta.env.VITE_API_URL || 'http://localhost:5088'}/api/auth/refresh`,
                  { refreshToken },
                  { headers: { 'Content-Type': 'application/json' } }
                );
                
                const { accessToken, refreshToken: newRefreshToken } = response.data;
                const storage = localStorage.getItem('refreshToken') ? localStorage : sessionStorage;
                
                storage.setItem('accessToken', accessToken);
                if (newRefreshToken) {
                  storage.setItem('refreshToken', newRefreshToken);
                }
                
                console.log('✅ Token refreshed successfully');
                
                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return axiosInstance(originalRequest);
              }
            } catch (refreshError) {
              console.error('❌ Token refresh failed:', refreshError);
              // Fall through to logout
            }
          }
          
          // Unauthorized - Token hết hạn hoặc không hợp lệ
          console.warn('🔒 Unauthorized - Clearing auth data');
          clearAuthData();
          
          // Chỉ redirect nếu không phải đang ở trang login
          if (window.location.pathname !== '/login' && 
              window.location.pathname !== '/register' &&
              window.location.pathname !== '/forgot-password' &&
              !window.location.pathname.includes('/reset-password') &&
              window.location.pathname !== '/admin/login') {
            const isAdminRoute = window.location.pathname.startsWith('/admin');
            window.location.href = isAdminRoute ? '/admin/login' : '/login';
          }
          break;
          
        case 403:
          // Forbidden - Không có quyền truy cập
          console.error('Access denied');
          break;
          
        case 404:
          // Not Found
          console.error('Resource not found');
          break;
          
        case 500:
          // Internal Server Error
          console.error('Server error');
          break;
          
        default:
          break;
      }
      
      // Normalize validation errors: server may return `errors` or `validationErrors`
      const validationErrors = data?.errors || data?.validationErrors || data?.validationErrors || data?.ValidationErrors || {};
      // Trả về error message từ server hoặc message mặc định
      return Promise.reject({
        status,
        message: data?.message || data?.title || 'An error occurred',
        errors: validationErrors,
        validationErrors: validationErrors,
        data: data,
      });
    } else if (error.request) {
      // Request được gửi nhưng không nhận được response
      console.error('❌ No Response:', error.message);
      return Promise.reject({
        status: 0,
        message: 'No response from server. Please check your connection.',
      });
    } else {
      // Lỗi khi setup request
      console.error('❌ Request Setup Error:', error.message);
      return Promise.reject({
        status: 0,
        message: error.message,
      });
    }
  }
);

export default axiosInstance;
