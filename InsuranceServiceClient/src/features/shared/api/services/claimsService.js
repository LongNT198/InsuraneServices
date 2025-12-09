import axiosInstance from '../axios';

/**
 * Claims Service
 * Xử lý các API calls liên quan đến yêu cầu bồi thường
 */

const claimsService = {
  // Lấy danh sách claims của user
  getUserClaims: async (params = {}) => {
    return await axiosInstance.get('/api/claims', { params });
  },

  // Lấy chi tiết claim
  getClaimById: async (claimId) => {
    return await axiosInstance.get(`/api/claims/${claimId}`);
  },

  // Tạo yêu cầu bồi thường mới
  createClaim: async (claimData) => {
    return await axiosInstance.post('/api/claims', claimData);
  },

  // Upload tài liệu cho claim
  uploadClaimDocument: async (claimId, formData) => {
    return await axiosInstance.post(`/api/claims/${claimId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Lấy danh sách tài liệu của claim
  getClaimDocuments: async (claimId) => {
    return await axiosInstance.get(`/api/claims/${claimId}/documents`);
  },

  // Xóa tài liệu
  deleteClaimDocument: async (claimId, documentId) => {
    return await axiosInstance.delete(`/api/claims/${claimId}/documents/${documentId}`);
  },

  // Cập nhật claim
  updateClaim: async (claimId, claimData) => {
    return await axiosInstance.put(`/api/claims/${claimId}`, claimData);
  },

  // Hủy claim
  cancelClaim: async (claimId, reason) => {
    return await axiosInstance.post(`/api/claims/${claimId}/cancel`, { reason });
  },

  // Lấy lịch sử trạng thái của claim
  getClaimHistory: async (claimId) => {
    return await axiosInstance.get(`/api/claims/${claimId}/history`);
  },

  // Gửi comment/message cho claim
  addClaimComment: async (claimId, comment) => {
    return await axiosInstance.post(`/api/claims/${claimId}/comments`, { comment });
  },

  // Lấy danh sách comments
  getClaimComments: async (claimId) => {
    return await axiosInstance.get(`/api/claims/${claimId}/comments`);
  },
};

export default claimsService;
