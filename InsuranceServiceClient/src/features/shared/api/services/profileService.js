import axiosInstance from '../axios';

/**
 * Profile Service
 * Xử lý các API calls liên quan đến hồ sơ người dùng
 */

const profileService = {
  // Lấy thông tin profile
  getProfile: async () => {
    const response = await axiosInstance.get('/api/profile');
    return response; // Interceptor already returns response.data
  },

  // Cập nhật thông tin profile
  updateProfile: async (profileData) => {
    const response = await axiosInstance.put('/api/profile', profileData);
    return response; // Interceptor already returns response.data
  },

  // Get verification status
  getVerificationStatus: async () => {
    const response = await axiosInstance.get('/api/profile/verification-status');
    return response; // Interceptor already returns response.data
  },

  // Upload avatar
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axiosInstance.post('/api/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response; // Interceptor already returns response.data
  },

  // Xóa avatar
  deleteAvatar: async () => {
    return await axiosInstance.delete('/api/profile/avatar');
  },

  // Cập nhật thông tin liên hệ
  updateContactInfo: async (contactData) => {
    return await axiosInstance.put('/api/profile/contact', contactData);
  },

  // Cập nhật địa chỉ
  updateAddress: async (addressData) => {
    return await axiosInstance.put('/api/profile/address', addressData);
  },

  // Lấy cài đặt thông báo
  getNotificationSettings: async () => {
    return await axiosInstance.get('/api/profile/notifications');
  },

  // Cập nhật cài đặt thông báo
  updateNotificationSettings: async (settings) => {
    return await axiosInstance.put('/api/profile/notifications', settings);
  },

  // Lấy cài đặt bảo mật
  getSecuritySettings: async () => {
    return await axiosInstance.get('/api/profile/security');
  },

  // Bật/tắt two-factor authentication
  toggleTwoFactor: async (enabled) => {
    return await axiosInstance.post('/api/profile/two-factor', { enabled });
  },
};

export { profileService };
export default profileService;
