import axiosInstance from "../axios";

/**
 * Admin Service
 * Xử lý các API calls liên quan đến Admin Panel
 */

const adminService = {
  // ============ Users Management ============

  // Lấy danh sách tất cả users
  getAllUsers: async (params = {}) => {
    return await axiosInstance.get("/api/admin/users", { params });
  },

  // Lấy chi tiết user theo ID
  getUserById: async (userId) => {
    return await axiosInstance.get(`/api/admin/users/${userId}`);
  },

  // Tạo user mới
  createUser: async (userData) => {
    return await axiosInstance.post("/api/admin/users", userData);
  },

  // Cập nhật thông tin user
  updateUser: async (userId, userData) => {
    return await axiosInstance.put(`/api/admin/users/${userId}`, userData);
  },

  // Xóa user
  deleteUser: async (userId) => {
    return await axiosInstance.delete(`/api/admin/users/${userId}`);
  },

  // Gán role cho user
  assignRole: async (userId, role) => {
    return await axiosInstance.post(`/api/admin/users/${userId}/roles/${role}`);
  },

  // Gỡ role từ user
  removeRole: async (userId, role) => {
    return await axiosInstance.delete(
      `/api/admin/users/${userId}/roles/${role}`
    );
  },

  // Khóa tài khoản user
  lockUser: async (userId) => {
    try {
      const response = await axiosInstance.post(`/api/admin/users/${userId}/lock`);
      return response;
    } catch (error) {
      console.error('Lock user error:', error);
      throw error;
    }
  },

  // Mở khóa tài khoản user
  unlockUser: async (userId) => {
    try {
      const response = await axiosInstance.post(`/api/admin/users/${userId}/unlock`);
      return response;
    } catch (error) {
      console.error('Unlock user error:', error);
      throw error;
    }
  },

  // Lấy thống kê users
  getUserStats: async () => {
    return await axiosInstance.get("/api/admin/users/admin/stats");
  },

  // ============ Policies Management ============

  // Lấy danh sách tất cả policies
  getAllPolicies: async (params = {}) => {
    return await axiosInstance.get("/api/policies/admin/all", { params });
  },

  // Lấy chi tiết policy
  getPolicyById: async (policyId) => {
    return await axiosInstance.get(`/api/policies/${policyId}`);
  },

  // Admin: tạo chính sách cho user (accepts CustomerProfileId or UserId)
  adminCreatePolicy: async (policyData) => {
    return await axiosInstance.post("/api/admin/policies", policyData);
  },

  // Cập nhật policy
  updatePolicy: async (policyId, policyData) => {
    return await axiosInstance.put(`/api/policies/${policyId}`, policyData);
  },

  // Xóa policy
  deletePolicy: async (policyId) => {
    return await axiosInstance.delete(`/api/policies/${policyId}`);
  },

  // Phê duyệt policy
  approvePolicy: async (policyId, approvalData) => {
    return await axiosInstance.post(
      `/api/policies/${policyId}/approve`,
      approvalData
    );
  },

  // Từ chối policy
  rejectPolicy: async (policyId, rejectionData) => {
    return await axiosInstance.post(
      `/api/policies/${policyId}/reject`,
      rejectionData
    );
  },

  // Lấy thống kê policies - fallback to all policies count
  getPolicyStats: async () => {
    const response = await axiosInstance.get("/api/policies");
    return { data: { totalPolicies: response.data?.length || 0 } };
  },

  // Lấy danh sách sản phẩm (Admin / public)
  getProducts: async () => {
    return await axiosInstance.get("/api/admin/products");
  },

  // ============ Claims Management ============

  // Lấy danh sách yêu cầu bồi thường
  getAllClaims: async (params = {}) => {
    return await axiosInstance.get("/api/claims/admin/all", { params });
  },

  // Lấy chi tiết claim
  getClaimById: async (claimId) => {
    return await axiosInstance.get(`/api/claims/${claimId}`);
  },

  // Cập nhật trạng thái claim
  updateClaimStatus: async (claimId, statusData) => {
    return await axiosInstance.put(`/api/claims/${claimId}/status`, statusData);
  },

  // Phê duyệt claim
  approveClaim: async (claimId, approvalData = {}) => {
    return await axiosInstance.put(`/api/claims/${claimId}/status`, {
      Status: "Approved",
      ...approvalData,
    });
  },

  // Từ chối claim
  rejectClaim: async (claimId, rejectionData) => {
    return await axiosInstance.put(`/api/claims/${claimId}/status`, {
      Status: "Rejected",
      ...rejectionData,
    });
  },

  // Lấy thống kê claims
  getClaimStats: async () => {
    const response = await axiosInstance.get("/api/claims");
    return { data: { totalClaims: response.data?.length || 0 } };
  },

  // ============ Payments Management ============

  // Lấy danh sách giao dịch
  getAllPayments: async (params = {}) => {
    return await axiosInstance.get("/api/payments/admin/all", { params });
  },

  // ============ Applications Management ============

  // Lấy danh sách đơn đăng ký (Applications)
  getRegistrationSessions: async (params = {}) => {
    // axios interceptor already extracts response.data
    return await axiosInstance.get("/api/admin/applications", { params });
  },

  // Lấy chi tiết đơn đăng ký
  getRegistrationSessionById: async (sessionId) => {
    return await axiosInstance.get(`/api/admin/applications/${sessionId}`);
  },

  // Phê duyệt đơn đăng ký
  approveApplication: async (sessionId, approvalData = {}) => {
    return await axiosInstance.post(
      `/api/admin/applications/${sessionId}/approve`,
      approvalData
    );
  },

  // Từ chối đơn đăng ký
  rejectApplication: async (sessionId, rejectionData = {}) => {
    return await axiosInstance.post(
      `/api/admin/applications/${sessionId}/reject`,
      rejectionData
    );
  },

  // Cập nhật trạng thái đơn đăng ký
  updateApplicationStatus: async (sessionId, statusData = {}) => {
    return await axiosInstance.put(
      `/api/admin/applications/${sessionId}`,
      statusData
    );
  },

  // ============ Payments Management ============

  // Lấy danh sách giao dịch
  getAllPayments: async (params = {}) => {
    return await axiosInstance.get("/api/payments/admin/all", { params });
  },
  confirmPayment: async (paymentId, data = {}) => {
    return await axiosInstance.post(`/api/payments/${paymentId}/confirm`, data);
  },

  // Hoàn tiền
  refundPayment: async (paymentId, data) => {
    return await axiosInstance.post(`/api/payments/${paymentId}/refund`, data);
  },

  // Lấy thống kê payments
  getPaymentStats: async () => {
    const response = await axiosInstance.get("/api/payments/admin/all");
    return { data: { totalPayments: response.data?.payments?.length || 0 } };
  },

  // ============ Agents Management ============

  // Lấy danh sách đại lý
  getAllAgents: async (params = {}) => {
    // Since there's no agents endpoint, return mock data
    return { data: [] };
  },

  // Lấy chi tiết đại lý
  getAgentById: async (agentId) => {
    return { data: null };
  },

  // Cập nhật thông tin đại lý
  updateAgent: async (agentId, agentData) => {
    return { data: {} };
  },

  // Lấy thống kê agents
  getAgentStats: async () => {
    return { data: { totalAgents: 0, activeAgents: 0 } };
  },

  // ============ Analytics & Reports ============

  // Lấy dữ liệu dashboard
  getDashboardData: async (params = {}) => {
    try {
      const users = await axiosInstance
        .get("/api/admin/users")
        .catch(() => ({ data: [] }));
      const policies = await axiosInstance
        .get("/api/policies")
        .catch(() => ({ data: [] }));
      const claims = await axiosInstance
        .get("/api/claims")
        .catch(() => ({ data: [] }));
      const payments = await axiosInstance
        .get("/api/payments")
        .catch(() => ({ data: [] }));

      return {
        data: {
          totalUsers: users.data?.length || 0,
          totalPolicies: policies.data?.length || 0,
          totalClaims: claims.data?.length || 0,
          totalPayments: payments.data?.length || 0,
          totalRevenue: (payments.data || []).reduce(
            (sum, p) => sum + (p.amount || 0),
            0
          ),
        },
      };
    } catch (err) {
      return {
        data: {
          totalUsers: 0,
          totalPolicies: 0,
          totalClaims: 0,
          totalPayments: 0,
          totalRevenue: 0,
        },
      };
    }
  },

  // Lấy báo cáo doanh thu
  getRevenueReport: async (params = {}) => {
    return { data: [] };
  },

  // Lấy báo cáo người dùng
  getUserReport: async (params = {}) => {
    return { data: [] };
  },

  // Lấy báo cáo chính sách
  getPolicyReport: async (params = {}) => {
    return { data: [] };
  },

  // ============ Settings ============

  // Lấy cài đặt hệ thống
  getSettings: async () => {
    return { data: { siteName: "Insurance Service", theme: "light" } };
  },

  // Cập nhật cài đặt hệ thống
  updateSettings: async (settings) => {
    return { data: { success: true } };
  },
};

export default adminService;
