import axiosInstance from '../axios';

/**
 * Authentication Service
 * Xử lý các API calls liên quan đến authentication
 */

// Helper function to determine storage type based on rememberMe
// NOW: Always use localStorage for better UX (persist across tab closes)
const getStorage = (rememberMe) => {
  return localStorage;
};

const authService = {
  // Đăng ký tài khoản mới (chỉ email + password)
  register: async (userData) => {
    return await axiosInstance.post('/api/auth/register', userData);
  },

  // Complete profile sau khi verify email
  completeProfile: async (profileData) => {
    return await axiosInstance.post('/api/auth/complete-profile', profileData);
  },

  // Verify email OTP
  verifyEmailOtp: async (email, otp) => {
    return await axiosInstance.post('/api/auth/verify-otp', { email, otp });
  },

  // Verify email by token (from email link)
  verifyEmail: async (userId, token) => {
    return await axiosInstance.get('/api/auth/verify-email', {
      params: { userId, token }
    });
  },

  // Resend verification email
  resendVerificationEmail: async (email) => {
    return await axiosInstance.post('/api/auth/resend-verification', { email });
  },

  // Send phone OTP
  sendPhoneOtp: async (phoneNumber) => {
    return await axiosInstance.post('/api/auth/phone/send-otp', { phoneNumber });
  },

  // Verify phone OTP
  verifyPhoneOtp: async (phoneNumber, otp) => {
    return await axiosInstance.post('/api/auth/phone/verify-otp', { phoneNumber, otp });
  },

  // Resend phone OTP
  resendPhoneOtp: async (phoneNumber) => {
    return await axiosInstance.post('/api/auth/phone/resend-otp', { phoneNumber });
  },

  // Get phone verification status
  getPhoneStatus: async () => {
    return await axiosInstance.get('/api/auth/phone/status');
  },

  // Đăng nhập với Remember Me support
  login: async (credentials) => {
    // Ensure credentials is an object with email, password, and optional rememberMe
    if (typeof credentials === 'string') {
      throw new Error('Invalid credentials format. Expected object with email and password.');
    }

    try {
      const { email, password, rememberMe = false } = credentials;

      const response = await axiosInstance.post('/api/auth/login', {
        email,
        password,
        rememberMe
      });

      // Backend returns: { accessToken, refreshToken, tokenType, expiresIn, expiresAt }
      // Save tokens based on rememberMe preference
      const storage = getStorage(rememberMe);

      if (response?.accessToken) {
        storage.setItem('accessToken', response.accessToken);

        // Always clear sessionStorage to prevent duplicates
        sessionStorage.removeItem('accessToken');
      }

      if (response?.refreshToken) {
        storage.setItem('refreshToken', response.refreshToken);

        // Always clear sessionStorage to prevent duplicates
        sessionStorage.removeItem('refreshToken');
      }

      // Store rememberMe preference
      storage.setItem('rememberMe', rememberMe.toString());

      console.log(`Tokens saved to ${rememberMe ? 'localStorage' : 'sessionStorage'}`);

      return response;
    } catch (error) {
      console.error('authService.login error:', error);
      throw error;
    }
  },

  // Đăng xuất
  logout: async () => {
    try {
      // Try to get refresh token from both storages
      const refreshToken = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');

      if (refreshToken) {
        await axiosInstance.post('/api/auth/logout', { refreshToken });
      }
    } finally {
      // Clear all auth data from both storages
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('rememberMe');
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      sessionStorage.removeItem('rememberMe');
    }
  },

  // Làm mới access token
  refreshToken: async () => {
    // Try to get refresh token from both storages
    const refreshToken = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
    const response = await axiosInstance.post('/api/auth/refresh', { refreshToken });

    if (response.accessToken) {
      // Save to the same storage where the refresh token is
      const storage = localStorage.getItem('refreshToken') ? localStorage : sessionStorage;
      storage.setItem('accessToken', response.accessToken);

      if (response.refreshToken) {
        storage.setItem('refreshToken', response.refreshToken);
      }
    }

    return response;
  },

  // Lấy thông tin user hiện tại
  getCurrentUser: async () => {
    return await axiosInstance.get('/api/auth/me');
  },

  // Đổi mật khẩu
  changePassword: async (passwordData) => {
    return await axiosInstance.post('/api/auth/change-password', passwordData);
  },

  // Quên mật khẩu
  forgotPassword: async (email) => {
    return await axiosInstance.post('/api/auth/forgot-password', { email });
  },

  // Reset mật khẩu
  resetPassword: async (resetData) => {
    return await axiosInstance.post('/api/auth/reset-password', resetData);
  },

  // Validate reset token
  validateResetToken: async (email, token) => {
    return await axiosInstance.post('/api/auth/validate-reset-token', { email, token });
  },
};

export { authService };
export default authService;
