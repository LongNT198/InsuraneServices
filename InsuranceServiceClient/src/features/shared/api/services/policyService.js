import axiosInstance from "../axios";

/**
 * policyService
 * Gọi tới PoliciesController (Customer)
 *
 * Backend hiện có các endpoint:
 *  - POST /api/policies                 (CreatePolicy)
 *  - GET  /api/policies/admin/all       (admin)
 *  - GET  /api/policies/my-policies     (user hiện tại)
 *  - GET  /api/policies/{id}            (chi tiết 1 policy của user)
 *  - PUT  /api/policies/{id}            (update - admin/manager/officer)
 *  - DELETE /api/policies/{id}          (delete - admin/manager)
 */

const policyService = {
  // Lấy danh sách policy của user đang đăng nhập
  getMyPolicies: async () => {
    return await axiosInstance.get("/api/policies/my-policies");
  },

  // Lấy chi tiết 1 policy (của user hiện tại)
  getPolicyById: async (policyId) => {
    return await axiosInstance.get(`/api/policies/${policyId}`);
  },

  // Tạo policy (hiện bạn không dùng flow này vì policy tạo sau khi Manager approve)
  createPolicy: async (data) => {
    return await axiosInstance.post("/api/policies", data);
  },

  // Cập nhật policy (Admin/Manager/Officer)
  updatePolicy: async (policyId, policyData) => {
    return await axiosInstance.put(`/api/policies/${policyId}`, policyData);
  },

  // Xoá policy (Admin/Manager)
  deletePolicy: async (policyId) => {
    return await axiosInstance.delete(`/api/policies/${policyId}`);
  },
};

export default policyService;
