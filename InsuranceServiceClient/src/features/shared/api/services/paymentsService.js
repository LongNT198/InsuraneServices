import axiosInstance from '../axios';

/**
 * Payments Service
 * Xử lý các API calls liên quan đến thanh toán
 */

const paymentsService = {
  // Lấy danh sách giao dịch thanh toán
  getPayments: async (params = {}) => {
    return await axiosInstance.get('/api/payments', { params });
  },

  // Lấy chi tiết giao dịch
  getPaymentById: async (paymentId) => {
    return await axiosInstance.get(`/api/payments/${paymentId}`);
  },

  // Tạo thanh toán mới
  createPayment: async (paymentData) => {
    return await axiosInstance.post('/api/payments', paymentData);
  },

  // Thanh toán phí bảo hiểm
  payPremium: async (policyId, paymentData) => {
    return await axiosInstance.post(`/api/payments/premium/${policyId}`, paymentData);
  },

  // Xác nhận thanh toán
  confirmPayment: async (paymentId, confirmationData) => {
    return await axiosInstance.post(`/api/payments/${paymentId}/confirm`, confirmationData);
  },

  // Hủy thanh toán
  cancelPayment: async (paymentId) => {
    return await axiosInstance.post(`/api/payments/${paymentId}/cancel`);
  },

  // Lấy các phương thức thanh toán
  getPaymentMethods: async () => {
    return await axiosInstance.get('/api/payments/methods');
  },

  // Thêm phương thức thanh toán
  addPaymentMethod: async (methodData) => {
    return await axiosInstance.post('/api/payments/methods', methodData);
  },

  // Xóa phương thức thanh toán
  deletePaymentMethod: async (methodId) => {
    return await axiosInstance.delete(`/api/payments/methods/${methodId}`);
  },

  // Lấy lịch sử giao dịch
  getTransactionHistory: async (params = {}) => {
    return await axiosInstance.get('/api/payments/history', { params });
  },

  // Download hóa đơn
  downloadInvoice: async (paymentId) => {
    return await axiosInstance.get(`/api/payments/${paymentId}/invoice`, {
      responseType: 'blob',
    });
  },

  // Tính toán phí thanh toán
  calculateFees: async (amount, method) => {
    return await axiosInstance.post('/api/payments/calculate-fees', { amount, method });
  },
};

export default paymentsService;
