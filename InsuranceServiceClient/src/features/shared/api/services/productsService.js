import axiosInstance from '../axios';

/**
 * Products Service
 * Handles API calls related to insurance products
 */

const productsService = {
  // Get all products
  getAllProducts: async (params = {}) => {
    return await axiosInstance.get('/api/products', { params });
  },

  // Get product by ID
  getProductById: async (productId) => {
    return await axiosInstance.get(`/api/admin/products/${productId}`);
  },

  // Get products by type
  getProductsByType: async (type, params = {}) => {
    return await axiosInstance.get(`/api/admin/products/type/${type}`, { params });
  },

  // Search products
  searchProducts: async (searchTerm, params = {}) => {
    return await axiosInstance.get('/api/admin/products/search', {
      params: { q: searchTerm, ...params },
    });
  },

  // Create product (Admin only)
  createProduct: async (productData) => {
    return await axiosInstance.post('/api/products', productData);
  },

  // Update product (Admin only)
  updateProduct: async (productId, productData) => {
    return await axiosInstance.put(`/api/products/${productId}`, productData);
  },

  // Delete product (Admin only)
  deleteProduct: async (productId) => {
    return await axiosInstance.delete(`/api/products/${productId}`);
  },

  // Get featured products
  getFeaturedProducts: async () => {
    return await axiosInstance.get('/api/admin/products/featured');
  },

  // Calculate premium
  calculatePremium: async (productId, calculationData) => {
    return await axiosInstance.post(`/api/products/${productId}/calculate-premium`, calculationData);
  },
};

export default productsService;
