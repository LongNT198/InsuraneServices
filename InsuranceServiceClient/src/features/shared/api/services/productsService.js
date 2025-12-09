import axiosInstance from '../axios';

/**
 * Products Service
 * Xử lý các API calls liên quan đến sản phẩm bảo hiểm
 */

const productsService = {
  // Lấy danh sách tất cả sản phẩm
  getAllProducts: async (params = {}) => {
    return await axiosInstance.get('/api/admin/products', { params });
  },

  // Lấy chi tiết sản phẩm theo ID
  getProductById: async (productId) => {
    return await axiosInstance.get(`/api/admin/products/${productId}`);
  },

  // Lấy sản phẩm theo loại
  getProductsByType: async (type, params = {}) => {
    return await axiosInstance.get(`/api/admin/products/type/${type}`, { params });
  },

  // Tìm kiếm sản phẩm
  searchProducts: async (searchTerm, params = {}) => {
    return await axiosInstance.get('/api/admin/products/search', {
      params: { q: searchTerm, ...params },
    });
  },

  // Tạo sản phẩm mới (Admin only)
  createProduct: async (productData) => {
    return await axiosInstance.post('/api/products', productData);
  },

  // Cập nhật sản phẩm (Admin only)
  updateProduct: async (productId, productData) => {
    return await axiosInstance.put(`/api/products/${productId}`, productData);
  },

  // Xóa sản phẩm (Admin only)
  deleteProduct: async (productId) => {
    return await axiosInstance.delete(`/api/products/${productId}`);
  },

  // Lấy các sản phẩm nổi bật
  getFeaturedProducts: async () => {
    return await axiosInstance.get('/api/admin/products/featured');
  },

  // Tính phí bảo hiểm
  calculatePremium: async (productId, calculationData) => {
    return await axiosInstance.post(`/api/products/${productId}/calculate-premium`, calculationData);
  },
};

export default productsService;
