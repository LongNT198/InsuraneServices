import axiosInstance from '../axios';

/**
 * Registration Service
 * Xử lý quy trình đăng ký bảo hiểm
 */

const registrationService = {
  // Bắt đầu quy trình đăng ký
  initiateRegistration: async (data) => {
    return await axiosInstance.post('/api/registration/initiate', data);
  },

  // Xác thực email
  verifyEmail: async (token) => {
    return await axiosInstance.post('/api/registration/verify-email', { token });
  },

  // Gửi lại OTP
  resendOTP: async (email) => {
    return await axiosInstance.post('/api/registration/resend-otp', { email });
  },

  // Xác thực OTP
  verifyOTP: async (email, otp) => {
    return await axiosInstance.post('/api/registration/verify-otp', { email, otp });
  },

  // Hoàn thành đăng ký
  completeRegistration: async (registrationId, data) => {
    return await axiosInstance.post(`/api/registration/${registrationId}/complete`, data);
  },

  // Lấy trạng thái đăng ký
  getRegistrationStatus: async (registrationId) => {
    return await axiosInstance.get(`/api/registration/${registrationId}/status`);
  },

  // Hủy đăng ký
  cancelRegistration: async (registrationId) => {
    return await axiosInstance.delete(`/api/registration/${registrationId}`);
  },
};

export default registrationService;
