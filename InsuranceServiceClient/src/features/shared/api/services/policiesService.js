import axiosInstance from '../axios';

/**
 * Policies Service
 * Xử lý các API calls liên quan đến hợp đồng bảo hiểm
 */

const policiesService = {
  // Lấy danh sách hợp đồng của user
  getUserPolicies: async (params = {}) => {
    return await axiosInstance.get('/api/policies', { params });
  },

  // Lấy chi tiết hợp đồng
  getPolicyById: async (policyId) => {
    return await axiosInstance.get(`/api/policies/${policyId}`);
  },

  // Tạo hợp đồng mới
  createPolicy: async (policyData) => {
    return await axiosInstance.post('/api/policies', policyData);
  },

  // Gia hạn hợp đồng
  renewPolicy: async (policyId, renewalData) => {
    return await axiosInstance.post(`/api/policies/${policyId}/renew`, renewalData);
  },

  // Hủy hợp đồng
  cancelPolicy: async (policyId, reason) => {
    return await axiosInstance.post(`/api/policies/${policyId}/cancel`, { reason });
  },

  // Cập nhật thông tin hợp đồng
  updatePolicy: async (policyId, policyData) => {
    return await axiosInstance.put(`/api/policies/${policyId}`, policyData);
  },

  // Lấy lịch sử thanh toán của hợp đồng
  getPolicyPaymentHistory: async (policyId) => {
    return await axiosInstance.get(`/api/policies/${policyId}/payments`);
  },

  // Tải xuống hợp đồng PDF
  downloadPolicy: async (policyId) => {
    return await axiosInstance.get(`/api/policies/${policyId}/download`, {
      responseType: 'blob',
    });
  },

  // Lấy danh sách người thụ hưởng
  getBeneficiaries: async (policyId) => {
    return await axiosInstance.get(`/api/policies/${policyId}/beneficiaries`);
  },

  // Cập nhật người thụ hưởng
  updateBeneficiaries: async (policyId, beneficiaries) => {
    return await axiosInstance.put(`/api/policies/${policyId}/beneficiaries`, beneficiaries);
  },
};

export default policiesService;
