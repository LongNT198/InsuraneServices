import axiosInstance from '../axios';

/**
 * Users Service (Admin only)
 * Xử lý các API calls liên quan đến quản lý người dùng
 */

const usersService = {
  // Lấy danh sách users (Admin)
  getAllUsers: async (params = {}) => {
    return await axiosInstance.get('/api/users', { params });
  },

  // Lấy thông tin user theo ID (Admin)
  getUserById: async (userId) => {
    return await axiosInstance.get(`/api/users/${userId}`);
  },

  // Tạo user mới (Admin)
  createUser: async (userData) => {
    return await axiosInstance.post('/api/users', userData);
  },

  // Cập nhật user (Admin)
  updateUser: async (userId, userData) => {
    return await axiosInstance.put(`/api/users/${userId}`, userData);
  },

  // Xóa user (Admin)
  deleteUser: async (userId) => {
    return await axiosInstance.delete(`/api/users/${userId}`);
  },

  // Khóa/mở khóa user (Admin)
  toggleUserStatus: async (userId, isActive) => {
    return await axiosInstance.post(`/api/users/${userId}/toggle-status`, { isActive });
  },

  // Gán role cho user (Admin)
  assignRole: async (userId, role) => {
    return await axiosInstance.post(`/api/users/${userId}/role`, { role });
  },

  // Lấy danh sách roles
  getRoles: async () => {
    return await axiosInstance.get('/api/users/roles');
  },

  // Tìm kiếm users (Admin)
  searchUsers: async (searchTerm, params = {}) => {
    return await axiosInstance.get('/api/users/search', {
      params: { q: searchTerm, ...params },
    });
  },
};

export default usersService;
