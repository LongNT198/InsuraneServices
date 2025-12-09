import axiosInstance from '../axios';

/**
 * Loans Service
 * Xử lý các API calls liên quan đến vay theo hợp đồng bảo hiểm
 */

const loansService = {
  // Lấy danh sách khoản vay
  getUserLoans: async (params = {}) => {
    return await axiosInstance.get('/api/loans', { params });
  },

  // Lấy chi tiết khoản vay
  getLoanById: async (loanId) => {
    return await axiosInstance.get(`/api/loans/${loanId}`);
  },

  // Kiểm tra điều kiện vay
  checkLoanEligibility: async (policyId) => {
    return await axiosInstance.get(`/api/loans/eligibility/${policyId}`);
  },

  // Tạo yêu cầu vay mới
  createLoanRequest: async (loanData) => {
    return await axiosInstance.post('/api/loans', loanData);
  },

  // Tính toán số tiền có thể vay
  calculateLoanAmount: async (policyId) => {
    return await axiosInstance.get(`/api/loans/calculate/${policyId}`);
  },

  // Thanh toán khoản vay
  makePayment: async (loanId, paymentData) => {
    return await axiosInstance.post(`/api/loans/${loanId}/payment`, paymentData);
  },

  // Lấy lịch sử thanh toán
  getPaymentHistory: async (loanId) => {
    return await axiosInstance.get(`/api/loans/${loanId}/payments`);
  },

  // Thanh toán sớm toàn bộ
  earlySettlement: async (loanId) => {
    return await axiosInstance.post(`/api/loans/${loanId}/early-settlement`);
  },

  // Lấy lịch trả nợ
  getRepaymentSchedule: async (loanId) => {
    return await axiosInstance.get(`/api/loans/${loanId}/schedule`);
  },

  // Hủy yêu cầu vay
  cancelLoanRequest: async (loanId) => {
    return await axiosInstance.delete(`/api/loans/${loanId}`);
  },
};

export default loansService;
