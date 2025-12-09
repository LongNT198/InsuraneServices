// src/features/shared/api/services/managerApplicationsService.js
import axiosInstance from "../axios";

// Service chuyên cho Manager xử lý Applications
const managerApplicationsService = {
  // Lấy danh sách các application đang Submitted
  getSubmittedApplications: async (params = {}) =>
    await axiosInstance.get("/api/manager/applications/submitted", { params }),

  // Lấy chi tiết 1 application theo id
  getApplicationDetails: async (id) =>
    await axiosInstance.get(`/api/manager/applications/${id}`),

  // Manager ra quyết định Approved / Rejected
  // data: { status: "Approved" | "Rejected", reviewNotes?: string }
  decideApplication: async (id, data) =>
    await axiosInstance.patch(`/api/manager/applications/${id}/decision`, data),
};

export default managerApplicationsService;
