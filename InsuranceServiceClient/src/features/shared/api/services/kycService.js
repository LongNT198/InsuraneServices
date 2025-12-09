import axiosInstance from '../axios';

/**
 * KYC Service
 * Xử lý các API calls liên quan đến KYC (Know Your Customer)
 */

const kycService = {
  // Lấy thông tin KYC của user
  getKYCStatus: async () => {
    return await axiosInstance.get('/api/kyc/status');
  },

  // Bắt đầu quy trình KYC
  initiateKYC: async (kycData) => {
    return await axiosInstance.post('/api/kyc/initiate', kycData);
  },

  // Upload tài liệu KYC
  uploadKYCDocument: async (documentType, formData) => {
    return await axiosInstance.post(`/api/kyc/documents/${documentType}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Lấy danh sách tài liệu KYC
  getKYCDocuments: async () => {
    return await axiosInstance.get('/api/kyc/documents');
  },

  // Xóa tài liệu KYC
  deleteKYCDocument: async (documentId) => {
    return await axiosInstance.delete(`/api/kyc/documents/${documentId}`);
  },

  // Submit KYC để xét duyệt
  submitKYC: async () => {
    return await axiosInstance.post('/api/kyc/submit');
  },

  // Lấy lịch sử KYC
  getKYCHistory: async () => {
    return await axiosInstance.get('/api/kyc/history');
  },

  // Cập nhật thông tin KYC
  updateKYCInfo: async (kycData) => {
    return await axiosInstance.put('/api/kyc/info', kycData);
  },

  // Verify identity với AI
  verifyIdentity: async (formData) => {
    return await axiosInstance.post('/api/kyc/verify-identity', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default kycService;
